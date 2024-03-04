import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../app/createAppSlice"

export interface IinitialState {
    mobileMenuIsClose: boolean
    mobileFiltersClose: boolean
}


const initialState: IinitialState = {
    mobileMenuIsClose: true,
    mobileFiltersClose: true
}

export const smallActions = createAppSlice({
    name: "smallActions",
    initialState,
    reducers: {
        mobileMenuReducer: state => {
            state.mobileMenuIsClose = !state.mobileMenuIsClose
        },
        mobileFiltersReducer: state => {
            state.mobileFiltersClose = !state.mobileFiltersClose
        },
        // incrementAsync: create.asyncThunk(
        //     async (amount: number) => {
        //         const response = await fetchCount(amount)
        //         // The value we return becomes the `fulfilled` action payload
        //         return response.data
        //     },
        //     {
        //         pending: state => {
        //             state.status = "loading"
        //         },
        //         fulfilled: (state, action) => {
        //             state.status = "idle"
        //             state.value += action.payload
        //         },
        //         rejected: state => {
        //             state.status = "failed"
        //         },
        //     },
        // ),
    },
    selectors: {
        mobileMenuSelector: state => state.mobileMenuIsClose,
        mobileFiltersSelector: state => state.mobileFiltersClose,
    },
})

// actions
export const { mobileMenuReducer, mobileFiltersReducer } =
    smallActions.actions

// selectors
export const { mobileMenuSelector, mobileFiltersSelector } =
    smallActions.selectors
