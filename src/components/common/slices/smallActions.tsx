import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../app/createAppSlice"

export interface IinitialState {
    mobileMenuIsClose: boolean
    mobileFiltersClose: boolean
}


const initialState: IinitialState = {
    mobileMenuIsClose: true,
    mobileFiltersClose: true,
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
    },
    selectors: {
        mobileMenuSelector: state => state.mobileMenuIsClose,
        mobileFiltersSelector: state => state.mobileFiltersClose
    },
})

// actions
export const { mobileMenuReducer, mobileFiltersReducer } =
    smallActions.actions

// selectors
export const { mobileMenuSelector, mobileFiltersSelector } =
    smallActions.selectors
