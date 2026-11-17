import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { renderWithProviders } from '../../../utils/test-utils'
import { makeStore } from '../../../app/store'
import { addDisksToCart, addTyresToCart } from '../../../app/slices/cartSlice'
import type { resultsTyresType } from '../../../types/tires'
import type { resultsDisksType } from '../../../types/disks'
import type { selectedType } from '../../../types/cart'
import { Cart } from './Cart'
import { cartProductSize } from './blocks/cards/CartTyresCards'

vi.mock('../../../api/order', () => ({ orderApi: { createOrder: vi.fn() } }))
vi.mock('../../footer/Footer', () => ({ Footer: () => <div /> }))

const renderCart = (runflat: string | null = null) => {
  const store = makeStore()
  store.dispatch(addTyresToCart({ id: 1, name: 'Тестовая шина', product_type: 'Шины', amount: 1, balance: 2, price_sale: 100.25, width: '205', height: '55', diameter: '16', load: '91', speed: 'T', seazon: 'зима', runflat, image_url: '/mock-tyre.png' } as resultsTyresType))
  store.dispatch(addDisksToCart({ id: 2, name: 'Тестовый диск', product_type: 'Диски', amount: 2, balance: 2, price_sale: 200, width: '6.5', diameter: '16', holesquant: '5', pcd: '114.3', wheeloffset: '40', dia: '67.1', image_url: '/mock-disk.png' } as resultsDisksType))
  return renderWithProviders(<HelmetProvider><MemoryRouter><Cart /></MemoryRouter></HelmetProvider>, { store })
}

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('Управление настоящей корзиной', () => {
  it('располагает общие действия перед обеими колонками и сохраняет нижний блок карточек', () => {
    renderCart()
    const toolbar = screen.getByRole('group', { name: 'Действия с корзиной' })
    const columns = toolbar.nextElementSibling
    const products = screen.getByRole('list', { name: 'Товары в корзине' })
    const summary = screen.getByRole('region', { name: 'Ваш заказ' })

    expect(columns).not.toBeNull()
    expect(products.parentElement?.parentElement).toBe(columns)
    expect(summary.closest('aside')?.parentElement).toBe(columns)
    expect(within(toolbar).getByRole('checkbox', { name: 'Выбрать все' })).toBeInTheDocument()
    expect(within(toolbar).getByRole('button', { name: 'Очистить корзину' })).toBeInTheDocument()

    const cards = within(products).getAllByRole('listitem')
    expect(cards).toHaveLength(2)
    for (const card of cards) {
      const footer = card.lastElementChild
      expect(footer).toContainElement(within(card).getByRole('button', { name: /^Уменьшить количество:/ }))
      expect(footer).toContainElement(within(card).getByLabelText(/^Сумма за /))
    }
  })

  it.each(['нет', '0', 'false', '_', '-', 'null', ' '])('не приписывает RunFlat при отрицательном значении %s', value => {
    renderCart(value)
    const card = screen.getByRole('heading', { name: 'Тестовая шина' }).closest('article')
    expect(card).not.toHaveTextContent('RunFlat')
  })

  it.each(['RFT', 'RunFlat'])('показывает положительный признак RunFlat: %s', value => {
    renderCart(value)
    const card = screen.getByRole('heading', { name: 'Тестовая шина' }).closest('article')
    expect(card).toHaveTextContent('RunFlat')
  })

  it('не дублирует число креплений в уже собранном PCD', () => {
    const disk = { width: '7', diameter: '17', holesquant: '5', pcd: '5×112', wheeloffset: '45', dia: '66.6', canceled: false, queue: 0 } as resultsDisksType & selectedType
    expect(cartProductSize(disk)).toBe('7×17 · 5×112 · ET45 · DIA 66.6')
    expect(cartProductSize({ ...disk, pcd: '112' })).toBe('7×17 · 5×112 · ET45 · DIA 66.6')
  })

  it('не дублирует R в диаметре шины', () => {
    const tyre = { width: '205', height: '55', diameter: 'R16', load: '91', speed: 'T', canceled: false, queue: 0 } as resultsTyresType & selectedType
    expect(cartProductSize(tyre)).toBe('205/55 R16 91T')
    expect(cartProductSize({ ...tyre, diameter: '16' })).toBe('205/55 R16 91T')
  })

  it('кнопка Очистить действительно удаляет и выбранные, и снятые позиции', () => {
    const { store } = renderCart()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Выбрать Тестовая шина' }))
    fireEvent.click(screen.getByRole('button', { name: 'Очистить корзину' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Очистить' }))
    expect(screen.getByRole('heading', { name: 'Корзина пуста' })).toBeInTheDocument()
    expect(store.getState().cart.tyres).toEqual([])
    expect(store.getState().cart.disks).toEqual([])
    expect(localStorage.getItem('cartData')).toBeNull()
  })

  it('сохраняет обе карточки, но убирает снятые товары из узнаваемого итога', () => {
    renderCart()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Выбрать Тестовая шина' }))
    expect(screen.getByRole('heading', { name: 'Тестовая шина' })).toBeInTheDocument()
    const summary = screen.getByRole('region', { name: 'Ваш заказ' })
    expect(within(summary).queryByText('Тестовая шина')).not.toBeInTheDocument()
    expect(within(summary).getByText('Тестовый диск')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Выбрать все' })).not.toBeChecked()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Выбрать все' }))
    expect(screen.getByRole('checkbox', { name: 'Выбрать Тестовая шина' })).toBeChecked()
  })

  it('показывает реальные пределы количества и блокирует переход без выбранных товаров', () => {
    const { store } = renderCart()
    expect(screen.getByRole('button', { name: 'Уменьшить количество: Тестовая шина' })).toBeDisabled()
    const diskPlus = screen.getByRole('button', { name: 'Увеличить количество: Тестовый диск' })
    expect(diskPlus).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(diskPlus)
    expect(store.getState().cart.disks[0].amount).toBe(2)
    const diskCard = screen.getByRole('heading', { name: 'Тестовый диск' }).closest('article')!
    expect(within(diskCard).getByText('Доступно только 2 шт.')).toBeInTheDocument()
    const tyrePlus = screen.getByRole('button', { name: 'Увеличить количество: Тестовая шина' })
    fireEvent.click(tyrePlus)
    expect(store.getState().cart.tyres[0].amount).toBe(2)
    expect(tyrePlus).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(tyrePlus)
    expect(store.getState().cart.tyres[0].amount).toBe(2)
    const tyreCard = screen.getByRole('heading', { name: 'Тестовая шина' }).closest('article')!
    expect(within(tyreCard).getByText('Доступно только 2 шт.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Выбрать все' }))
    expect(screen.getByRole('button', { name: 'К оформлению' })).toBeDisabled()
  })
})
