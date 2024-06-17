import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../../../../app/createAppSlice"
import { selectsNames2, sorts } from "../../../../../../consts"
import { filtersApi } from "../../../../../../api/catalog"
import type { RootState } from "../../../../../../app/store"

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

export type resultsDisksType = {
    id: number,
    article: string,
    name: string,
    name_origin: string,
    product_type: string,
    price_purchase: number,
    price_sale: number,
    image_url: string,
    image: string,
    date_add: string,
    description: string | null,
    balance: number,
    is_active: boolean,
    type_dist: string
    goodland: string,
    marka: string,
    model: string,
    diameter: string,
    width: string,
    holesquant: string,
    pcd: string,
    wheeloffset: string,
    dia: string,
    color: string,
    processway: string,
    mnfcode: string | null,
    territory_rn: string,
    provider: number
    amount: number
}

export type disksCards = {
    count: number | null,
    next: string | null,
    previous: string | null,
    results: Array<resultsDisksType>
}

export type fieldsDiskType = {
    diameter?: string | Array<string>
    type_disk?: string | Array<string>
    pcd?: string | Array<string>
}

export interface IinitialState {
    disksAPI: disksAPI
    selects: Array<{
        selectName: { apiName: string, displayName: string },
        value: string | Array<string>,
    }>
    disksCardsArr: disksCards
    sortType: string
}

// изначальные значения стейта
const selects = selectsNames2.map(selectName => ({ selectName, value: '' }))


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
    disksCardsArr: {
        count: null,
        next: null,
        previous: null,
        results: []
    },
    sortType: sorts[0]
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
        sortDisksTypeSelect: create.reducer((state, action: PayloadAction<string>) => {
            state.sortType = action.payload
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
        getDisksCards: create.asyncThunk(
            async (refresh, thunkAPI) => {
                const store = thunkAPI.getState() as RootState
                const state = store.filterBlock2

                const fields: fieldsDiskType = {}

                if (state.selects[0].value.length !== 0) fields.diameter = state.selects[0].value
                if (state.selects[1].value.length !== 0) fields.type_disk = state.selects[1].value
                if (state.selects[2].value.length !== 0) fields.pcd = state.selects[2].value
                let url = null
                if (!refresh && state.disksCardsArr.next) {
                    url = state.disksCardsArr.next.split('?')[1]
                }

                let orderBy = 'price_sale'
                if (state.sortType === sorts[1]) orderBy = '-' + orderBy

                const response = await filtersApi.getFilteredTyres(fields, orderBy, url)
                // The value we return becomes the `fulfilled` action payload
                return { response, refresh }
            },
            {
                pending: () => {
                    console.log('pending')
                },
                fulfilled: (state, action: PayloadAction<{ response: disksCards, refresh: boolean }>) => {
                    let res = action.payload.response
                    state.disksCardsArr.count = res.count
                    state.disksCardsArr.next = res.next
                    state.disksCardsArr.previous = res.previous
                    let results = res.results.map(item => {
                        item.amount = 1
                        return item
                    })
                    if (action.payload.refresh) {
                        state.disksCardsArr.results = res.results
                    } else {
                        state.disksCardsArr.results = [...state.disksCardsArr.results, ...results]
                    }
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
        filteredDisksSelector: state => state.disksCardsArr,
        sortDisksTypeSelector: state => state.sortType,
    },
})

// actions
export const { selectsSelect, getDisksParametrs, sortDisksTypeSelect,
    getDisksCards } = filterBlock2Slice.actions

// selectors
export const { selectSelector, disksAPISelector, filteredDisksSelector,
    sortDisksTypeSelector
} = filterBlock2Slice.selectors
