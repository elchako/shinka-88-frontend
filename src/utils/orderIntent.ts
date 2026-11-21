import { URLs } from '../api/config'
import { parseOrderResponse, type OrderFailure, type OrderResult } from '../api/order'
import type { orderType } from '../types/cart'

export const CHECKOUT_STORAGE_PREFIX = 'checkoutIntent:v1:'
export const CHECKOUT_RECEIPT_PREFIX = 'checkoutReceipt:v1:'
export type ConfirmedCartLine = { category: 'tyres' | 'disks', id: number, quantity: number, price: number, token?: string }
type Phase = 'ready' | 'sending' | 'retry' | 'blocked' | 'rejected' | 'cart' | 'success'
type Intent = { version: 1, fingerprint: string, cartSignature: string, phase: Phase, key?: string, result?: OrderResult }
export type IntentContext = { customer: string, order: orderType, cartSignature: string }
const failure = (code: OrderFailure['code'], reference?: number): OrderFailure => ({ kind: 'failure', status: null, code,
  ...(reference ? { reference } : {}) })
const hex = /^[a-f0-9]{64}$/
const phases: Phase[] = ['ready', 'sending', 'retry', 'blocked', 'rejected', 'cart', 'success']

// Только публичные товарные поля, не телефон, имя или token.
export const canonicalOrder = (order: orderType): string => JSON.stringify([
  order.total_amount,
  ...(['tyres', 'disks'] as const).map(category => [category,
    [...(order.order_items[category] || [])].sort((a, b) => a.id - b.id).map(line => [line.id, line.quantity, line.price])]),
])

const digest = async (value: string): Promise<string> => Array.from(
  new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))),
).map(byte => byte.toString(16).padStart(2, '0')).join('')

const context = async (args: IntentContext) => {
  const customer = args.customer.replace(/^\+/, '')
  if (!/^[1-9][0-9]{6,14}$/.test(customer) || typeof navigator === 'undefined'
      || !navigator.locks?.request || !globalThis.crypto?.subtle || !crypto.randomUUID) throw new Error('persistence_unavailable')
  const [scope, fingerprint] = await Promise.all([digest(`${URLs.base}\0${customer}`), digest(canonicalOrder(args.order))])
  return { storageKey: CHECKOUT_STORAGE_PREFIX + scope, lockName: CHECKOUT_STORAGE_PREFIX + scope, fingerprint }
}

const read = (key: string): Intent | null => {
  const raw = localStorage.getItem(key)
  if (raw === null) return null
  const value = JSON.parse(raw) as Intent
  if (!value || value.version !== 1 || !hex.test(value.fingerprint) || typeof value.cartSignature !== 'string'
      || !phases.includes(value.phase) || (value.phase !== 'success' && (typeof value.key !== 'string' || !/^[A-Za-z0-9_.:-]{1,128}$/.test(value.key)))) {
    throw new Error('invalid_persisted_intent')
  }
  if (value.phase === 'ready' || value.phase === 'sending') {
    if (value.result !== undefined) throw new Error('invalid_persisted_result')
  } else {
    const result = value.result
    if (!result || (result.kind !== 'success' && result.kind !== 'failure')) throw new Error('invalid_persisted_result')
    const checked = result.kind === 'success'
      ? parseOrderResponse(result.status, { order: result.order })
      : result.code === 'network_error' && result.status === null ? failure('network_error')
        : parseOrderResponse(result.status ?? 0, { error: result.code, reference: result.reference })
    if (JSON.stringify(checked) !== JSON.stringify(result) || (value.phase === 'success') !== (result.kind === 'success')
        || phaseFor(result) !== value.phase) throw new Error('invalid_persisted_result')
  }
  return value
}

const write = (key: string, intent: Intent): void => {
  const raw = JSON.stringify(intent)
  localStorage.setItem(key, raw)
  if (localStorage.getItem(key) !== raw) throw new Error('persistence_not_confirmed')
}

export const orderRecovery = (result: OrderFailure): 'retry' | 'auth' | 'contact' | 'cart' | 'new' => {
  switch (result.code) {
    case 'network_error': case 'orders_unavailable': return 'retry'
    case 'authentication_required': case 'customer_not_verified': return 'auth'
    case 'invalid_order': case 'invalid_idempotency_key': case 'price_changed': case 'product_unavailable':
    case 'amount_limit': case 'cart_changed': case 'mixed_warehouses': return 'cart'
    case 'supplier_rejected': return 'new'
    default: return 'contact'
  }
}

const phaseFor = (result: OrderResult): Phase => {
  if (result.kind === 'success') return 'success'
  switch (orderRecovery(result)) {
    case 'auth': case 'retry': return 'retry'
    case 'cart': return 'cart'
    case 'new': return 'rejected'
    default: return 'blocked'
  }
}

const existingResult = (intent: Intent, fingerprint: string, cartSignature: string): OrderResult | null => {
  if (intent.phase === 'success') {
    // Receipt без активного ключа защищает старую вкладку; новая строка корзины
    // имеет другой cartSignature даже при том же товарном payload.
    if (intent.fingerprint === fingerprint && intent.cartSignature === cartSignature) return intent.result!
    // Устаревшая вкладка могла сохранить ранее отправленную строку рядом с
    // новыми товарами. Не превращать её в новый заказ с повтором той строки.
    try {
      const previous: unknown[] = JSON.parse(intent.cartSignature)
      const current: unknown[] = JSON.parse(cartSignature)
      if (Array.isArray(previous) && Array.isArray(current) && current.some(line =>
        previous.some(confirmed => JSON.stringify(line) === JSON.stringify(confirmed)))) {
        return failure('cart_contains_confirmed', intent.result?.kind === 'success' ? intent.result.order : undefined)
      }
    } catch { /* Старый opaque signature сравнивается только целиком. */ }
    return null
  }
  if (intent.phase === 'blocked' || intent.phase === 'rejected' || intent.phase === 'cart') return intent.result!
  if (intent.phase !== 'ready' && (intent.fingerprint !== fingerprint || intent.cartSignature !== cartSignature)) return failure('client_intent_conflict',
    intent.result?.kind === 'failure' ? intent.result.reference : undefined)
  return null
}

const receiptPrefix = (storageKey: string) => CHECKOUT_RECEIPT_PREFIX + storageKey.slice(CHECKOUT_STORAGE_PREFIX.length) + ':'
const storageKeys = () => Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index)).filter((key): key is string => key !== null)

const archiveSuccess = (storageKey: string, intent: Intent) => {
  if (intent.phase === 'success' && intent.result?.kind === 'success') {
    write(receiptPrefix(storageKey) + intent.result.order, intent)
  }
}

const receiptResult = (storageKey: string, fingerprint: string, signature: string): OrderResult | null => {
  let conflict: OrderResult | null = null
  for (const key of storageKeys().filter(key => key.startsWith(receiptPrefix(storageKey)))) {
    const receipt = read(key)
    if (!receipt || receipt.phase !== 'success') throw new Error('invalid_receipt')
    const result = existingResult(receipt, fingerprint, signature)
    if (result?.kind === 'success') return result
    conflict ||= result
  }
  return conflict
}

// Не изменяем общую cartData при подтверждении: localStorage не поддерживает CAS.
// Каждая версия подтверждённой строки скрывается по отдельному receipt при чтении.
export const confirmedCartLines = (): ConfirmedCartLine[] => {
  const lines: ConfirmedCartLine[] = []
  for (const key of storageKeys().filter(key => key.startsWith(CHECKOUT_RECEIPT_PREFIX) || key.startsWith(CHECKOUT_STORAGE_PREFIX))) {
    try {
      const receipt = read(key)
      if (receipt?.phase !== 'success') continue
      const rows: unknown = JSON.parse(receipt.cartSignature)
      if (!Array.isArray(rows)) continue
      for (const row of rows) {
        if (row && typeof row === 'object' && (row.category === 'tyres' || row.category === 'disks')
            && Number.isSafeInteger(row.id) && row.id > 0 && Number.isSafeInteger(row.quantity) && row.quantity > 0
            && typeof row.price === 'number' && Number.isFinite(row.price)
            && (row.token === undefined || typeof row.token === 'string')) lines.push(row as ConfirmedCartLine)
      }
    } catch { /* Повреждённый receipt не является основанием удалять строки корзины. Отправка проверяет его отдельно. */ }
  }
  return lines
}

export const restoreOrderIntent = async (args: IntentContext): Promise<OrderResult | null> => {
  try {
    const ctx = await context(args)
    const confirmed = receiptResult(ctx.storageKey, ctx.fingerprint, args.cartSignature)
    if (confirmed) return confirmed
    const intent = read(ctx.storageKey)
    if (!intent) return null
    const result = existingResult(intent, ctx.fingerprint, args.cartSignature)
    if (result) return result
    if (intent.phase === 'success' || intent.phase === 'ready') return null
    // Свежий вход не меняет ключ, но прежний 401 не требует бесконечного нового SMS.
    if (intent.result?.kind === 'failure' && orderRecovery(intent.result) === 'auth') return null
    return await navigator.locks.request(ctx.lockName, { ifAvailable: true }, lock =>
      lock ? intent.result ?? failure('network_error') : failure('browser_busy'))
  } catch {
    return failure('storage_unavailable')
  }
}

export const submitOrderIntent = async (args: IntentContext, send: (key: string) => Promise<OrderResult>): Promise<OrderResult> => {
  try {
    const ctx = await context(args)
    return await navigator.locks.request(ctx.lockName, { ifAvailable: true }, async lock => {
      if (!lock) return failure('browser_busy')
      const confirmed = receiptResult(ctx.storageKey, ctx.fingerprint, args.cartSignature)
      if (confirmed) return confirmed
      const previous = read(ctx.storageKey)
      if (previous) {
        const result = existingResult(previous, ctx.fingerprint, args.cartSignature)
        if (result) return result
        archiveSuccess(ctx.storageKey, previous)
      }
      const key = previous && previous.phase !== 'success' && previous.fingerprint === ctx.fingerprint
        ? previous.key! : crypto.randomUUID()
      const intent: Intent = { version: 1, phase: 'sending', key, fingerprint: ctx.fingerprint, cartSignature: args.cartSignature }
      // Обязательный проверенный write ДО любого HTTP. Временный ключ в памяти
      // не является fallback: после reload он мог бы создать второй заказ.
      write(ctx.storageKey, intent)
      let result: OrderResult
      try { result = await send(key) } catch { result = failure('network_error') }
      const complete: Intent = { ...intent, phase: phaseFor(result), result }
      if (result.kind === 'success') delete complete.key
      try {
        archiveSuccess(ctx.storageKey, complete)
        write(ctx.storageKey, complete)
      } catch { return failure('storage_after_send', result.kind === 'success' ? result.order : result.reference) }
      return result
    })
  } catch {
    return failure('storage_unavailable')
  }
}

export const restartOrderIntent = async (args: IntentContext): Promise<OrderFailure | null> => {
  try {
    const ctx = await context(args)
    return await navigator.locks.request(ctx.lockName, { ifAvailable: true }, lock => {
      if (!lock) return failure('browser_busy')
      const previous = read(ctx.storageKey)
      // Только явное новое намерение после доказанного отказа/валидации.
      if (!previous || !['rejected', 'cart'].includes(previous.phase)) return failure('client_intent_conflict')
      write(ctx.storageKey, { version: 1, phase: 'ready', key: crypto.randomUUID(),
        fingerprint: ctx.fingerprint, cartSignature: args.cartSignature })
      return null
    })
  } catch {
    return failure('storage_unavailable')
  }
}
