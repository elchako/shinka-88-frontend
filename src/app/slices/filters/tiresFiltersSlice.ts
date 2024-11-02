import { type PayloadAction, } from "@reduxjs/toolkit"
import { checkboxesNames, selectsNames1, sorts } from "../../../consts"
import { createAppSlice } from "../../createAppSlice"
import { filtersApi } from "../../../api/catalog"
import { type RootState } from "../../store"
import {
    type tyresCards,
    type tiresAPI,
    type fieldsTyresType,
    type IinitialState
} from "../../../types/tires"

// изначальные значения стейта
const selects = selectsNames1.map((selectName, index) => {
    let initValue: string | Array<string> = ''
    if (index !== 3) initValue = []
    return { selectName, value: initValue }
})
const checkboxes = checkboxesNames.map(checkboxName => ({ checkboxName, checked: false, value: [] }))


export const initialState: IinitialState = {
    // данные для фильтров
    tiresAPI: {
        max_price: 0,
        min_price: 0,
        response_data: {
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
        }
    },
    // данные карточек
    tyresCardsArr: {
        count: null,
        next: null,
        previous: null,
        results: []
    },
    // фильтры
    selects: selects,
    season: [],
    checkboxes: checkboxes,
    priceStart: 0,
    priceEnd: 0,
    priceMin: 0,
    priceMax: 0,
    sortType: sorts[0],
}

export const filterBlock1Slice = createAppSlice({
    name: "tiresFilters",
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
        // сезоны
        seasonsSelectOne: create.reducer((state,
            action: PayloadAction<{ name: string, value1: string, value2: string }>) => {
            state.season[0] = action.payload
        }),
        seasonsSelectMany: create.reducer((state,
            action: PayloadAction<{ name: string, value1: string, value2: string }>) => {
            let isThere: number | null = null
            state.season.forEach((item, index) => item.name !== action.payload.name ? null : isThere = index)

            if (isThere === null) {
                state.season.push(action.payload)
            } else {
                state.season.splice(isThere, 1)
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
        // сбросить фильтры
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
        // установить цену
        setPrice: create.reducer((state, action: PayloadAction<{ number: string, isStartOrEnd: boolean }>) => {
            if (Number.isNaN(action.payload.number)) return
            let number = Number(action.payload.number)
            if (number > state.priceMax) number = state.priceMax
            action.payload.isStartOrEnd
                ? state.priceStart = number
                : state.priceEnd = number
        }),
        // плюс/минус количество конкретного товара
        amountHandler: create.reducer((state, action: PayloadAction<{ id: number, isPlus: boolean }>) => {
            for (let i = 0; i < state.tyresCardsArr.results.length; i++) {
                if (state.tyresCardsArr.results[i].id === action.payload.id) {
                    console.log(state.tyresCardsArr.results[i].amount)
                    console.log(state.tyresCardsArr.results[i].balance)
                    let amount = state.tyresCardsArr.results[i].amount
                    let balance = state.tyresCardsArr.results[i].balance

                    if (action.payload.isPlus
                        && amount < balance) {
                        state.tyresCardsArr.results[i].amount++
                    } else if (amount !== 1 && !action.payload.isPlus) {
                        state.tyresCardsArr.results[i].amount--
                    }
                    break
                }
            }
        }),
        // сортировка
        sortTyresTypeSelect: create.reducer((state, action: PayloadAction<string>) => {
            state.sortType = action.payload
        }),

        // Thunks
        // получить данные для фильтров
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
                    action.payload.response_data.runflat.splice(action.payload.response_data.runflat.indexOf(null), 1)
                    action.payload.response_data.powerload.splice(action.payload.response_data.powerload.indexOf(null), 1)
                    state.checkboxes[0].value = action.payload.response_data.runflat
                    state.checkboxes[1].value = action.payload.response_data.powerload
                    state.priceMin = action.payload.min_price
                    state.priceMax = action.payload.max_price
                },
                rejected: () => {
                    console.log('error')
                },
            },
        ),
        // Получение карточек товаров по установленным фильтрам
        getTyresCards: create.asyncThunk(
            async (refresh, thunkAPI) => {
                const store = thunkAPI.getState() as RootState
                const state = store.tiresFilters
                const fields: fieldsTyresType = {}

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

                let url = null
                if (!refresh && state.tyresCardsArr.next) {
                    url = state.tyresCardsArr.next.split('?')[1]
                }

                let orderBy = 'price_sale'
                if (state.sortType === sorts[1]) orderBy = '-' + orderBy

                const response = await filtersApi.getFilteredTyres(fields, orderBy, url)

                return { response, refresh }
            },
            {
                pending: () => {
                    console.log('pending')
                },
                fulfilled: (state, action: PayloadAction<{ response: tyresCards, refresh: boolean }>) => {
                    let res = action.payload.response
                    state.tyresCardsArr.count = res.count
                    state.tyresCardsArr.next = res.next
                    state.tyresCardsArr.previous = res.previous

                    let results = res.results.map(item => {
                        item.amount = 1
                        return item
                    })
                    if (action.payload.refresh) {
                        state.tyresCardsArr.results = res.results
                    } else {
                        state.tyresCardsArr.results = [...state.tyresCardsArr.results, ...results]
                    }
                },
                rejected: () => {
                    console.log('error')
                },
            },
        ),
    }),
    selectors: {
        tiresAPISelector: state => state.tiresAPI.response_data,
        selectSelector: state => state.selects,
        seasonsSelectSelector: state => state.season,
        checkboxesSelectSelector: state => state.checkboxes,
        filteredTyresSelector: state => state.tyresCardsArr,
        priceStartSelector: state => state.priceStart,
        priceEndSelector: state => state.priceEnd,
        priceMinSelector: state => state.priceMin,
        priceMaxSelector: state => state.priceMax,
        sortTyresTypeSelector: state => state.sortType,
    },
})


// actions
export const { seasonsSelectOne, selectsSelect, checkboxesSelect,
    seasonsSelectMany, getTyresParametrs, sortTyresTypeSelect,
    getTyresCards, resetFilters, setPrice, amountHandler,
} =
    filterBlock1Slice.actions


// selectors
export const { selectSelector, seasonsSelectSelector, priceEndSelector,
    checkboxesSelectSelector, tiresAPISelector, sortTyresTypeSelector,
    filteredTyresSelector, priceStartSelector, priceMinSelector,
    priceMaxSelector,
} =
    filterBlock1Slice.selectors
