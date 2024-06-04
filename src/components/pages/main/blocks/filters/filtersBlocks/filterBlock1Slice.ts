import { type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../../../../app/createAppSlice"
import { selectsNames1, checkboxesNames, typeSelectsValues, sorts } from "../../../../../../consts"
import { filtersApi } from "../../../../../../api/catalog"

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

export type tyresCards = {
    count: number | null,
    next: string | null,
    previous: string | null,
    results: Array<{
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
    }>
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
    priceStart: 3500,
    priceEnd: 20000,
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
                    // console.log(action.payload.runflat)
                    let checkboxesWithValues = state.checkboxes.map(item => {
                        item.value = action.payload.runflat
                        return item
                    })
                    state.checkboxes = checkboxesWithValues
                },
                rejected: () => {
                    console.log('error')
                },
            },
        ),
        getTyresCards: create.asyncThunk(
            async () => {
                const response = await filtersApi.getFilteredTyres()
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
                    state.tyresCardsArr.results = action.payload.results
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
        filteredTyresSelector: state => state.tyresCardsArr
    },
})

// actions
export const { seasonsSelectOne, selectsSelect, checkboxesSelect,
    sortTypeSelect, seasonsSelectMany, explanationToggle, getTyresParametrs,
    getTyresCards } =
    filterBlock1Slice.actions

// selectors
export const { typesSelectSelector, selectSelector, seasonsSelectSelector,
    checkboxesSelectSelector, sortTypeSelector, tiresAPISelector,
    explanationToggleSelector, filteredTyresSelector } =
    filterBlock1Slice.selectors
