import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../../../../app/createAppSlice"

export interface IinitialState {
    season: string | null
}

const initialState: IinitialState = {
    season: null,
}

export const filterBlock1Slice = createAppSlice({
    name: "filterBlock1",
    initialState,
    reducers: {
        seasonsSelect: (state, action: PayloadAction<string>) => {
            state.season = action.payload
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
    // You can define your selectors here. These selectors receive the slice
    // state as their first argument.
    selectors: {
        seasonsSelectSelecor: state => state.season,
    },
})

// Action creators are generated for each case reducer function.
export const { seasonsSelect } =
    filterBlock1Slice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { seasonsSelectSelecor } = filterBlock1Slice.selectors
