import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { OrderResult } from '../api/order'
import { CHECKOUT_STORAGE_PREFIX, restartOrderIntent, restoreOrderIntent, submitOrderIntent, type IntentContext } from './orderIntent'

const args = (): IntentContext => ({ customer: '79990000001', cartSignature: 'synthetic-cart-line-v1',
  order: { total_amount: 202, order_items: { tyres: [{ id: 1, quantity: 2, price: 101 }] } } })
const network: OrderResult = { kind: 'failure', status: null, code: 'network_error' }
const success: OrderResult = { kind: 'success', status: 201, order: 42 }
const saved = () => {
  const key = Object.keys(localStorage).find(key => key.startsWith(CHECKOUT_STORAGE_PREFIX))!
  return { key, data: JSON.parse(localStorage.getItem(key)!) }
}
beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('Постоянное намерение до HTTP, без настоящей сети', () => {
  it('фиксирует ключ до вызова транспорта и не хранит телефон/token', async () => {
    const context = args()
    await submitOrderIntent(context, async key => {
      expect(saved().data).toMatchObject({ phase: 'sending', key })
      expect(key).toMatch(/^[a-zA-Z0-9_.:-]{1,128}$/)
      expect(JSON.stringify(localStorage)).not.toContain(context.customer)
      expect(JSON.stringify(localStorage)).not.toContain('synthetic-token')
      return network
    })
  })

  it('повтор и эмуляция reload сохраняют ключ, порядок строк не влияет', async () => {
    const send = vi.fn().mockResolvedValue(network)
    await submitOrderIntent(args(), send)
    const firstKey = send.mock.calls[0][0]
    expect((await restoreOrderIntent(args()))?.kind).toBe('failure')
    await submitOrderIntent(args(), send)
    expect(send.mock.calls[1][0]).toBe(firstKey)
    expect(saved().data.key).toBe(firstKey)
  })

  it('изменённый состав после потерянного ответа не получает новый ключ и HTTP', async () => {
    const send = vi.fn().mockResolvedValue(network)
    await submitOrderIntent(args(), send)
    const changed = args()
    changed.order.order_items.tyres![0].quantity = 3
    changed.order.total_amount = 303
    expect(await submitOrderIntent(changed, send)).toMatchObject({ kind: 'failure', code: 'client_intent_conflict' })
    expect(await restoreOrderIntent(changed)).toMatchObject({ code: 'client_intent_conflict' })
    expect(await restartOrderIntent(changed)).toMatchObject({ code: 'client_intent_conflict' })
    expect(send).toHaveBeenCalledTimes(1)
  })

  it.each(['order_pending', 'order_requires_review', 'idempotency_conflict'] as const)('сохраняет %s и запрещает повтор/новое намерение после reload', async code => {
    const send = vi.fn().mockResolvedValue({ kind: 'failure', status: code === 'order_requires_review' ? 503 : 409, code, reference: 91 })
    await submitOrderIntent(args(), send)
    expect(await restoreOrderIntent(args())).toMatchObject({ code, reference: 91 })
    expect(await restartOrderIntent(args())).toMatchObject({ code: 'client_intent_conflict' })
    await submitOrderIntent(args(), send)
    expect(send).toHaveBeenCalledTimes(1)
    expect(saved().data.phase).toBe('blocked')
  })

  it.each([['supplier_rejected', 502], ['price_changed', 409], ['product_unavailable', 409]] as const)('только явное новое намерение после %s меняет ключ', async (code, status) => {
    const send = vi.fn().mockResolvedValue({ kind: 'failure', status, code, reference: 91 })
    await submitOrderIntent(args(), send)
    const key = saved().data.key
    await submitOrderIntent(args(), send)
    expect(send).toHaveBeenCalledTimes(1)
    expect(await restartOrderIntent(args())).toBeNull()
    expect(saved().data).toMatchObject({ phase: 'ready' })
    expect(saved().data.key).not.toBe(key)
    await submitOrderIntent(args(), send)
    expect(send).toHaveBeenCalledTimes(2)
    expect(send.mock.calls[1][0]).not.toBe(key)
  })

  it('201 убирает активный ключ, receipt защищает старую вкладку, новый товарный выбор получает новый ключ', async () => {
    const send = vi.fn().mockResolvedValue(success)
    await submitOrderIntent(args(), send)
    const firstKey = send.mock.calls[0][0]
    expect(saved().data).not.toHaveProperty('key')
    expect(await restoreOrderIntent(args())).toEqual(success)
    expect(await submitOrderIntent(args(), send)).toEqual(success)
    expect(send).toHaveBeenCalledTimes(1)
    const next = { ...args(), cartSignature: 'synthetic-cart-line-v2' }
    expect(await restoreOrderIntent(next)).toBeNull()
    await submitOrderIntent(next, send)
    expect(send).toHaveBeenCalledTimes(2)
    expect(send.mock.calls[1][0]).not.toBe(firstKey)
  })

  it('история receipts защищает старую вкладку A после подтверждения другого заказа B', async () => {
    const first = args()
    const next = args()
    next.cartSignature = 'different-cart-line'
    next.order.order_items.tyres![0].id = 2
    const send = vi.fn().mockResolvedValueOnce(success).mockResolvedValueOnce({ kind: 'success', status: 201, order: 43 })
    await submitOrderIntent(first, send)
    await submitOrderIntent(next, send)
    expect(await restoreOrderIntent(first)).toEqual(success)
    expect(await submitOrderIntent(first, send)).toEqual(success)
    expect(send).toHaveBeenCalledTimes(2)
  })

  it('смена версии той же строки после неизвестного результата не превращается в новое намерение', async () => {
    const send = vi.fn().mockResolvedValue(network)
    await submitOrderIntent(args(), send)
    const changedVersion = { ...args(), cartSignature: 'reselected-same-product' }
    expect(await submitOrderIntent(changedVersion, send)).toMatchObject({ code: 'client_intent_conflict' })
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('намерение scoped клиенту и не смешивает результаты разных телефонов', async () => {
    const send = vi.fn().mockResolvedValue(network)
    await submitOrderIntent(args(), send)
    await submitOrderIntent({ ...args(), customer: '79990000002' }, send)
    expect(send.mock.calls[1][0]).not.toBe(send.mock.calls[0][0])
    expect(Object.keys(localStorage).filter(key => key.startsWith(CHECKOUT_STORAGE_PREFIX))).toHaveLength(2)
  })

  it('две вкладки не выполняют HTTP одновременно; завершение не превращает ожидавший клик в новый заказ', async () => {
    let resolve!: (value: OrderResult) => void
    const send = vi.fn().mockImplementation(() => new Promise(done => { resolve = done }))
    const first = submitOrderIntent(args(), send)
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1))
    expect(await submitOrderIntent(args(), send)).toMatchObject({ code: 'browser_busy' })
    resolve(success)
    await first
    expect(await submitOrderIntent(args(), send)).toEqual(success)
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('повреждённая запись не затирается новым ключом', async () => {
    const send = vi.fn().mockResolvedValue(network)
    await submitOrderIntent(args(), send)
    localStorage.setItem(saved().key, '{broken')
    expect(await submitOrderIntent(args(), send)).toMatchObject({ code: 'storage_unavailable' })
    expect(send).toHaveBeenCalledTimes(1)
  })

  it.each(['getItem', 'setItem'] as const)('ошибка storage.%s блокирует HTTP, не заменяется ключом в памяти', async method => {
    vi.spyOn(Storage.prototype, method).mockImplementation(() => { throw new Error('private-storage-data') })
    const send = vi.fn()
    expect(await submitOrderIntent(args(), send)).toEqual({ kind: 'failure', status: null, code: 'storage_unavailable' })
    expect(send).not.toHaveBeenCalled()
  })

  it('неуспешная проверка write-before-HTTP также блокирует отправку', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined)
    const send = vi.fn()
    expect(await submitOrderIntent(args(), send)).toMatchObject({ code: 'storage_unavailable' })
    expect(send).not.toHaveBeenCalled()
  })

  it('неподдерживаемый Web Locks не приводит к случайному новому ключу', async () => {
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined })
    const send = vi.fn()
    expect(await submitOrderIntent(args(), send)).toMatchObject({ code: 'storage_unavailable' })
    expect(send).not.toHaveBeenCalled()
  })

  it('сбой сохранения после HTTP сохраняет прежний маркер и выдаёт reference для сверки', async () => {
    const send = vi.fn().mockImplementation(async () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('private-storage-data') })
      return success
    })
    expect(await submitOrderIntent(args(), send)).toEqual({ kind: 'failure', status: null, code: 'storage_after_send', reference: 42 })
    expect(saved().data.phase).toBe('sending')
    expect(saved().data.key).toBeTruthy()
    expect(send).toHaveBeenCalledTimes(1)
  })
})
