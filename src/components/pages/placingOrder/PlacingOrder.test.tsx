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
import { orderApi, type OrderResult } from '../../../api/order'
import type * as OrderModule from '../../../api/order'
import { RegModal } from '../../common/RegModal'
import { PlacingOrder } from './PlacingOrder'

vi.mock('../../../api/auth', () => ({ authApi: { getSmsCode: vi.fn(), login: vi.fn() } }))
vi.mock('../../../api/order', async importOriginal => ({ ...await importOriginal<typeof OrderModule>(), orderApi: { createOrder: vi.fn() } }))
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
    vi.mocked(orderApi.createOrder).mockResolvedValue({ kind: 'success', status: 201, order: 73 })
    renderCheckout(true)
    expect(screen.getByText('Тестовая шина')).toBeInTheDocument()
    expect(screen.queryByText('Снятый диск')).not.toBeInTheDocument()
    expect(screen.getByText('205/55 R16 91T')).toBeInTheDocument()
    expect(screen.getByLabelText(/Имя/)).toHaveValue('Алёна')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Оформить заказ' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: 'Оформить заказ' }))
    await waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    expect(orderApi.createOrder).toHaveBeenCalledWith({ total_amount: 200.5, order_items: { tyres: [{ id: 1, quantity: 2, price: 100.25 }] } }, 'mock-token', expect.any(String))
  })

  it('SMS-подтверждение не отправляет заказ, нужно отдельное оформление', async () => {
    vi.mocked(authApi.getSmsCode).mockResolvedValue(undefined)
    vi.mocked(authApi.login).mockResolvedValue({ token: 'mock-token' })
    vi.mocked(orderApi.createOrder).mockResolvedValue({ kind: 'success', status: 201, order: 74 })
    renderCheckout()
    fireEvent.click(screen.getByRole('button', { name: 'Подтвердить телефон' }))
    fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' }))
    const input = await screen.findByLabelText('Код из SMS')
    fireEvent.change(input, { target: { value: '654321' } })
    await screen.findByRole('heading', { name: 'Телефон подтверждён' })
    expect(orderApi.createOrder).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Вернуться к оформлению' }))
    expect(screen.getByText('Телефон подтверждён. Теперь можно оформить заказ.')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Оформить заказ' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: 'Оформить заказ' }))
    await waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
  })

  it('показывает pending и ошибку заказа, сохраняя имя, телефон и корзину', async () => {
    let resolve!: (value: OrderResult) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const { store } = renderCheckout(true)
    const submitButton = screen.getByRole('button', { name: 'Оформить заказ' })
    await waitFor(() => expect(submitButton).toBeEnabled())
    fireEvent.click(submitButton)
    expect(submitButton).toBeDisabled()
    fireEvent.click(submitButton)
    await waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    resolve({ kind: 'failure', status: null, code: 'network_error' })
    expect(await screen.findByRole('alert')).toHaveTextContent('Результат заказа пока неизвестен')
    expect(screen.getByLabelText(/Имя/)).toHaveValue('Алёна')
    expect(screen.getByLabelText(/Телефон/)).toHaveValue('+79990001122')
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Повторить тот же запрос' })).toBeEnabled()
  })

  it.each([['order_pending', 409], ['order_requires_review', 503]] as const)('%s показывает reference/связь и блокирует повтор даже после перезагрузки', async (code, status) => {
    vi.mocked(orderApi.createOrder).mockResolvedValue({ kind: 'failure', status, code, reference: 987654321 })
    renderCheckout(true)
    const button = screen.getByRole('button', { name: 'Оформить заказ' })
    await waitFor(() => expect(button).toBeEnabled())
    fireEvent.click(button)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Номер заявки: 987654321')
    expect(alert).not.toHaveTextContent('попробуйте ещё раз')
    expect(screen.getByRole('link', { name: 'Связаться с магазином' })).toHaveAttribute('href', expect.stringMatching(/^tel:/))
    expect(button).toBeDisabled()
    fireEvent.submit(document.getElementById('checkout-form')!)
    expect(orderApi.createOrder).toHaveBeenCalledTimes(1)
    cleanup()
    renderCheckout(true)
    expect(await screen.findByRole('alert')).toHaveTextContent('987654321')
    expect(screen.getByRole('button', { name: 'Оформить заказ' })).toBeDisabled()
    expect(orderApi.createOrder).toHaveBeenCalledTimes(1)
  })

  it.each(['price_changed', 'product_unavailable'] as const)('%s ведёт к проверке корзины и не меняет цены/товары', async code => {
    vi.mocked(orderApi.createOrder).mockResolvedValue({ kind: 'failure', status: 409, code })
    const { store } = renderCheckout(true)
    const button = screen.getByRole('button', { name: 'Оформить заказ' })
    await waitFor(() => expect(button).toBeEnabled())
    fireEvent.click(button)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Вернитесь в корзину')
    expect(screen.getByRole('link', { name: 'Вернуться в корзину' })).toHaveAttribute('href', '/cart')
    expect(store.getState().cart.tyres[0].price_sale).toBe(100.25)
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(button).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Корзина проверена, начать заново' }))
    await waitFor(() => expect(button).toBeEnabled())
    expect(orderApi.createOrder).toHaveBeenCalledTimes(1)
  })

  it('не отправляет HTTP при недоступном storage и сохраняет поля/корзину на экране', async () => {
    const { store } = renderCheckout(true)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('storage-disabled') })
    const button = screen.getByRole('button', { name: 'Оформить заказ' })
    await waitFor(() => expect(button).toBeEnabled())
    fireEvent.click(button)
    expect(await screen.findByRole('alert')).toHaveTextContent('Новая отправка не выполнялась')
    expect(orderApi.createOrder).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Имя/)).toHaveValue('Алёна')
    expect(store.getState().cart.tyres).toHaveLength(1)
    vi.restoreAllMocks()
  })
})
