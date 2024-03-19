import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../../../../app/createAppSlice"
import { selectsNames1, checkboxesNames, typeSelectsValues, sorts } from "../../../../../../consts"

export interface IinitialState {
    tiresAPI: Array<Array<{ name: string, value: string }>>
    manufacturerAPI: Array<{ name: string, value: string }>
    typeSelect: string
    selects: Array<{ selectName: string, value: string | number | readonly string[] | undefined }>
    selectedManufacturers: Array<string>
    season: Array<string>
    checkboxes: Array<{ checkboxName: string, value: boolean }>
    sortType: string
}

// изначальные значения стейта
const selects = selectsNames1.map(selectName => ({ selectName, value: '' }))
const checkboxes = checkboxesNames.map(checkboxName => ({ checkboxName, value: false }))


//имитация данных с апи
// подбор по параметрам
const width = [{ name: '150', value: '150' }, { name: '150', value: '150' }, { name: '150', value: '150' },]
const height = [{ name: '150', value: '150' }, { name: '150', value: '150' }, { name: '150', value: '150' },]
const diameter = [{ name: '150', value: '150' }, { name: '150', value: '150' }, { name: '150', value: '150' },]
const manufacturer = [{ name: '150', value: '150' }, { name: '150', value: '150' }, { name: '150', value: '150' },]
const tiresParametrs = [width, height, diameter, manufacturer,]

// подбор по авто
const brand = [{ name: '150', value: '150' }, { name: '150', value: '150' }, { name: '150', value: '150' },]
const model = [{ name: '150', value: '150' }, { name: '150', value: '150' }, { name: '150', value: '150' },]
const year = [{ name: '150', value: '150' }, { name: '150', value: '150' }, { name: '150', value: '150' },]
const tiresByAuto = [brand, model, year,]

// производители
const manufacturer1 = [{ name: 'Производитель 1', value: 'Производитель 1' },
{ name: 'Производитель 2', value: 'Производитель 2' },
{ name: 'Производитель 3', value: 'Производитель 3' },
{ name: 'Производитель 3', value: 'Производитель 3' },
{ name: 'Производитель 3', value: 'Производитель 3' },
{ name: 'Производитель 3', value: 'Производитель 3' },
{ name: 'Производитель 3', value: 'Производитель 3' },]


const initialState: IinitialState = {
    tiresAPI: tiresParametrs,
    manufacturerAPI: manufacturer1,
    typeSelect: typeSelectsValues[0],
    selects: selects,
    selectedManufacturers: [],
    season: [],
    checkboxes: checkboxes,
    sortType: sorts[0],
}

export const filterBlock1Slice = createAppSlice({
    name: "filterBlock1",
    initialState,
    reducers: {
        // типы параметров (по параметрам, по автомобилю)
        typesSelect: (state, action: PayloadAction<string>) => {
            state.typeSelect = action.payload
            state.selects = selects
        },
        // селекты 
        selectsSelect: (state,
            action: PayloadAction<{ selectName: string, value: string, isMainPage: boolean }>) => {
            let payload = action.payload
            // для фильтра на главной
            let newSelects = state.selects.map(item => {
                if (item.selectName === payload.selectName) {
                    item.value = payload.value
                }
                return item
            })
            state.selects = newSelects
            // для фильтра на странице каталога шин
            if (payload.isMainPage) {
                if (state.selects.length === 4) {
                    state.selectedManufacturers[0] = payload.value
                }
            } else {
                if (state.selects.length === 4 && payload.selectName === selectsNames1[3]) {
                    if (state.selectedManufacturers.includes(payload.value)) {
                        state.selectedManufacturers = state.selectedManufacturers.filter(item => item !== payload.value)
                    } else {
                        state.selectedManufacturers.push(payload.value)
                    }
                }
            }
        },
        // сезоны
        seasonsSelectOne: (state, action: PayloadAction<string>) => {
            state.season[0] = action.payload
        },
        seasonsSelectMany: (state, action: PayloadAction<string>) => {
            if (state.season.includes(action.payload)) {
                state.season = state.season.filter(item => item !== action.payload)
            } else {
                state.season.push(action.payload)
            }
        },
        // чекбоксы внизу
        checkboxesSelect: (state, action: PayloadAction<string>) => {
            let payload = action.payload
            let newCheckboxes = state.checkboxes.map(item => {
                if (item.checkboxName === payload) {
                    item.value = !item.value
                }
                return item
            })
            state.checkboxes = newCheckboxes
        },
        sortTypeSelect: (state, action: PayloadAction<string>) => {
            state.sortType = action.payload
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
        tiresAPISelector: state => state.tiresAPI,
        manufacturerAPISelector: state => state.manufacturerAPI,
        selectedManufacturersSelector: state => state.selectedManufacturers,
        typesSelectSelector: state => state.typeSelect,
        selectSelector: state => state.selects,
        seasonsSelectSelector: state => state.season,
        checkboxesSelectSelector: state => state.checkboxes,
        sortTypeSelector: state => state.sortType,
    },
})

// actions
export const { seasonsSelectOne, selectsSelect, typesSelect, checkboxesSelect,
    sortTypeSelect, seasonsSelectMany } =
    filterBlock1Slice.actions

// selectors
export const { typesSelectSelector, selectSelector, seasonsSelectSelector,
    checkboxesSelectSelector, sortTypeSelector, tiresAPISelector,
    manufacturerAPISelector, selectedManufacturersSelector } =
    filterBlock1Slice.selectors
