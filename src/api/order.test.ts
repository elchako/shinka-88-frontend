import { afterEach, describe, expect, it, vi } from 'vitest'
import { orderApi } from './order'

const order = { total_amount: 202, order_items: { tyres: [{ id: 1, quantity: 2, price: 101 }] } }
afterEach(() => vi.restoreAllMocks())

describe('Типизированный результат оформления без реальной сети', () => {
  it('принимает только подтверждённый 201 и передаёт стабильный ключ заголовком', async () => {
    const post = vi.spyOn(orderApi.instance, 'post').mockResolvedValue({ status: 201, data: { order: 42 } })
    expect(await orderApi.createOrder(order, 'synthetic-token', 'synthetic-intent')).toEqual({ kind: 'success', status: 201, order: 42 })
    expect(post).toHaveBeenCalledWith('/order/', order, expect.objectContaining({ headers: expect.objectContaining({ 'Idempotency-Key': 'synthetic-intent' }) }))
  })

  it.each([200, 202, 400, 401, 403, 404, 409, 500, 502, 503])('не считает order в body успехом HTTP%s', async status => {
    vi.spyOn(orderApi.instance, 'post').mockResolvedValue({ status, data: { order: 42, message: 'private-untrusted-body' } })
    const result = await orderApi.createOrder(order, 'synthetic-token', 'synthetic-intent')
    expect(result.kind).toBe('failure')
    expect(result).not.toHaveProperty('order')
    expect(JSON.stringify(result)).not.toContain('private-untrusted-body')
  })

  it.each([null, {}, { order: true }, { order: -1 }, { order: 1.5 }, { order: '42' }, { order: 2 ** 53 }, { order: 42, error: 'order_requires_review' }])('не принимает повреждённое подтверждение 201 %j', async data => {
    vi.spyOn(orderApi.instance, 'post').mockResolvedValue({ status: 201, data })
    expect((await orderApi.createOrder(order, 'synthetic-token', 'key')).kind).toBe('failure')
  })

  it.each([[409, 'order_pending'], [503, 'order_requires_review'], [409, 'price_changed'], [409, 'product_unavailable'], [502, 'supplier_rejected']] as const)('сохраняет безопасный код/reference HTTP%s %s', async (status, error) => {
    vi.spyOn(orderApi.instance, 'post').mockResolvedValue({ status, data: { error, reference: 91, message: 'private-provider-text' } })
    expect(await orderApi.createOrder(order, 'synthetic-token', 'key')).toEqual({ kind: 'failure', status, code: error, reference: 91 })
  })

  it('не объявляет окончательный отказ при неправильной паре code/status', async () => {
    vi.spyOn(orderApi.instance, 'post').mockResolvedValue({ status: 503, data: { error: 'supplier_rejected', reference: 91 } })
    expect(await orderApi.createOrder(order, 'synthetic-token', 'key')).toEqual({ kind: 'failure', status: 503, code: 'unexpected_response' })
  })

  it('не сохраняет legacy id/type и не доверяет PII/исключению транспорта', async () => {
    const post = vi.spyOn(orderApi.instance, 'post').mockResolvedValueOnce({ status: 404, data: { id: 1, type: 'tyre', error: 'private-data' } }).mockRejectedValueOnce(new Error('private-token-and-url'))
    expect(await orderApi.createOrder(order, 'synthetic-token', 'key')).toEqual({ kind: 'failure', status: 404, code: 'unexpected_response' })
    expect(await orderApi.createOrder(order, 'synthetic-token', 'key')).toEqual({ kind: 'failure', status: null, code: 'network_error' })
    expect(post).toHaveBeenCalledTimes(2)
  })
})
