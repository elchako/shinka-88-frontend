import { createSelector, type PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../createAppSlice'
import type { commonArrDataType, IinitialState, orderType } from '../../types/cart'
import type { resultsTyresType } from '../../types/tires'
import type { resultsDisksType } from '../../types/disks'
import { orderApi, type OrderFailure, type OrderSuccess } from '../../api/order'
import { canonicalOrder, confirmedCartLines, orderRecovery, restartOrderIntent, restoreOrderIntent, submitOrderIntent, type IntentContext } from '../../utils/orderIntent'

type Category = 'tyres' | 'disks'
type SubmittedLine = { category: Category, id: number, quantity: number, price: number, token?: string }
type OrderArgs = { order: orderType, token: string, customer: string }
type CartState = IinitialState & {
  orderIssue: OrderFailure | null
  orderCartChanged: boolean
  checkoutCustomer: string
  activeOrderRequest: string | null
  submittedLines: SubmittedLine[]
  orderHydrating: boolean
  hydrationRequest: string | null
  lastSavedCart: string | null
}
type CartProducts = Pick<IinitialState, 'tyres' | 'disks'>
type CheckoutStore = { cart: CartState }

const initialState: CartState = {
  priceAmount: 0, queueCounter: 0, selectAll: true, tyres: [], disks: [], creatingOrder: false, orderNumber: 0,
  orderIssue: null, orderCartChanged: false, checkoutCustomer: '', activeOrderRequest: null, submittedLines: [],
  orderHydrating: false, hydrationRequest: null, lastSavedCart: null,
}

const sortAllProducts = (state: CartProducts): commonArrDataType => [...state.tyres, ...state.disks].sort((a, b) => a.queue - b.queue)

// Сумма и состав запроса строятся из одних и тех же выбранных позиций.
export const buildOrderPayload = (state: CartProducts): orderType => {
  const tyres = state.tyres.filter(item => !item.canceled)
  const disks = state.disks.filter(item => !item.canceled)
  const order_items: orderType['order_items'] = {}
  const toOrderItem = (item: commonArrDataType[number]) => ({ id: item.id, quantity: item.amount, price: item.price_sale })
  if (tyres.length) order_items.tyres = tyres.map(toOrderItem)
  if (disks.length) order_items.disks = disks.map(toOrderItem)
  return { total_amount: [...tyres, ...disks].reduce((sum, item) => sum + item.price_sale * item.amount, 0), order_items }
}

const selectedSnapshot = (state: CartProducts): SubmittedLine[] => (['tyres', 'disks'] as const).flatMap(category =>
  state[category].filter(item => !item.canceled).map(item => ({ category, id: item.id, quantity: item.amount, price: item.price_sale, token: item.cartLineToken })),
)
export const cartSignature = (state: CartProducts): string => JSON.stringify(selectedSnapshot(state).sort((a, b) => a.category.localeCompare(b.category) || a.id - b.id))

// Это идентификатор версии строки, НЕ секрет/ключ заказа. Корзина работает и
// без WebCrypto; строгие требования к сохранению проверяются до HTTP отдельно.
let lineVersion = 0
const newLineToken = () => globalThis.crypto?.randomUUID?.() ?? `line-${Date.now()}-${++lineVersion}`
const refreshCart = (state: CartState) => {
  const products = sortAllProducts(state)
  state.priceAmount = buildOrderPayload(state).total_amount
  state.selectAll = products.every(item => !item.canceled)
  state.queueCounter = products.length
  products.forEach((item, index) => { item.queue = index })
}
const persistCart = (state: CartState) => {
  try {
    // Не сохранять token/customer scope, pending и прочее временное состояние.
    const raw = JSON.stringify({ tyres: state.tyres, disks: state.disks })
    localStorage.setItem('cartData', raw)
    if (localStorage.getItem('cartData') === raw) state.lastSavedCart = raw
  } catch { /* Корзина остаётся в Redux; отправка имеет отдельный fail-closed gate. */ }
}
const removeStoredCart = (state: CartState) => {
  try { localStorage.removeItem('cartData'); if (localStorage.getItem('cartData') === null) state.lastSavedCart = null }
  catch { /* Корзина остаётся в Redux. */ }
}
const boundedAmount = (amount: number, balance: number) => Math.min(balance, Math.max(1, Math.floor(Number.isFinite(amount) ? amount : 1)))

const visibleStoredCart = (data: CartProducts): CartProducts => {
  const confirmed = confirmedCartLines()
  const prepare = (category: Category, item: commonArrDataType[number]) => ({ ...item,
    cartLineToken: item.cartLineToken || `legacy:${category}:${item.id}:${item.amount}:${item.price_sale}`,
  })
  const keep = (category: Category, item: commonArrDataType[number]) => item.canceled || !confirmed.some(line =>
    line.category === category && line.id === item.id && line.quantity === item.amount
      && line.price === item.price_sale && line.token === item.cartLineToken,
  )
  return {
    tyres: data.tyres.map(item => prepare('tyres', item) as typeof item).filter(item => keep('tyres', item)),
    disks: data.disks.map(item => prepare('disks', item) as typeof item).filter(item => keep('disks', item)),
  }
}

const clearConfirmed = (state: CartState, lines: SubmittedLine[]) => {
  let preserveStorage = false
  try {
    const latest = localStorage.getItem('cartData')
    if (latest !== state.lastSavedCart) {
      const current = JSON.stringify({ tyres: state.tyres, disks: state.disks })
      if (current === state.lastSavedCart) {
        // Другая вкладка изменила корзину. Сначала берём её свежий снимок,
        // затем удаляем только строки с исходными подтверждёнными версиями.
        const parsed = latest === null ? { tyres: [], disks: [] } : JSON.parse(latest)
        if (!Array.isArray(parsed.tyres) || !Array.isArray(parsed.disks)) throw new Error('invalid_cart')
        const visible = visibleStoredCart(parsed)
        state.tyres = visible.tyres
        state.disks = visible.disks
      } else preserveStorage = true // Одновременно есть несохранённые локальные изменения.
    }
  } catch { preserveStorage = true }
  const keep = (category: Category, item: commonArrDataType[number]) => !lines.some(line =>
    line.category === category && line.id === item.id && line.quantity === item.amount && line.price === item.price_sale
      && line.token === item.cartLineToken && !item.canceled,
  )
  state.tyres = state.tyres.filter(item => keep('tyres', item))
  state.disks = state.disks.filter(item => keep('disks', item))
  refreshCart(state)
  state.orderCartChanged = Boolean(state.tyres.length || state.disks.length)
  if (preserveStorage) {
    state.orderCartChanged = true
    state.orderIssue = { kind: 'failure', status: null, code: 'cart_storage_conflict', reference: state.orderNumber }
  }
  // Не записывать и не удалять общий cartData на основании устаревающего read:
  // другая вкладка может сохранить новую строку в любой момент. Receipts уже
  // зафиксированы до fulfilled и скроют только подтверждённые версии при чтении.
  state.lastSavedCart = JSON.stringify({ tyres: state.tyres, disks: state.disks })
}
const canSend = (state: CartState) => !state.creatingOrder && !state.orderHydrating
  && (!state.orderIssue || ['retry', 'auth'].includes(orderRecovery(state.orderIssue)))

export const cartSlice = createAppSlice({
  name: 'cart',
  initialState,
  reducers: create => ({
    addTyresToCart: create.reducer((state, action: PayloadAction<resultsTyresType>) => {
      if (action.payload.balance < 1) return
      const amount = boundedAmount(action.payload.amount, action.payload.balance)
      const existing = state.tyres.find(item => item.id === action.payload.id)
      if (existing) Object.assign(existing, action.payload, { amount, canceled: false, cartLineToken: newLineToken() })
      else state.tyres.push({ ...action.payload, amount, canceled: false, queue: state.queueCounter, cartLineToken: newLineToken() })
      refreshCart(state)
      persistCart(state)
    }),
    addDisksToCart: create.reducer((state, action: PayloadAction<resultsDisksType>) => {
      if (action.payload.balance < 1) return
      const amount = boundedAmount(action.payload.amount, action.payload.balance)
      const existing = state.disks.find(item => item.id === action.payload.id)
      if (existing) Object.assign(existing, action.payload, { amount, canceled: false, cartLineToken: newLineToken() })
      else state.disks.push({ ...action.payload, amount, canceled: false, queue: state.queueCounter, cartLineToken: newLineToken() })
      refreshCart(state)
      persistCart(state)
    }),
    selectAllHandler: create.reducer(state => {
      const canceled = state.selectAll
      ;[...state.tyres, ...state.disks].forEach(item => {
        if (item.canceled !== canceled) item.cartLineToken = newLineToken()
        item.canceled = canceled
      })
      refreshCart(state)
      persistCart(state)
    }),
    selectProductHandler: create.reducer((state, action: PayloadAction<{ productType: string, id: number }>) => {
      const products = action.payload.productType === 'Шины' ? state.tyres : action.payload.productType === 'Диски' ? state.disks : []
      const product = products.find(item => item.id === action.payload.id)
      if (!product) return
      product.canceled = !product.canceled
      product.cartLineToken = newLineToken()
      refreshCart(state)
      persistCart(state)
    }),
    resetCart: create.reducer(state => {
      state.tyres = []
      state.disks = []
      refreshCart(state)
      removeStoredCart(state)
      // Очистка корзины НЕ снимает блокировку неизвестного результата заказа.
    }),
    delOneTypeProduct: create.reducer((state, action: PayloadAction<{ productType: string, id: number }>) => {
      if (action.payload.productType === 'Шины') state.tyres = state.tyres.filter(item => item.id !== action.payload.id)
      if (action.payload.productType === 'Диски') state.disks = state.disks.filter(item => item.id !== action.payload.id)
      refreshCart(state)
      persistCart(state)
    }),
    changeAmount: create.reducer((state, action: PayloadAction<{ type: string, id: number, isPlus: boolean }>) => {
      const products = action.payload.type === 'Шины' ? state.tyres : action.payload.type === 'Диски' ? state.disks : []
      const product = products.find(item => item.id === action.payload.id)
      if (!product) return
      const amount = boundedAmount(product.amount + (action.payload.isPlus ? 1 : -1), product.balance)
      if (amount !== product.amount) product.cartLineToken = newLineToken()
      product.amount = amount
      refreshCart(state)
      persistCart(state)
    }),
    pullLocalStorageData: create.reducer(state => {
      try {
        const saved = localStorage.getItem('cartData')
        if (!saved) return
        const data = JSON.parse(saved)
        if (!Array.isArray(data.tyres) || !Array.isArray(data.disks)) return
        if (![...data.tyres, ...data.disks].every(item => item && typeof item === 'object')) return
        const visible = visibleStoredCart(data)
        state.tyres = visible.tyres
        state.disks = visible.disks
        refreshCart(state)
        state.lastSavedCart = JSON.stringify({ tyres: state.tyres, disks: state.disks })
      } catch { /* Повреждённое/недоступное хранилище не мешает открыть магазин. */ }
    }),
    setCheckoutCustomer: create.reducer((state, action: PayloadAction<string>) => {
      if (state.checkoutCustomer === action.payload) return
      state.checkoutCustomer = action.payload
      state.orderIssue = null
      state.orderNumber = 0
      state.hydrationRequest = null
      state.orderHydrating = false
    }),
    orderIsCreating: create.reducer(state => {
      if (state.creatingOrder) return
      state.orderNumber = 0
      state.orderCartChanged = false
    }),
    createOrder: create.asyncThunk<OrderSuccess, OrderArgs, { rejectValue: OrderFailure }>(
      async (args, api): Promise<OrderSuccess> => {
        const state = (api.getState() as CheckoutStore).cart
        if (canonicalOrder(args.order) !== canonicalOrder(buildOrderPayload(state))) {
          throw api.rejectWithValue({ kind: 'failure', status: null, code: 'cart_changed' })
        }
        const result = await submitOrderIntent({ customer: args.customer, order: args.order, cartSignature: cartSignature(state) },
          key => orderApi.createOrder(args.order, args.token, key))
        if (result.kind === 'failure') throw api.rejectWithValue(result)
        return result
      },
      {
        options: { condition: (_, api) => canSend((api.getState() as CheckoutStore).cart) },
        pending: (state, action) => {
          state.creatingOrder = true
          state.activeOrderRequest = action.meta.requestId
          state.checkoutCustomer = action.meta.arg.customer
          state.orderNumber = 0
          state.orderIssue = null
          state.submittedLines = selectedSnapshot(state)
          state.hydrationRequest = null
        },
        fulfilled: (state, action) => {
          if (state.activeOrderRequest !== action.meta.requestId) return
          state.creatingOrder = false
          state.activeOrderRequest = null
          if (state.checkoutCustomer !== action.meta.arg.customer) return
          state.orderNumber = action.payload.order
          clearConfirmed(state, state.submittedLines)
          state.submittedLines = []
        },
        rejected: (state, action) => {
          if (state.activeOrderRequest !== action.meta.requestId) return
          state.creatingOrder = false
          state.activeOrderRequest = null
          if (state.checkoutCustomer !== action.meta.arg.customer) return
          state.orderIssue = action.payload ?? { kind: 'failure', status: null, code: 'unexpected_response' }
          state.submittedLines = []
        },
      },
    ),
    hydrateOrderIntent: create.asyncThunk(
      async (args: IntentContext) => restoreOrderIntent(args),
      {
        options: { condition: (_, api) => !(api.getState() as CheckoutStore).cart.creatingOrder },
        pending: (state, action) => { state.orderHydrating = true; state.hydrationRequest = action.meta.requestId },
        fulfilled: (state, action) => {
          if (state.hydrationRequest !== action.meta.requestId || state.checkoutCustomer !== action.meta.arg.customer) return
          state.orderHydrating = false
          if (cartSignature(state) !== action.meta.arg.cartSignature) return
          if (action.payload?.kind === 'success') {
            state.orderNumber = action.payload.order
            state.orderIssue = null
            clearConfirmed(state, selectedSnapshot(state))
          } else state.orderIssue = action.payload
        },
        rejected: (state, action) => {
          if (state.hydrationRequest !== action.meta.requestId) return
          state.orderHydrating = false
          state.orderIssue = { kind: 'failure', status: null, code: 'storage_unavailable' }
        },
      },
    ),
    startNewOrderIntent: create.asyncThunk(
      async (args: IntentContext) => restartOrderIntent(args),
      {
        options: { condition: (_, api) => {
          const state = (api.getState() as CheckoutStore).cart
          return !state.creatingOrder && !state.orderHydrating && Boolean(state.orderIssue && ['cart', 'new'].includes(orderRecovery(state.orderIssue)))
        } },
        pending: (state, action) => { state.orderHydrating = true; state.hydrationRequest = action.meta.requestId },
        fulfilled: (state, action) => {
          if (state.hydrationRequest !== action.meta.requestId || state.checkoutCustomer !== action.meta.arg.customer) return
          state.orderHydrating = false
          state.orderIssue = action.payload
        },
        rejected: (state, action) => {
          if (state.hydrationRequest !== action.meta.requestId) return
          state.orderHydrating = false
          state.orderIssue = { kind: 'failure', status: null, code: 'storage_unavailable' }
        },
      },
    ),
  }),
  selectors: {
    priceAmountSelector: state => state.priceAmount,
    tyresDataSelector: state => state.tyres,
    disksDataSelector: state => state.disks,
    selectAllSelector: state => state.selectAll,
    creatingOrderSelector: state => state.creatingOrder,
    orderNumberSelector: state => state.orderNumber,
    orderIssueSelector: state => state.orderIssue,
    orderHydratingSelector: state => state.orderHydrating,
    orderCartChangedSelector: state => state.orderCartChanged,
    selectedProductsSelector: createSelector([(state: CartState) => state.tyres, (state: CartState) => state.disks],
      (tyres, disks) => sortAllProducts({ tyres, disks }).filter(item => !item.canceled)),
    orderPayloadSelector: createSelector([(state: CartState) => state.tyres, (state: CartState) => state.disks],
      (tyres, disks) => buildOrderPayload({ tyres, disks })),
    cartSignatureSelector: createSelector([(state: CartState) => state.tyres, (state: CartState) => state.disks],
      (tyres, disks) => cartSignature({ tyres, disks })),
  },
})

export const { addTyresToCart, addDisksToCart, selectAllHandler, selectProductHandler, resetCart, delOneTypeProduct,
  changeAmount, pullLocalStorageData, orderIsCreating, createOrder, setCheckoutCustomer, hydrateOrderIntent, startNewOrderIntent } = cartSlice.actions
export const { priceAmountSelector, tyresDataSelector, disksDataSelector, selectAllSelector, creatingOrderSelector,
  orderNumberSelector, orderIssueSelector, orderHydratingSelector, orderCartChangedSelector, selectedProductsSelector,
  orderPayloadSelector, cartSignatureSelector } = cartSlice.selectors
