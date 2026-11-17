import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Cookies from 'js-cookie'
import { renderWithProviders } from '../../../utils/test-utils'
import { makeStore } from '../../../app/store'
import { addDisksToCart, addTyresToCart, selectProductHandler } from '../../../app/slices/cartSlice'
import { setName, setPhone } from '../../../app/slices/authSlice'
import type { resultsTyresType } from '../../../types/tires'
import type { resultsDisksType } from '../../../types/disks'
import { authApi } from '../../../api/auth'
import { orderApi } from '../../../api/order'
import { RegModal } from '../../common/RegModal'
import { PlacingOrder } from './PlacingOrder'

vi.mock('../../../api/auth', () => ({ authApi: { getSmsCode: vi.fn(), login: vi.fn() } }))
vi.mock('../../../api/order', () => ({ orderApi: { createOrder: vi.fn() } }))
vi.mock('../../footer/Footer', () => ({ Footer: () => <div /> }))

const renderCheckout = (verified = false) => {
  const store = makeStore()
  store.dispatch(addTyresToCart({ id: 1, name: 'Тестовая шина', product_type: 'Шины', amount: 2, balance: 8, price_sale: 100.25, width: '205', height: '55', diameter: '16', load: '91', speed: 'T', seazon: 'зима', image_url: '/mock-tyre.png' } as resultsTyresType))
  store.dispatch(addDisksToCart({ id: 2, name: 'Снятый диск', product_type: 'Диски', amount: 4, balance: 8, price_sale: 200, width: '6.5', diameter: '16', holesquant: '5', pcd: '114.3', wheeloffset: '40', dia: '67.1', image_url: '/mock-disk.png' } as resultsDisksType))
  store.dispatch(selectProductHandler({ productType: 'Диски', id: 2 }))
  store.dispatch(setName('Алёна'))
  store.dispatch(setPhone('79990001122'))
  if (verified) {
    Cookies.set('token', 'mock-token')
    localStorage.setItem('customerLocalData', JSON.stringify({ name: 'Алёна', phone: '79990001122' }))
  }
  return renderWithProviders(<HelmetProvider><MemoryRouter><PlacingOrder /><RegModal /></MemoryRouter></HelmetProvider>, { store })
}

beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); Cookies.remove('token') })
afterEach(() => { cleanup(); Cookies.remove('token') })

describe('Оформление с изолированными API', () => {
  it('не подсвечивает подтверждение до валидных данных и подставляет +7', () => {
    renderCheckout()
    const button = screen.getByRole('button', { name: 'Подтвердить телефон' })
    fireEvent.change(screen.getByLabelText(/Имя/), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText(/Телефон/), { target: { value: '' } })
    expect(button).toBeDisabled()
    expect(screen.getByLabelText(/Телефон/)).toHaveValue('+7')
    fireEvent.change(screen.getByLabelText(/Имя/), { target: { value: 'Иван' } })
    fireEvent.change(screen.getByLabelText(/Телефон/), { target: { value: '9990001122' } })
    expect(screen.getByLabelText(/Телефон/)).toHaveValue('+79990001122')
    expect(button).toBeEnabled()
    expect(authApi.getSmsCode).not.toHaveBeenCalled()
  })

  it('сохраняет явный код другой страны при открытии SMS-подтверждения', () => {
    const { store } = renderCheckout()
    fireEvent.change(screen.getByLabelText(/Телефон/), { target: { value: '+4930123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Подтвердить телефон' }))
    expect(store.getState().auth.phone).toBe('+4930123456')
    expect(screen.getByRole('dialog')).toHaveTextContent('+4930123456')
    expect(authApi.getSmsCode).not.toHaveBeenCalled()
  })

  it('показывает узнаваемую модель и исключает снятую позицию из итога и реального payload', async () => {
    vi.mocked(orderApi.createOrder).mockResolvedValue({ order: 73 })
    renderCheckout(true)
    expect(screen.getByText('Тестовая шина')).toBeInTheDocument()
    expect(screen.queryByText('Снятый диск')).not.toBeInTheDocument()
    expect(screen.getByText('205/55 R16 91T')).toBeInTheDocument()
    expect(screen.getByLabelText(/Имя/)).toHaveValue('Алёна')
    fireEvent.click(screen.getByRole('button', { name: 'Оформить заказ' }))
    await waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    expect(orderApi.createOrder).toHaveBeenCalledWith({ total_amount: 200.5, order_items: { tyres: [{ id: 1, quantity: 2, price: 100.25 }] } }, 'mock-token')
  })

  it('SMS-подтверждение не отправляет заказ, нужно отдельное оформление', async () => {
    vi.mocked(authApi.getSmsCode).mockResolvedValue(undefined)
    vi.mocked(authApi.login).mockResolvedValue({ token: 'mock-token' })
    vi.mocked(orderApi.createOrder).mockResolvedValue({ order: 74 })
    renderCheckout()
    fireEvent.click(screen.getByRole('button', { name: 'Подтвердить телефон' }))
    fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' }))
    const input = await screen.findByLabelText('Код из SMS')
    fireEvent.change(input, { target: { value: '654321' } })
    await screen.findByRole('heading', { name: 'Телефон подтверждён' })
    expect(orderApi.createOrder).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Вернуться к оформлению' }))
    expect(screen.getByText('Телефон подтверждён. Теперь можно оформить заказ.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Оформить заказ' }))
    await waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
  })

  it('показывает pending и ошибку заказа, сохраняя имя, телефон и корзину', async () => {
    let resolve!: (value: undefined) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const { store } = renderCheckout(true)
    const submitButton = screen.getByRole('button', { name: 'Оформить заказ' })
    fireEvent.click(submitButton)
    expect(submitButton).toBeDisabled()
    fireEvent.click(submitButton)
    expect(orderApi.createOrder).toHaveBeenCalledTimes(1)
    resolve(undefined)
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось оформить заказ')
    expect(screen.getByLabelText(/Имя/)).toHaveValue('Алёна')
    expect(screen.getByLabelText(/Телефон/)).toHaveValue('+79990001122')
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Оформить заказ' })).toBeEnabled()
  })
})
