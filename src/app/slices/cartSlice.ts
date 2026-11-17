import { createSelector, type PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../createAppSlice'
import type { commonArrDataType, IinitialState, orderType } from '../../types/cart'
import type { resultsTyresType } from '../../types/tires'
import type { resultsDisksType } from '../../types/disks'
import { orderApi } from '../../api/order'

type CartState = IinitialState & { orderError: string }
type CartProducts = Pick<IinitialState, 'tyres' | 'disks'>

const initialState: CartState = {
  priceAmount: 0,
  queueCounter: 0,
  selectAll: true,
  tyres: [],
  disks: [],
  creatingOrder: false,
  orderNumber: 0,
  orderError: '',
}

const sortAllProducts = (state: CartProducts): commonArrDataType =>
  [...state.tyres, ...state.disks].sort((a, b) => a.queue - b.queue)

// Сумма и состав запроса всегда строятся из одних и тех же выбранных позиций.
export const buildOrderPayload = (state: CartProducts): orderType => {
  const tyres = state.tyres.filter(item => !item.canceled)
  const disks = state.disks.filter(item => !item.canceled)
  const order_items: orderType['order_items'] = {}
  const toOrderItem = (item: commonArrDataType[number]) => ({
    id: item.id,
    quantity: item.amount,
    price: item.price_sale,
  })
  if (tyres.length) order_items.tyres = tyres.map(toOrderItem)
  if (disks.length) order_items.disks = disks.map(toOrderItem)
  return {
    total_amount: [...tyres, ...disks].reduce((sum, item) => sum + item.price_sale * item.amount, 0),
    order_items,
  }
}

const refreshCart = (state: CartState) => {
  const products = sortAllProducts(state)
  state.priceAmount = buildOrderPayload(state).total_amount
  state.selectAll = products.every(item => !item.canceled)
  state.queueCounter = products.length
  products.forEach((item, index) => { item.queue = index })
}

const persistCart = (state: CartState) => {
  // Недоступное хранилище не должно блокировать работу корзины в текущем окне.
  try {
    localStorage.setItem('cartData', JSON.stringify(state))
  } catch { /* Корзина остаётся в Redux. */ }
}

const removeStoredCart = () => {
  try {
    localStorage.removeItem('cartData')
  } catch { /* Корзина остаётся в Redux. */ }
}

const boundedAmount = (amount: number, balance: number) =>
  Math.min(balance, Math.max(1, Math.floor(Number.isFinite(amount) ? amount : 1)))

export const cartSlice = createAppSlice({
  name: 'cart',
  initialState,
  reducers: create => ({
    addTyresToCart: create.reducer((state, action: PayloadAction<resultsTyresType>) => {
      if (action.payload.balance < 1) return
      const amount = boundedAmount(action.payload.amount, action.payload.balance)
      const existing = state.tyres.find(item => item.id === action.payload.id)
      if (existing) {
        existing.amount = boundedAmount(amount, existing.balance)
        existing.canceled = false
      } else {
        state.tyres.push({ ...action.payload, amount, canceled: false, queue: state.queueCounter })
      }
      refreshCart(state)
      persistCart(state)
    }),
    addDisksToCart: create.reducer((state, action: PayloadAction<resultsDisksType>) => {
      if (action.payload.balance < 1) return
      const amount = boundedAmount(action.payload.amount, action.payload.balance)
      const existing = state.disks.find(item => item.id === action.payload.id)
      if (existing) {
        existing.amount = boundedAmount(amount, existing.balance)
        existing.canceled = false
      } else {
        state.disks.push({ ...action.payload, amount, canceled: false, queue: state.queueCounter })
      }
      refreshCart(state)
      persistCart(state)
    }),
    selectAllHandler: create.reducer(state => {
      const canceled = state.selectAll
      ;[...state.tyres, ...state.disks].forEach(item => { item.canceled = canceled })
      refreshCart(state)
      persistCart(state)
    }),
    selectProductHandler: create.reducer((state, action: PayloadAction<{ productType: string, id: number }>) => {
      const products = action.payload.productType === 'Шины' ? state.tyres
        : action.payload.productType === 'Диски' ? state.disks : []
      const product = products.find(item => item.id === action.payload.id)
      if (!product) return
      product.canceled = !product.canceled
      refreshCart(state)
      persistCart(state)
    }),
    resetCart: create.reducer(state => {
      state.tyres = []
      state.disks = []
      refreshCart(state)
      state.orderError = ''
      removeStoredCart()
    }),
    delOneTypeProduct: create.reducer((state, action: PayloadAction<{ productType: string, id: number }>) => {
      if (action.payload.productType === 'Шины') state.tyres = state.tyres.filter(item => item.id !== action.payload.id)
      if (action.payload.productType === 'Диски') state.disks = state.disks.filter(item => item.id !== action.payload.id)
      refreshCart(state)
      persistCart(state)
    }),
    changeAmount: create.reducer((state, action: PayloadAction<{ type: string, id: number, isPlus: boolean }>) => {
      const products = action.payload.type === 'Шины' ? state.tyres
        : action.payload.type === 'Диски' ? state.disks : []
      const product = products.find(item => item.id === action.payload.id)
      if (!product || product.balance < 1) return
      product.amount = boundedAmount(product.amount + (action.payload.isPlus ? 1 : -1), product.balance)
      refreshCart(state)
      persistCart(state)
    }),
    pullLocalStorageData: create.reducer(state => {
      try {
        const saved = localStorage.getItem('cartData')
        if (!saved) return
        const data = JSON.parse(saved)
        if (!Array.isArray(data.tyres) || !Array.isArray(data.disks)) return
        state.tyres = data.tyres
        state.disks = data.disks
        refreshCart(state)
      } catch { /* Повреждённое хранилище не мешает открыть магазин. */ }
    }),
    // Закрытие результата заказа, без переключения состояния pending.
    orderIsCreating: create.reducer(state => {
      state.creatingOrder = false
      state.orderNumber = 0
      state.orderError = ''
    }),
    createOrder: create.asyncThunk(
      async (args: { order: orderType, token: string }) => {
        const response = await orderApi.createOrder(args.order, args.token)
        if (response?.order) return response.order as number
        if (response?.id && response?.type) throw new Error(`${response.id}:${response.type}`)
        throw new Error('order_error')
      },
      {
        pending: state => {
          state.creatingOrder = true
          state.orderNumber = 0
          state.orderError = ''
        },
        fulfilled: (state, action: PayloadAction<number>) => {
          state.creatingOrder = false
          state.orderNumber = action.payload
          state.orderError = ''
          state.tyres = []
          state.disks = []
          refreshCart(state)
          removeStoredCart()
        },
        rejected: (state, action) => {
          state.creatingOrder = false
          const unavailable = /^(\d+):(tyre|disk)$/.exec(action.error.message || '')
          state.orderError = 'Не удалось оформить заказ. Проверьте соединение и попробуйте ещё раз. Ваши данные сохранены.'
          if (unavailable) {
            const id = Number(unavailable[1])
            const product = (unavailable[2] === 'tyre' ? state.tyres : state.disks).find(item => item.id === id)
            state.orderError = `Товар ${product?.name || ''} закончился и удалён из корзины. Проверьте состав заказа перед повторным оформлением.`
            if (unavailable[2] === 'tyre') state.tyres = state.tyres.filter(item => item.id !== id)
            else state.disks = state.disks.filter(item => item.id !== id)
            refreshCart(state)
            persistCart(state)
          }
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
    orderErrorSelector: state => state.orderError,
    selectedProductsSelector: createSelector(
      [(state: CartState) => state.tyres, (state: CartState) => state.disks],
      (tyres, disks) => sortAllProducts({ tyres, disks }).filter(item => !item.canceled),
    ),
    orderPayloadSelector: createSelector(
      [(state: CartState) => state.tyres, (state: CartState) => state.disks],
      (tyres, disks) => buildOrderPayload({ tyres, disks }),
    ),
  },
})

export const {
  addTyresToCart, addDisksToCart, selectAllHandler, selectProductHandler, resetCart,
  delOneTypeProduct, changeAmount, pullLocalStorageData, orderIsCreating, createOrder,
} = cartSlice.actions

export const {
  priceAmountSelector, tyresDataSelector, disksDataSelector, selectAllSelector,
  creatingOrderSelector, orderNumberSelector, orderErrorSelector, selectedProductsSelector, orderPayloadSelector,
} = cartSlice.selectors
