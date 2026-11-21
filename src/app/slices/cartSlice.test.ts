import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { orderApi } from '../../api/order'
import type { resultsTyresType } from '../../types/tires'
import type { resultsDisksType } from '../../types/disks'
import type { OrderResult } from '../../api/order'
import type * as OrderModule from '../../api/order'
import {
  addDisksToCart, addTyresToCart, buildOrderPayload, cartSlice, changeAmount, createOrder,
  cartSignature, delOneTypeProduct, hydrateOrderIntent, orderIsCreating, pullLocalStorageData, resetCart,
  selectAllHandler, selectProductHandler, setCheckoutCustomer, startNewOrderIntent,
} from './cartSlice'

vi.mock('../../api/order', async importOriginal => ({ ...await importOriginal<typeof OrderModule>(), orderApi: { createOrder: vi.fn() } }))

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

const customer = '79990000001'
const success: OrderResult = { kind: 'success', status: 201, order: 42 }
const requestArgs = (store: ReturnType<typeof storeWithProducts>) => ({ order: buildOrderPayload(store.getState().cart), token: 'mock-token', customer })
const intentArgs = (store: ReturnType<typeof storeWithProducts>) => ({ customer, order: buildOrderPayload(store.getState().cart), cartSignature: cartSignature(store.getState().cart) })

describe('Асинхронное оформление только с mock API', () => {
  it('pending отправляет выбранный payload/ключ и очищает только подтверждённые выбранные строки', async () => {
    let resolve!: (value: OrderResult) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const store = storeWithProducts()
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 1 }))
    const args = requestArgs(store)
    const task = store.dispatch(createOrder(args))
    expect(store.getState().cart.creatingOrder).toBe(true)
    await vi.waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    resolve(success)
    await task
    expect(orderApi.createOrder).toHaveBeenCalledWith(args.order, 'mock-token', expect.any(String))
    expect(store.getState().cart).toMatchObject({ creatingOrder: false, orderNumber: 42, orderIssue: null, disks: [] })
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(store.getState().cart.tyres[0].canceled).toBe(true)
    expect(JSON.parse(localStorage.getItem('cartData')!).tyres).toHaveLength(1)
    store.dispatch(orderIsCreating())
    expect(store.getState().cart.orderNumber).toBe(0)
  })

  it('подтверждение не удаляет запись другой вкладки, появившуюся после чтения cartData', async () => {
    let resolve!: (value: OrderResult) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const store = storeWithProducts()
    const pending = store.dispatch(createOrder(requestArgs(store)))
    await vi.waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    const anotherCart = JSON.stringify({ tyres: [...store.getState().cart.tyres,
      { ...tyre(9), canceled: false, queue: 2, cartLineToken: 'new-other-tab-line' }], disks: store.getState().cart.disks })
    const get = Storage.prototype.getItem
    const set = Storage.prototype.setItem
    let interleaved = false
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) {
      const observed = get.call(this, key)
      if (key === 'cartData' && !interleaved) { interleaved = true; set.call(this, key, anotherCart) }
      return observed
    })
    try {
      resolve(success)
      await pending
      expect(interleaved).toBe(true)
      expect(JSON.parse(localStorage.getItem('cartData')!).tyres.some((line: resultsTyresType) => line.id === 9)).toBe(true)
      const reloaded = configureStore({ reducer: { cart: cartSlice.reducer } })
      reloaded.dispatch(pullLocalStorageData())
      expect(reloaded.getState().cart.tyres.map(line => line.id)).toEqual([9])
      expect(reloaded.getState().cart.disks).toHaveLength(0)
    } finally { spy.mockRestore() }
  })

  it('гидратация старой корзины без версий не возвращает уже подтверждённые строки', async () => {
    const original = storeWithProducts()
    const legacy = JSON.parse(localStorage.getItem('cartData')!)
    for (const item of [...legacy.tyres, ...legacy.disks]) delete item.cartLineToken
    localStorage.setItem('cartData', JSON.stringify(legacy))
    original.dispatch(pullLocalStorageData())
    vi.mocked(orderApi.createOrder).mockResolvedValue(success)
    await original.dispatch(createOrder(requestArgs(original)))
    const reloaded = configureStore({ reducer: { cart: cartSlice.reducer } })
    reloaded.dispatch(pullLocalStorageData())
    expect(reloaded.getState().cart.tyres).toHaveLength(0)
    expect(reloaded.getState().cart.disks).toHaveLength(0)
    expect(orderApi.createOrder).toHaveBeenCalledTimes(1)
    reloaded.dispatch(addTyresToCart(tyre()))
    expect(reloaded.getState().cart.tyres).toHaveLength(1)
  })

  it('сетевая ошибка сохраняет корзину и ключ, retry не становится новым намерением', async () => {
    vi.mocked(orderApi.createOrder).mockResolvedValue({ kind: 'failure', status: null, code: 'network_error' })
    const store = storeWithProducts()
    await store.dispatch(createOrder(requestArgs(store)))
    await store.dispatch(createOrder(requestArgs(store)))
    expect(store.getState().cart).toMatchObject({ creatingOrder: false, orderIssue: { code: 'network_error' } })
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(store.getState().cart.disks).toHaveLength(1)
    expect(vi.mocked(orderApi.createOrder).mock.calls[1][2]).toBe(vi.mocked(orderApi.createOrder).mock.calls[0][2])
  })

  it('старый id/type не удаляет товар и неожиданный результат не считается успехом', async () => {
    vi.mocked(orderApi.createOrder).mockResolvedValue({ kind: 'failure', status: 404, code: 'unexpected_response' })
    const store = storeWithProducts()
    await store.dispatch(createOrder(requestArgs(store)))
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(store.getState().cart.priceAmount).toBe(802)
    expect(store.getState().cart.orderNumber).toBe(0)
    expect(store.getState().cart.orderIssue?.code).toBe('unexpected_response')
  })

  it('повтор dispatch во время pending не вызывает HTTP и не сбрасывает loading первого', async () => {
    let resolve!: (value: OrderResult) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const store = storeWithProducts()
    const args = requestArgs(store)
    const first = store.dispatch(createOrder(args))
    await store.dispatch(createOrder(args))
    expect(store.getState().cart.creatingOrder).toBe(true)
    await vi.waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    resolve(success)
    await first
    expect(orderApi.createOrder).toHaveBeenCalledTimes(1)
  })

  it('не теряет добавленные/снятые/изменённые во время запроса строки', async () => {
    let resolve!: (value: OrderResult) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const store = storeWithProducts()
    const task = store.dispatch(createOrder(requestArgs(store)))
    await vi.waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    store.dispatch(selectProductHandler({ productType: 'Шины', id: 1 }))
    store.dispatch(addTyresToCart(tyre(3)))
    store.dispatch(changeAmount({ type: 'Диски', id: 2, isPlus: true }))
    resolve(success)
    await task
    expect(store.getState().cart.tyres).toHaveLength(2)
    expect(store.getState().cart.disks[0].amount).toBe(4)
    expect(store.getState().cart.orderCartChanged).toBe(true)
  })

  it('удалённая и заново добавленная такая же позиция имеет другую версию и остаётся', async () => {
    let resolve!: (value: OrderResult) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const store = storeWithProducts()
    const task = store.dispatch(createOrder(requestArgs(store)))
    await vi.waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    store.dispatch(delOneTypeProduct({ productType: 'Шины', id: 1 }))
    store.dispatch(addTyresToCart(tyre()))
    resolve(success)
    await task
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(store.getState().cart.disks).toHaveLength(0)
  })

  it('после успеха новый намеренный такой же состав получает новый ключ', async () => {
    vi.mocked(orderApi.createOrder).mockResolvedValue(success)
    const store = storeWithProducts()
    await store.dispatch(createOrder(requestArgs(store)))
    store.dispatch(orderIsCreating())
    store.dispatch(addTyresToCart(tyre()))
    store.dispatch(addDisksToCart(disk()))
    await store.dispatch(createOrder(requestArgs(store)))
    expect(orderApi.createOrder).toHaveBeenCalledTimes(2)
    expect(vi.mocked(orderApi.createOrder).mock.calls[0][0]).toEqual(vi.mocked(orderApi.createOrder).mock.calls[1][0])
    expect(vi.mocked(orderApi.createOrder).mock.calls[1][2]).not.toBe(vi.mocked(orderApi.createOrder).mock.calls[0][2])
  })

  it('review переживает восстановление и очистку корзины, новая отправка запрещена', async () => {
    vi.mocked(orderApi.createOrder).mockResolvedValue({ kind: 'failure', status: 503, code: 'order_requires_review', reference: 91 })
    const first = storeWithProducts()
    await first.dispatch(createOrder(requestArgs(first)))
    const store = configureStore({ reducer: { cart: cartSlice.reducer } })
    store.dispatch(pullLocalStorageData())
    store.dispatch(setCheckoutCustomer(customer))
    await store.dispatch(hydrateOrderIntent(intentArgs(store)))
    expect(store.getState().cart.orderIssue).toMatchObject({ code: 'order_requires_review', reference: 91 })
    store.dispatch(resetCart())
    await store.dispatch(createOrder(requestArgs(store)))
    expect(orderApi.createOrder).toHaveBeenCalledTimes(1)
  })

  it('определённый отказ требует явного нового намерения с другим ключом', async () => {
    vi.mocked(orderApi.createOrder).mockResolvedValue({ kind: 'failure', status: 502, code: 'supplier_rejected', reference: 91 })
    const store = storeWithProducts()
    await store.dispatch(createOrder(requestArgs(store)))
    await store.dispatch(createOrder(requestArgs(store)))
    expect(orderApi.createOrder).toHaveBeenCalledTimes(1)
    await store.dispatch(startNewOrderIntent(intentArgs(store)))
    expect(store.getState().cart.orderIssue).toBeNull()
    vi.mocked(orderApi.createOrder).mockResolvedValue(success)
    await store.dispatch(createOrder(requestArgs(store)))
    expect(vi.mocked(orderApi.createOrder).mock.calls[1][2]).not.toBe(vi.mocked(orderApi.createOrder).mock.calls[0][2])
  })

  it('устаревший fulfilled не очищает корзину и не показывает чужой номер', async () => {
    let resolve!: (value: OrderResult) => void
    vi.mocked(orderApi.createOrder).mockImplementation(() => new Promise(done => { resolve = done }))
    const store = storeWithProducts()
    const args = requestArgs(store)
    const task = store.dispatch(createOrder(args))
    store.dispatch(createOrder.fulfilled({ kind: 'success', status: 201, order: 999 }, 'old-request', args))
    expect(store.getState().cart.orderNumber).toBe(0)
    expect(store.getState().cart.creatingOrder).toBe(true)
    await vi.waitFor(() => expect(orderApi.createOrder).toHaveBeenCalledTimes(1))
    store.dispatch(setCheckoutCustomer('79990000002'))
    resolve(success)
    await task
    expect(store.getState().cart.orderNumber).toBe(0)
    expect(store.getState().cart.tyres).toHaveLength(1)
    expect(store.getState().cart.creatingOrder).toBe(false)
  })
})
