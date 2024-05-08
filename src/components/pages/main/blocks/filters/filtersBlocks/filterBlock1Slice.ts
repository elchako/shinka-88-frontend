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

export interface IinitialState {
    tiresAPI: tiresAPI
    typeSelect: string
    selects: Array<{
        selectName: { apiName: string, displayName: string },
        value: string | Array<string>,
    }>
    season: Array<string>
    checkboxes: Array<{ checkboxName: string, value: boolean }>
    sortType: string
    explanationOpenToggle: boolean
}

// изначальные значения стейта
const selects = selectsNames1.map((selectName, index) => {
    let initValue: string | Array<string> = ''
    if (index !== 3) initValue = []
    return { selectName, value: initValue }
})
const checkboxes = checkboxesNames.map(checkboxName => ({ checkboxName, value: false }))


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
    sortType: sorts[0],
    explanationOpenToggle: false,
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
        seasonsSelectOne: create.reducer((state, action: PayloadAction<string>) => {
            state.season[0] = action.payload
        }),
        seasonsSelectMany: create.reducer((state, action: PayloadAction<string>) => {
            if (state.season.includes(action.payload)) {
                state.season = state.season.filter(item => item !== action.payload)
            } else {
                state.season.push(action.payload)
            }
        }),
        // чекбоксы внизу
        checkboxesSelect: create.reducer((state, action: PayloadAction<string>) => {
            let payload = action.payload
            let newCheckboxes = state.checkboxes.map(item => {
                if (item.checkboxName === payload) {
                    item.value = !item.value
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
    },
})

// actions
export const { seasonsSelectOne, selectsSelect, checkboxesSelect,
    sortTypeSelect, seasonsSelectMany, explanationToggle, getTyresParametrs } =
    filterBlock1Slice.actions

// selectors
export const { typesSelectSelector, selectSelector, seasonsSelectSelector,
    checkboxesSelectSelector, sortTypeSelector, tiresAPISelector,
    explanationToggleSelector } =
    filterBlock1Slice.selectors
