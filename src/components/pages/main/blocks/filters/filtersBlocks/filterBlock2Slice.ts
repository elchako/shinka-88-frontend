import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../../../../app/createAppSlice"
import { selectsNames2 } from "../../../../../../consts"
import { filtersApi } from "../../../../../../api/catalog"

export type disksAPI = {
    type_disk: Array<string>
    goodland: Array<string>
    marka: Array<null>
    model: Array<string | null>
    diameter: Array<string>
    width: Array<string>
    holesquant: Array<string>
    pcd: Array<string>
    wheeloffset: Array<string>
    dia: Array<string | null>
    color: Array<string | null>
    processway: Array<string | null>
    territory_rn: Array<string>
    provider: Array<string>
}

export interface IinitialState {
    disksAPI: disksAPI
    selects: Array<{
        selectName: { apiName: string, displayName: string },
        value: string | Array<string>,
    }>
}

// изначальные значения стейта
const selects = selectsNames2.map((selectName, index) => ({ selectName, value: '' }))


const initialState: IinitialState = {
    disksAPI: {
        type_disk: [],
        goodland: [],
        marka: [],
        model: [],
        diameter: [],
        width: [],
        holesquant: [],
        pcd: [],
        wheeloffset: [],
        dia: [],
        color: [],
        processway: [],
        territory_rn: [],
        provider: [],
    },
    selects: selects,
}

export const filterBlock2Slice = createAppSlice({
    name: "filterBlock2",
    initialState,
    reducers: create => ({
        selectsSelect: create.reducer((state,
            action: PayloadAction<{ selectName: string, value: string }>) => {
            let payload = action.payload
            let newSelects = state.selects.map(item => {
                if (item.selectName.apiName === payload.selectName) {
                    item.value = payload.value
                }
                return item
            })
            state.selects = newSelects
        }),
        getDisksParametrs: create.asyncThunk(
            async () => {
                const response = await filtersApi.getDisks()
                // The value we return becomes the `fulfilled` action payload
                return response
            },
            {
                pending: () => {
                    console.log('pending')
                },
                fulfilled: (state, action: PayloadAction<disksAPI>) => {
                    state.disksAPI = { ...state.disksAPI, ...action.payload }
                },
                rejected: () => {
                    console.log('error')
                },
            },
        ),
    }),
    selectors: {
        disksAPISelector: state => state.disksAPI,
        selectSelector: state => state.selects,
    },
})

// actions
export const { selectsSelect, getDisksParametrs } = filterBlock2Slice.actions

// selectors
export const { selectSelector, disksAPISelector, } = filterBlock2Slice.selectors
