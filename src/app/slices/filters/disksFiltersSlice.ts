import { type PayloadAction } from "@reduxjs/toolkit"
import { selectsNames2, sorts } from "../../../consts"
import { createAppSlice } from "../../createAppSlice"
import { filtersApi } from "../../../api/catalog"
import { type RootState } from "../../store"
import {
    type disksCards,
    type disksAPI,
    type fieldsDiskType,
    type IinitialState
} from "../../../types/disks"


// изначальные значения стейта
const selects = selectsNames2.map(selectName => {
    let initValue: Array<string> = []
    return { selectName, value: initValue }
})


const initialState: IinitialState = {
    // данные для фильтров
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
    // данные карточек
    disksCardsArr: {
        count: null,
        next: null,
        previous: null,
        results: []
    },
    // фильтры
    selects: selects,
    sortType: sorts[0],
    priceStart: 0,
    priceEnd: 0,
}

export const filterBlock2Slice = createAppSlice({
    name: "disksFilters",
    initialState,
    reducers: create => ({
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
        // сортировка
        sortDisksTypeSelect: create.reducer((state, action: PayloadAction<string>) => {
            state.sortType = action.payload
        }),
        // плюс/минус количество конкретного товара
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
        // установить цену
        setPrice: create.reducer((state, action: PayloadAction<{ number: number, isStartOrEnd: boolean }>) => {
            let number = action.payload.number
            if (action.payload.number > 20000) number = 20000
            action.payload.isStartOrEnd
                ? state.priceStart = number
                : state.priceEnd = number
        }),
        // сбросить фильтры
        resetFilters: create.reducer(state => {
            state.selects = selects
            console.log(selects)
            state.priceStart = 0
            state.priceEnd = 0
        }),

        // Thunks
        // получить данные для фильтров
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
        // Получение карточек товаров по установленным фильтрам
        getDisksCards: create.asyncThunk(
            async (refresh, thunkAPI) => {
                const store = thunkAPI.getState() as RootState
                const state = store.disksFilters

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
