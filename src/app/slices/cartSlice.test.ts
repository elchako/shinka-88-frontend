import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { orderApi } from '../../api/order'
import type { resultsTyresType } from '../../types/tires'
import type { resultsDisksType } from '../../types/disks'
import {
  addDisksToCart, addTyresToCart, buildOrderPayload, cartSlice, changeAmount, createOrder,
  orderIsCreating, pullLocalStorageData, resetCart, selectAllHandler, selectProductHandler,
} from './cartSlice'

vi.mock('../../api/order', () => ({ orderApi: { createOrder: vi.fn() } }))

const tyre = (id = 1, amount = 2, price_sale = 100.25): resultsTyresType => ({
  id, amount, price_sale, balance: 4, name: `Шина ${id}`, product_type: 'Шины',
} as resultsTyresType)
const disk = (id = 2): resultsDisksType => ({
  id, amount: 3, price_sale: 200.5, balance: 8, name: `Диск ${id}`, product_type: 'Диски',
} as resultsDisksType)
const storeWithProducts = () => {
  const store = configureStore({ reducer: { cart: cartSlice.reducer } })
  store.dispatch(addTyresToCart(tyre()))
  store.dispatch(addDisksToCart(disk()))
  return store
}

beforeEach(() => { localStorage.clear(); vi.clearAllMocks() })

describe('Корзина: состав заказа и очистка', () => {
  it('исключает снятые шины из суммы и payload, сохраняет реальную дробную цену', () => {
    const store = storeWithProducts()
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 1 }))
    const state = store.getState().cart
    expect(state.tyres).toHaveLength(1)
    expect(state.priceAmount).toBe(601.5)
    expect(buildOrderPayload(state)).toEqual({
      total_amount: 601.5,
      order_items: { disks: [{ id: 2, quantity: 3, price: 200.5 }] },
    })
  })

  it('исключает снятые диски, при отсутствии выбора возвращает пустой состав и нулевую сумму', () => {
    const store = storeWithProducts()
    store.dispatch(selectProductHandler({ productType: 'Диски', id: 2 }))
    expect(buildOrderPayload(store.getState().cart).order_items).toEqual({ tyres: [{ id: 1, quantity: 2, price: 100.25 }] })
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 1 }))
    expect(buildOrderPayload(store.getState().cart)).toEqual({ total_amount: 0, order_items: {} })
  })

  it('Очистить удаляет абсолютно все товары, в том числе снятые, и сохранённую корзину', () => {
    const store = storeWithProducts()
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 1 }))
    expect(localStorage.getItem('cartData')).not.toBeNull()
    store.dispatch(resetCart())
    expect(store.getState().cart).toMatchObject({ tyres: [], disks: [], priceAmount: 0, queueCounter: 0, selectAll: true })
    expect(localStorage.getItem('cartData')).toBeNull()
  })

  it('согласует Выбрать все после одиночного снятия и повторного выбора', () => {
    const store = storeWithProducts()
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 1 }))
    expect(store.getState().cart.selectAll).toBe(false)
    store.dispatch(selectAllHandler())
    expect(store.getState().cart.selectAll).toBe(true)
    expect(store.getState().cart.priceAmount).toBe(802)
    store.dispatch(selectAllHandler())
    expect(store.getState().cart.priceAmount).toBe(0)
  })

  it('не меняет чужую позицию по отсутствующему id', () => {
    const store = storeWithProducts()
    const previous = store.getState().cart
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 999 }))
    expect(store.getState().cart).toEqual(previous)
  })

  it('ограничивает количество при добавлении и изменении диапазоном 1..balance', () => {
    const store = storeWithProducts()
    store.dispatch(addTyresToCart(tyre(1, 999)))
    expect(store.getState().cart.tyres[0].amount).toBe(4)
    store.dispatch(changeAmount({ type: 'Шины', id: 1, isPlus: true }))
    expect(store.getState().cart.tyres[0].amount).toBe(4)
    store.dispatch(addTyresToCart(tyre(1, 0)))
    store.dispatch(changeAmount({ type: 'Шины', id: 1, isPlus: false }))
    expect(store.getState().cart.tyres[0].amount).toBe(1)
    expect(store.getState().cart.tyres[0].balance).toBe(4)
  })

  it('пересчитывает сохранённую сумму, не доверяет устаревшему priceAmount', () => {
    const store = storeWithProducts()
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 1 }))
    const saved = JSON.parse(localStorage.getItem('cartData')!)
    saved.priceAmount = 99999
    localStorage.setItem('cartData', JSON.stringify(saved))
    store.dispatch(pullLocalStorageData())
    expect(store.getState().cart.priceAmount).toBe(601.5)
  })
})

describe('Асинхронное оформление только с mock API', () => {
  it('выставляет явный pending, отправляет выбранный payload и показывает настоящий номер заказа', async () => {
    let resolve!: (value: { order: number }) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const store = storeWithProducts()
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 1 }))
    const order = buildOrderPayload(store.getState().cart)
    const task = store.dispatch(createOrder({ order, token: 'mock-token' }))
    expect(store.getState().cart.creatingOrder).toBe(true)
    resolve({ order: 42 })
    await task
    expect(orderApi.createOrder).toHaveBeenCalledWith(order, 'mock-token')
    expect(store.getState().cart).toMatchObject({ creatingOrder: false, orderNumber: 42, orderError: '', tyres: [], disks: [] })
    store.dispatch(orderIsCreating())
    expect(store.getState().cart.orderNumber).toBe(0)
  })

  it('сетевая ошибка не очищает корзину, не оставляет вечную загрузку и доступна inline', async () => {
    vi.mocked(orderApi.createOrder).mockResolvedValue(undefined)
    const store = storeWithProducts()
    await store.dispatch(createOrder({ order: buildOrderPayload(store.getState().cart), token: 'mock-token' }))
    expect(store.getState().cart.creatingOrder).toBe(false)
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(store.getState().cart.disks).toHaveLength(1)
    expect(store.getState().cart.orderError).toContain('Не удалось оформить заказ')
  })

  it('сохраняет прежний контракт ошибки отсутствующего товара и пересчитывает итог', async () => {
    vi.mocked(orderApi.createOrder).mockResolvedValue({ id: 1, type: 'tyre' })
    const store = storeWithProducts()
    await store.dispatch(createOrder({ order: buildOrderPayload(store.getState().cart), token: 'mock-token' }))
    expect(store.getState().cart.tyres).toHaveLength(0)
    expect(store.getState().cart.priceAmount).toBe(601.5)
    expect(store.getState().cart.orderError).toContain('Шина 1')
  })
})
