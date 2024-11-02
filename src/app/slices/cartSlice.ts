import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../createAppSlice"
import type {
    orderType,
    commonArrDataType,
    IinitialState
} from "../../types/cart"
import { type resultsTyresType } from "../../types/tires"
import { type resultsDisksType } from "../../types/disks"
import { orderApi } from "../../api/order"


const initialState: IinitialState = {
    priceAmount: 0,
    queueCounter: 0,
    selectAll: true,
    tyres: [],
    disks: [],
    creatingOrder: false,
    orderNumber: 0
}


// пересчёт общей цены за все товары
const recalcPriceAmount = (arr: commonArrDataType): number => {
    return arr.reduce((sum, item) => {
        if (!item.canceled) {
            return sum + item.price_sale * item.amount
        } else {
            return sum
        }
    }, 0)
}


// сортировка товаров в корзине
// в том же порядке, в котором они были добавлены
const sortAllProducts = (state: IinitialState): commonArrDataType => {
    return [...state.tyres, ...state.disks].sort((a, b) => a.queue - b.queue)
}


// поиск и отмена товара в корзине
const cancelProduct = (arr: commonArrDataType, id: number): { index: number; value: boolean; } => {
    let result = { index: 0, value: false }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            result.index = i
            result.value = !arr[i].canceled
        }
    }
    return result
}


export const cartSlice = createAppSlice({
    name: "cart",
    initialState,
    reducers: create => ({
        // добавление/удаление шин в корзину
        // из каталога
        addTyresToCart: create.reducer((state,
            action: PayloadAction<resultsTyresType>) => {
            let founded = false
            for (let i = 0; i < state.tyres.length; i++) {
                if (state.tyres[i].id === action.payload.id) {
                    state.tyres[i].amount = action.payload.amount
                    state.tyres[i].canceled = false
                    founded = true
                    break
                }
            }
            if (!founded) state.tyres.push({ ...action.payload, canceled: false, queue: state.queueCounter++ })
            state.priceAmount = recalcPriceAmount([...state.tyres, ...state.disks])
            localStorage.setItem('cartData', JSON.stringify(state))
        }),
        // добавление/удаление дисков в корзину
        // из каталога
        addDisksToCart: create.reducer((state,
            action: PayloadAction<resultsDisksType>) => {
            let founded = false
            for (let i = 0; i < state.disks.length; i++) {
                if (state.disks[i].id === action.payload.id) {
                    state.disks[i].amount = action.payload.amount
                    state.disks[i].canceled = false
                    founded = true
                    break
                }
            }
            if (!founded) state.disks.push({ ...action.payload, canceled: false, queue: state.queueCounter++ })
            state.priceAmount = recalcPriceAmount([...state.tyres, ...state.disks])
            localStorage.setItem('cartData', JSON.stringify(state))
        }),
        // выбрать/отменить все товары в корзине
        selectAllHandler: create.reducer(state => {
            state.selectAll = !state.selectAll
            state.tyres.forEach(item => item.canceled = !state.selectAll)
            state.disks.forEach(item => item.canceled = !state.selectAll)
            state.priceAmount = recalcPriceAmount(sortAllProducts(state))
            localStorage.setItem('cartData', JSON.stringify(state))
        }),
        // выбрать/отменить товар в корзине
        selectProductHandler: create.reducer((state,
            action: PayloadAction<{ productType: string, id: number }>) => {
            if (action.payload.productType === 'Шины') {
                let productValue = cancelProduct(state.tyres, action.payload.id)
                state.tyres[productValue.index].canceled = productValue.value
            }
            if (action.payload.productType === 'Диски') {
                let productValue = cancelProduct(state.disks, action.payload.id)
                state.disks[productValue.index].canceled = productValue.value
            }

            state.priceAmount = recalcPriceAmount(sortAllProducts(state))
            localStorage.setItem('cartData', JSON.stringify(state))
        }),
        // удаление всех товаров из корзины
        resetCart: create.reducer(state => {
            state.tyres = state.tyres.filter(item => item.canceled)
            state.disks = state.disks.filter(item => item.canceled)
            const newCartArr = sortAllProducts(state)
            state.priceAmount = recalcPriceAmount(newCartArr)
            state.queueCounter = newCartArr.length
            if (newCartArr.length !== 0) {
                newCartArr.forEach((item, index) => item.queue = index)
            }
            localStorage.removeItem('cartData')
        }),
        // удаление одного товара из корзины
        delOneTypeProduct: create.reducer((state,
            action: PayloadAction<{ productType: string, id: number }>) => {
            if (action.payload.productType === 'Шины') {
                state.tyres = state.tyres.filter(item => item.id !== action.payload.id)
            }

            if (action.payload.productType === 'Диски') {
                state.disks = state.disks.filter(item => item.id !== action.payload.id)
            }

            const newCartArr = sortAllProducts(state)
            state.priceAmount = recalcPriceAmount(newCartArr)
            state.queueCounter = newCartArr.length
            if (newCartArr.length !== 0) {
                newCartArr.forEach((item, index) => item.queue = index)
            }
            localStorage.setItem('cartData', JSON.stringify(state))

        }),
        // плюс/минус количества товара в конкретной карточке
        changeAmount: create.reducer((state,
            action: PayloadAction<{ type: string, id: number, isPlus: boolean }>) => {
            let arrData: commonArrDataType = []
            if (action.payload.type === 'Шины') arrData = state.tyres
            if (action.payload.type === 'Диски') arrData = state.disks

            for (let i = 0; i < arrData.length; i++) {
                if (arrData[i].id === action.payload.id) {
                    if (action.payload.isPlus && arrData[i].amount < arrData[i].balance) {
                        arrData[i].amount++
                    } else if (!action.payload.isPlus && arrData[i].amount > 1) {
                        arrData[i].amount--
                    }
                    break
                }
            }
            state.priceAmount = recalcPriceAmount(sortAllProducts(state))
            localStorage.setItem('cartData', JSON.stringify(state))
        }),
        // загрузка данных из localStorage
        pullLocalStorageData: create.reducer(state => {
            const localData = localStorage.getItem('cartData')
            if (localData) {
                const localDataParsed = JSON.parse(localData)
                state.tyres = localDataParsed.tyres
                state.disks = localDataParsed.disks
                state.priceAmount = localDataParsed.priceAmount
                state.queueCounter = localDataParsed.queueCounter
                state.selectAll = localDataParsed.selectAll
            }
        }),
        // заказ создаётся
        orderIsCreating: create.reducer(state => {
            state.creatingOrder = !state.creatingOrder
            state.orderNumber = 0
        }),
        // создание заказа
        createOrder: create.asyncThunk(
            async (args: { order: orderType, token: string }) => {
                const response = await orderApi.createOrder(args.order, args.token)
                console.log(response)
                if (response.order) {
                    return response.order
                } else {
                    throw new Error(response.id + ':' + response.type)
                }
            },
            {
                pending: state => {
                    state.creatingOrder = !state.creatingOrder
                },
                fulfilled: (state, action: PayloadAction<number>) => {
                    state.priceAmount = 0
                    state.queueCounter = 0
                    state.selectAll = true
                    state.tyres = []
                    state.disks = []
                    state.orderNumber = 0
                    state.orderNumber = action.payload
                    localStorage.removeItem('cartData')
                },
                rejected: (state, action: any) => {
                    state.creatingOrder = !state.creatingOrder
                    const [id, type] = action.error.message.split(':')
                    if (type === 'disk') {
                        let disks = [...state.disks]
                        for (let i = 0; i < disks.length; i++) {
                            if (disks[i].id === Number(id)) {
                                alert(`К сожалению товар ${disks[i].name} закончился`)
                                disks.splice(i, 1)
                                state.disks = disks
                                break
                            }
                        }
                    }
                    if (type === 'tyre') {
                        let tyres = [...state.tyres]
                        for (let i = 0; i < tyres.length; i++) {
                            if (tyres[i].id === Number(id)) {
                                alert(`К сожалению товар ${tyres[i].name} закончился`)
                                tyres.splice(i, 1)
                                state.tyres = tyres
                                break
                            }
                        }
                    }

                    const newCartArr = sortAllProducts(state)
                    state.priceAmount = recalcPriceAmount(newCartArr)
                    state.queueCounter = newCartArr.length
                    if (newCartArr.length !== 0) {
                        newCartArr.forEach((item, index) => item.queue = index)
                    }
                    localStorage.setItem('cartData', JSON.stringify(state))
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
    },
})

// actions
export const { addTyresToCart, selectAllHandler, selectProductHandler,
    resetCart, delOneTypeProduct, changeAmount, pullLocalStorageData,
    addDisksToCart, orderIsCreating, createOrder } =
    cartSlice.actions

// selectors
export const { priceAmountSelector, tyresDataSelector, selectAllSelector,
    disksDataSelector, creatingOrderSelector, orderNumberSelector
} =
    cartSlice.selectors
