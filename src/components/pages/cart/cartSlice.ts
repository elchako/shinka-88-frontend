import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../app/createAppSlice"
import type { resultsType } from "../main/blocks/filters/filtersBlocks/filterBlock1Slice"

type selectedTyresType = {
    canceled: boolean
    queue: number
}

interface IinitialState {
    tyres: Array<selectedTyresType & resultsType>
    priceAmount: number
    queueCounter: number
}

const initialState: IinitialState = {
    priceAmount: 0,
    queueCounter: 0,
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
            state.priceAmount = state.tyres.reduce((sum, item) => {
                if (!item.canceled) {
                    return sum + item.price_sale * item.amount
                } else {
                    return sum
                }
            }, 0)
        }),
    }),
    selectors: {
        priceAmountSelector: state => state.priceAmount,
        tyresDataSelector: state => state.tyres,
        allProductsSelector: state => [...state.tyres].sort((a, b) => a.queue - b.queue),
    },
})

// actions
export const { addToCart } =
    cartSlice.actions

// selectors
export const { priceAmountSelector, tyresDataSelector, allProductsSelector } =
    cartSlice.selectors
