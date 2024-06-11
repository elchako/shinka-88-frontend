import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../app/createAppSlice"
import type { resultsType } from "../main/blocks/filters/filtersBlocks/filterBlock1Slice"

const recalcPriceAmount = (arr: Array<selectedTyresType & resultsType>): number => {
    return arr.reduce((sum, item) => {
        if (!item.canceled) {
            return sum + item.price_sale * item.amount
        } else {
            return sum
        }
    }, 0)
}

const sortAllProducts = (state: IinitialState): Array<selectedTyresType & resultsType> => {
    return [...state.tyres].sort((a, b) => a.queue - b.queue)
}

const cancelProduct = (arr: Array<selectedTyresType & resultsType>, id: number): { index: number; value: boolean; } => {
    let result = { index: 0, value: false }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            result.index = i
            result.value = !arr[i].canceled
        }
    }
    return result
}

export type selectedTyresType = {
    canceled: boolean
    queue: number
}

interface IinitialState {
    priceAmount: number
    queueCounter: number
    selectAll: boolean
    tyres: Array<selectedTyresType & resultsType>
}

const initialState: IinitialState = {
    priceAmount: 0,
    queueCounter: 0,
    selectAll: true,
    tyres: [],
}

export const cartSlice = createAppSlice({
    name: "cart",
    initialState,
    reducers: create => ({
        addToCart: create.reducer((state, action: PayloadAction<resultsType>) => {
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
            state.priceAmount = recalcPriceAmount(state.tyres)
        }),
        selectAllHandler: create.reducer(state => {
            state.selectAll = !state.selectAll
            state.tyres.forEach(item => item.canceled = !state.selectAll)
            state.priceAmount = recalcPriceAmount(sortAllProducts(state))
        }),
        selectProductHandler: create.reducer((state,
            action: PayloadAction<{ productType: string, id: number }>) => {
            if (action.payload.productType === 'Шины') {
                let productValue = cancelProduct(state.tyres, action.payload.id)
                state.tyres[productValue.index].canceled = productValue.value
            }

            state.priceAmount = recalcPriceAmount(sortAllProducts(state))
        }),
        resetCart: create.reducer(state => {
            state.tyres = state.tyres.filter(item => item.canceled)
            const newCartArr = sortAllProducts(state)
            state.priceAmount = recalcPriceAmount(newCartArr)
            state.queueCounter = newCartArr.length
            if (newCartArr.length !== 0) {
                newCartArr.forEach((item, index) => item.queue = index)
            }
        }),
        delOneTypeProduct: create.reducer((state,
            action: PayloadAction<{ productType: string, id: number }>) => {
            if (action.payload.productType === 'Шины') {
                state.tyres = state.tyres.filter(item => item.id !== action.payload.id)
            }

            const newCartArr = sortAllProducts(state)
            state.priceAmount = recalcPriceAmount(newCartArr)
            state.queueCounter = newCartArr.length
            if (newCartArr.length !== 0) {
                newCartArr.forEach((item, index) => item.queue = index)
            }

        }),
        changeAmount: create.reducer((state,
            action: PayloadAction<{ type: string, id: number, isPlus: boolean }>) => {
            let arrData: Array<selectedTyresType & resultsType> = []
            if (action.payload.type === 'Шины') arrData = state.tyres

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
        })
    }),
    selectors: {
        priceAmountSelector: state => state.priceAmount,
        tyresDataSelector: state => state.tyres,
        allProductsSelector: state => [...state.tyres].sort((a, b) => a.queue - b.queue),
        selectAllSelector: state => state.selectAll
    },
})

// actions
export const { addToCart, selectAllHandler, selectProductHandler,
    resetCart, delOneTypeProduct, changeAmount } =
    cartSlice.actions

// selectors
export const { priceAmountSelector, tyresDataSelector, allProductsSelector,
    selectAllSelector } =
    cartSlice.selectors
