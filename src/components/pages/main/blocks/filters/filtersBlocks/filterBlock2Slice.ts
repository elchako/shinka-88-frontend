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
    type_disk: string
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
    pcd?: string | Array<string>
    type_disk?: string | Array<string>
    price?: Array<number>
}

export interface IinitialState {
    disksAPI: disksAPI
    selects: Array<{
        selectName: { apiName: string, displayName: string },
        value: string | Array<string>,
    }>
    disksCardsArr: disksCards
    sortType: string
    priceStart: number
    priceEnd: number
}

// изначальные значения стейта
const selects = selectsNames2.map(selectName => {
    let initValue: Array<string> = []
    return { selectName, value: initValue }
})


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
    sortType: sorts[0],
    priceStart: 0,
    priceEnd: 0,
}

export const filterBlock2Slice = createAppSlice({
    name: "filterBlock2",
    initialState,
    reducers: create => ({
        selectsSelect: create.reducer((state,
            action: PayloadAction<{ selectName: string, value: string, isOneChoice: boolean }>) => {
            let payload = action.payload
            let newSelects = state.selects.map(item => {
                if (item.selectName.apiName === payload.selectName) {
                    // для постоянных селектов где только 1 значение
                    if (typeof item.value === 'string') {
                        item.value = payload.value
                    } else {
                        // для селекта с трансформацией в чекбоксы
                        // где массив значений
                        if (payload.isOneChoice) {
                            // если селект
                            item.value = [payload.value]
                        } else {
                            // если чекбоксы
                            if (item.value.includes(payload.value)) {
                                item.value = item.value.filter(item => item !== payload.value)
                            } else {
                                item.value.push(payload.value)
                            }
                        }
                    }
                }
                return item
            })
            state.selects = newSelects
        }),
        sortDisksTypeSelect: create.reducer((state, action: PayloadAction<string>) => {
            state.sortType = action.payload
        }),
        amountHandler: create.reducer((state, action: PayloadAction<{ id: number, isPlus: boolean }>) => {
            for (let i = 0; i < state.disksCardsArr.results.length; i++) {
                if (state.disksCardsArr.results[i].id === action.payload.id) {
                    if (action.payload.isPlus
                        && state.disksCardsArr.results[i].amount < state.disksCardsArr.results[i].balance) {
                        state.disksCardsArr.results[i].amount++
                    } else if (!action.payload.isPlus &&
                        state.disksCardsArr.results[i].amount > 1) {
                        state.disksCardsArr.results[i].amount--
                    }
                    break
                }
            }
        }),
        setPrice: create.reducer((state, action: PayloadAction<{ number: number, isStartOrEnd: boolean }>) => {
            let number = action.payload.number
            if (action.payload.number > 20000) number = 20000
            action.payload.isStartOrEnd
                ? state.priceStart = number
                : state.priceEnd = number
        }),
        resetFilters: create.reducer(state => {
            state.selects = selects
            console.log(selects)
            state.priceStart = 0
            state.priceEnd = 0
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
                if (state.selects[1].value.length !== 0) fields.pcd = state.selects[1].value
                if (state.selects[2].value.length !== 0) fields.type_disk = state.selects[2].value

                let url = null
                if (!refresh && state.disksCardsArr.next) {
                    url = state.disksCardsArr.next.split('?')[1]
                }

                if (state.priceStart !== 0 || state.priceEnd !== 0) {
                    const price = []
                    state.priceStart !== 0
                        ? price[0] = state.priceStart
                        : price[0] = 0
                    state.priceEnd !== 0
                        ? price[1] = state.priceEnd
                        : price[1] = 20000
                    fields.price = price
                }

                let orderBy = 'price_sale'
                if (state.sortType === sorts[1]) orderBy = '-' + orderBy
                const response = await filtersApi.getFilteredDisks(fields, orderBy, url)

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
        priceStartSelector: state => state.priceStart,
        priceEndSelector: state => state.priceEnd,
    },
})

// actions
export const { selectsSelect, getDisksParametrs, sortDisksTypeSelect,
    getDisksCards, amountHandler, setPrice, resetFilters } = filterBlock2Slice.actions

// selectors
export const { selectSelector, disksAPISelector, filteredDisksSelector,
    sortDisksTypeSelector, priceStartSelector, priceEndSelector
} = filterBlock2Slice.selectors
