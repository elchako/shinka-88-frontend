import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../../../../app/createAppSlice"
import { selectsNames1, checkboxesNames, typeSelectsValues, sorts } from "../../../../../../consts"
import { filtersApi } from "../../../../../../api/catalog"
import type { RootState } from "../../../../../../app/store"

export type tiresAPI = {
    diameter: Array<string>
    goodland: Array<string | null>
    height: Array<string>
    load: Array<string>
    marka: Array<string>
    model: Array<string>
    powerload: Array<string | null>
    runflat: Array<string | null>
    seazon: Array<string>
    speed: Array<string | null>
    territory_rn: Array<string>
    thorning: Array<string>
    thorntype: Array<string | null>
    width: Array<string>
}

export type resultsType = {
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
    goodland: string,
    marka: string,
    model: string,
    seazon: string,
    diameter: string,
    width: string,
    height: string,
    thorning: string,
    speed: string,
    load: string,
    thorntype: string,
    mnfcode: string | null,
    runflat: string | null,
    powerload: string | null,
    territory_rn: string,
    provider: number
    amount: number
}

export type tyresCards = {
    count: number | null,
    next: string | null,
    previous: string | null,
    results: Array<resultsType>
}

export interface IinitialState {
    tiresAPI: tiresAPI
    typeSelect: string
    selects: Array<{
        selectName: { apiName: string, displayName: string },
        value: string | Array<string>,
    }>
    season: Array<{ name: string, value1: string, value2: string }>
    checkboxes: Array<{ checkboxName: string, checked: boolean, value: Array<null | string> }>
    priceStart: number,
    priceEnd: number,
    sortType: string
    explanationOpenToggle: boolean
    tyresCardsArr: tyresCards
}

// изначальные значения стейта
const selects = selectsNames1.map((selectName, index) => {
    let initValue: string | Array<string> = ''
    if (index !== 3) initValue = []
    return { selectName, value: initValue }
})
const checkboxes = checkboxesNames.map(checkboxName => ({ checkboxName, checked: false, value: [] }))


const initialState: IinitialState = {
    tiresAPI: {
        diameter: [],
        goodland: [],
        height: [],
        load: [],
        marka: [],
        model: [],
        powerload: [],
        runflat: [],
        seazon: [],
        speed: [],
        territory_rn: [],
        thorning: [],
        thorntype: [],
        width: [],
    },
    typeSelect: typeSelectsValues[0],
    selects: selects,
    season: [],
    checkboxes: checkboxes,
    priceStart: 0,
    priceEnd: 0,
    sortType: sorts[0],
    explanationOpenToggle: false,
    tyresCardsArr: {
        count: null,
        next: null,
        previous: null,
        results: []
    },
}

export const filterBlock1Slice = createAppSlice({
    name: "filterBlock1",
    initialState,
    reducers: create => ({
        // типы параметров (по параметрам, по автомобилю)
        // typesSelect: create.reducer((state, action: PayloadAction<string>) => {
        //     state.typeSelect = action.payload
        //     state.selects = selects
        // }),
        // селекты 
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
        // сезоны
        seasonsSelectOne: create.reducer((state,
            action: PayloadAction<{ name: string, value1: string, value2: string }>) => {
            state.season[0] = action.payload
        }),
        seasonsSelectMany: create.reducer((state,
            action: PayloadAction<{ name: string, value1: string, value2: string }>) => {
            let isThere = false
            state.season.forEach(item => item.name !== action.payload.name ? null : isThere = true)

            if (!isThere) {
                state.season.push(action.payload)
            } else {
                state.season.splice(state.season.indexOf(action.payload), 1)
            }
        }),
        // чекбоксы внизу
        checkboxesSelect: create.reducer((state, action: PayloadAction<string>) => {
            let payload = action.payload
            let newCheckboxes = state.checkboxes.map(item => {
                if (item.checkboxName === payload) {
                    item.checked = !item.checked
                }
                return item
            })
            state.checkboxes = newCheckboxes
        }),
        sortTypeSelect: create.reducer((state, action: PayloadAction<string>) => {
            state.sortType = action.payload
        }),
        explanationToggle: create.reducer((state, action: PayloadAction<boolean>) => {
            state.explanationOpenToggle = action.payload
        }),
        resetFilters: create.reducer(state => {
            state.season = []
            state.selects = selects
            state.checkboxes = state.checkboxes.map(item => {
                item.checked = false
                return item
            })
            state.priceStart = 0
            state.priceEnd = 0
        }),
        setPrice: create.reducer((state, action: PayloadAction<{ number: number, isStartOrEnd: boolean }>) => {
            let number = action.payload.number
            if (action.payload.number > 20000) number = 20000
            action.payload.isStartOrEnd
                ? state.priceStart = number
                : state.priceEnd = number
        }),
        amountHandler: create.reducer((state, action: PayloadAction<{ id: number, isPlus: boolean }>) => {
            for (let i = 0; i < state.tyresCardsArr.results.length; i++) {
                if (state.tyresCardsArr.results[i].id === action.payload.id) {
                    if (action.payload.isPlus
                        && state.tyresCardsArr.results[i].amount <= state.tyresCardsArr.results[i].balance) {
                        state.tyresCardsArr.results[i].amount++
                    } else if (state.tyresCardsArr.results[i].amount > 1) {
                        state.tyresCardsArr.results[i].amount--
                    }
                    break
                }
            }
        }),
        getTyresParametrs: create.asyncThunk(
            async () => {
                const response = await filtersApi.getTyres()
                // The value we return becomes the `fulfilled` action payload
                return response
            },
            {
                pending: () => {
                    console.log('pending')
                },
                fulfilled: (state, action: PayloadAction<tiresAPI>) => {
                    state.tiresAPI = { ...state.tiresAPI, ...action.payload }
                    action.payload.runflat.splice(action.payload.runflat.indexOf(null), 1)
                    action.payload.powerload.splice(action.payload.powerload.indexOf(null), 1)
                    state.checkboxes[0].value = action.payload.runflat
                    state.checkboxes[1].value = action.payload.powerload
                },
                rejected: () => {
                    console.log('error')
                },
            },
        ),
        getTyresCards: create.asyncThunk(
            async (_, thunkAPI) => {
                const store = thunkAPI.getState() as RootState
                const state = store.filterBlock1
                type fieldsType = {
                    width?: Array<string> | string
                    height?: Array<string> | string
                    diameter?: Array<string> | string
                    seazon?: Array<string>
                    thorning?: Array<string>
                    runflat?: Array<string | null>
                    powerload?: Array<string | null>
                    price?: Array<number>
                }
                const fields: fieldsType = {}

                if (state.selects[0].value.length !== 0) fields.width = state.selects[0].value
                if (state.selects[1].value.length !== 0) fields.height = state.selects[1].value
                if (state.selects[2].value.length !== 0) fields.diameter = state.selects[2].value
                if (state.season.length !== 0) {
                    let seasons: Array<string> = []
                    let thorning: Array<string> = []
                    state.season.forEach(item => {
                        seasons.push(item.value2)
                        thorning.push(item.value1)
                    })
                    fields.seazon = seasons
                    fields.thorning = thorning
                }
                if (state.checkboxes[0].checked) fields.runflat = state.checkboxes[0].value
                if (state.checkboxes[1].checked) fields.powerload = state.checkboxes[1].value

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
                const response = await filtersApi.getFilteredTyres(fields)
                // The value we return becomes the `fulfilled` action payload
                return response
            },
            {
                pending: () => {
                    console.log('pending')
                },
                fulfilled: (state, action: PayloadAction<tyresCards>) => {
                    state.tyresCardsArr.count = action.payload.count
                    state.tyresCardsArr.next = action.payload.next
                    state.tyresCardsArr.previous = action.payload.previous
                    state.tyresCardsArr.results = action.payload.results.map(item => {
                        item.amount = 1
                        return item
                    })
                },
                rejected: () => {
                    console.log('error')
                },
            },
        ),
    }),
    selectors: {
        tiresAPISelector: state => state.tiresAPI,
        typesSelectSelector: state => state.typeSelect,
        selectSelector: state => state.selects,
        seasonsSelectSelector: state => state.season,
        checkboxesSelectSelector: state => state.checkboxes,
        sortTypeSelector: state => state.sortType,
        explanationToggleSelector: state => state.explanationOpenToggle,
        filteredTyresSelector: state => state.tyresCardsArr,
        priceStartSelector: state => state.priceStart,
        priceEndSelector: state => state.priceEnd,
    },
})

// actions
export const { seasonsSelectOne, selectsSelect, checkboxesSelect,
    sortTypeSelect, seasonsSelectMany, explanationToggle, getTyresParametrs,
    getTyresCards, resetFilters, setPrice, amountHandler } =
    filterBlock1Slice.actions

// selectors
export const { typesSelectSelector, selectSelector, seasonsSelectSelector,
    checkboxesSelectSelector, sortTypeSelector, tiresAPISelector,
    explanationToggleSelector, filteredTyresSelector, priceStartSelector,
    priceEndSelector } =
    filterBlock1Slice.selectors
