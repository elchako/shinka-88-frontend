import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../app/createAppSlice"
import type { resultsTyresType, tyresCards } from "../main/blocks/filters/filtersBlocks/filterBlock1Slice"
import { type resultsDisksType } from "../main/blocks/filters/filtersBlocks/filterBlock2Slice"

export type selectedType = {
    canceled: boolean
    queue: number
}

interface IinitialState {
    priceAmount: number
    queueCounter: number
    selectAll: boolean
    tyres: Array<selectedType & resultsTyresType>
    disks: Array<selectedType & resultsDisksType>
}

type commonArrDataType = ((selectedType & resultsTyresType) | (selectedType & resultsDisksType))[]

const initialState: IinitialState = {
    priceAmount: 0,
    queueCounter: 0,
    selectAll: true,
    tyres: [],
    disks: [],
}


const recalcPriceAmount = (arr: commonArrDataType): number => {
    return arr.reduce((sum, item) => {
        if (!item.canceled) {
            return sum + item.price_sale * item.amount
        } else {
            return sum
        }
    }, 0)
}

const sortAllProducts = (state: IinitialState): commonArrDataType => {
    return [...state.tyres, ...state.disks].sort((a, b) => a.queue - b.queue)
}

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
        selectAllHandler: create.reducer(state => {
            state.selectAll = !state.selectAll
            state.tyres.forEach(item => item.canceled = !state.selectAll)
            state.disks.forEach(item => item.canceled = !state.selectAll)
            state.priceAmount = recalcPriceAmount(sortAllProducts(state))
            localStorage.setItem('cartData', JSON.stringify(state))
        }),
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
    }),
    selectors: {
        priceAmountSelector: state => state.priceAmount,
        tyresDataSelector: state => state.tyres,
        disksDataSelector: state => state.disks,
        selectAllSelector: state => state.selectAll
    },
})

// actions
export const { addTyresToCart, selectAllHandler, selectProductHandler,
    resetCart, delOneTypeProduct, changeAmount, pullLocalStorageData,
    addDisksToCart } =
    cartSlice.actions

// selectors
export const { priceAmountSelector, tyresDataSelector, selectAllSelector,
    disksDataSelector
} =
    cartSlice.selectors
