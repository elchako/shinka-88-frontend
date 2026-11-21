import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { URLs } from './config'
import type { orderType } from '../types/cart'

const errorStatuses = {
  invalid_order: 400, invalid_idempotency_key: 400, customer_not_verified: 403,
  product_unavailable: 409, price_changed: 409, amount_limit: 409, mixed_warehouses: 409,
  idempotency_conflict: 409, order_pending: 409, supplier_rejected: 502,
  orders_unavailable: 503, order_requires_review: 503,
} as const

export type OrderErrorCode = keyof typeof errorStatuses | 'authentication_required' | 'network_error'
  | 'unexpected_response' | 'storage_unavailable' | 'storage_after_send' | 'browser_busy'
  | 'client_intent_conflict' | 'cart_changed' | 'cart_contains_confirmed' | 'cart_storage_conflict'
export type OrderSuccess = { kind: 'success', status: 201, order: number }
export type OrderFailure = { kind: 'failure', status: number | null, code: OrderErrorCode, reference?: number }
export type OrderResult = OrderSuccess | OrderFailure

const positiveId = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value > 0

export const parseOrderResponse = (status: number, data: unknown): OrderResult => {
  const body = data && typeof data === 'object' && !Array.isArray(data) ? data as Record<string, unknown> : {}
  if (status === 201 && positiveId(body.order) && !('error' in body)) return { kind: 'success', status: 201, order: body.order }
  const code = body.error
  // Не доверять произвольному message, legacy id/type и противоречивому order.
  if (typeof code === 'string' && Object.hasOwn(errorStatuses, code) && !('order' in body)
      && errorStatuses[code as keyof typeof errorStatuses] === status) {
    return { kind: 'failure', status, code: code as keyof typeof errorStatuses,
      ...(positiveId(body.reference) ? { reference: body.reference } : {}) }
  }
  if (status === 401 && !('order' in body)) return { kind: 'failure', status, code: 'authentication_required' }
  return { kind: 'failure', status, code: 'unexpected_response' }
}

class OrderAPI {
  instance: AxiosInstance

  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL })
  }

  async createOrder(order: orderType, token: string, idempotencyKey: string): Promise<OrderResult> {
    try {
      const response = await this.instance.post<unknown>(URLs.order, order, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`, 'Idempotency-Key': idempotencyKey },
        validateStatus: () => true,
      })
      return parseOrderResponse(response.status, response.data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) return parseOrderResponse(error.response.status, error.response.data)
      // Текст исключения может содержать token/URL/контактные данные.
      return { kind: 'failure', status: null, code: 'network_error' }
    }
  }
}

export const orderApi = new OrderAPI(URLs.base)
