import { type PayloadAction, } from "@reduxjs/toolkit"
import { catalogOrderBy, checkboxesNames, selectsNames1, sorts } from "../../../consts"
import { createAppSlice } from "../../createAppSlice"
import { filtersApi } from "../../../api/catalog"
import { type RootState } from "../../store"
import { hasProductFeature } from '../../../utils/other'
import { seasonValues, studdingValues, type TyreSeason, type TyreStudding } from '../../../utils/catalogFilters'
import {
    type tyresCards,
    type tiresAPI,
    type fieldsTyresType,
    type IinitialState
} from "../../../types/tires"

// изначальные значения стейта
const selects = selectsNames1.map(selectName => ({ selectName, value: [] as string[] }))
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
    season: 'all',
    studding: 'all',
    checkboxes: checkboxes,
    priceStart: 0,
    priceEnd: 0,
    priceMin: 0,
    priceMax: 0,
    sortType: sorts[0],
    onlyCompleteSets: false,
    filtersStatus: 'idle',
    cardsStatus: 'idle',
    cardsError: null,
    cardsRequestId: null,
    cardsRefresh: true,
}

export const filterBlock1Slice = createAppSlice({
    name: "tiresFilters",
    initialState,
    reducers: create => ({
        // селекты 
        selectsSelect: create.reducer((state,
            action: PayloadAction<{ selectName: string, value: string, isOneChoice: boolean }>) => {
            const payload = action.payload
            const newSelects = state.selects.map(item => {
                if (item.selectName.apiName === payload.selectName) {
                    // для постоянных селектов где только 1 значение
                    if (typeof item.value === 'string') {
                        item.value = payload.value
                    } else {
                        // для селекта с трансформацией в чекбоксы
                        // где массив значений
                        if (payload.isOneChoice) {
                            // если селект
                            item.value = payload.value ? [payload.value] : []
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
        setSeason: create.reducer((state, action: PayloadAction<TyreSeason>) => {
            state.season = action.payload
        }),
        setStudding: create.reducer((state, action: PayloadAction<TyreStudding>) => {
            state.studding = action.payload
        }),
        // чекбоксы внизу
        checkboxesSelect: create.reducer((state, action: PayloadAction<string>) => {
            const payload = action.payload
            const newCheckboxes = state.checkboxes.map(item => {
                if (item.checkboxName === payload) {
                    item.checked = !item.checked
                }
                return item
            })
            state.checkboxes = newCheckboxes
        }),
        prepareHomeSearch: create.reducer(state => {
            state.priceStart = 0
            state.priceEnd = 0
            state.onlyCompleteSets = false
            state.sortType = sorts[0]
        }),
        // сбросить фильтры
        resetFilters: create.reducer(state => {
            state.season = 'all'
            state.studding = 'all'
            state.selects = selects
            state.checkboxes = state.checkboxes.map(item => {
                item.checked = false
                return item
            })
            state.priceStart = 0
            state.priceEnd = 0
            state.onlyCompleteSets = false
        }),
        // установить цену
        setPrice: create.reducer((state, action: PayloadAction<{ number: number | string, isStartOrEnd: boolean }>) => {
            let number = Number(action.payload.number)
            if (!Number.isFinite(number)) return
            number = Math.max(0, number)
            if (state.priceMax > 0 && number > state.priceMax) number = state.priceMax
            if (action.payload.isStartOrEnd) state.priceStart = number
            else state.priceEnd = number
        }),
        // плюс/минус количество конкретного товара
        amountHandler: create.reducer((state, action: PayloadAction<{ id: number, isPlus: boolean }>) => {
            for (let i = 0; i < state.tyresCardsArr.results.length; i++) {
                if (state.tyresCardsArr.results[i].id === action.payload.id) {
                    const amount = state.tyresCardsArr.results[i].amount
                    const balance = state.tyresCardsArr.results[i].balance

                    if (balance < 1) break
                    state.tyresCardsArr.results[i].amount = Math.min(balance,
                        Math.max(1, amount + (action.payload.isPlus ? 1 : -1)))
                    break
                }
            }
        }),
        setOnlyCompleteSets: create.reducer((state, action: PayloadAction<boolean>) => {
            state.onlyCompleteSets = action.payload
        }),
        // сортировка
        sortTyresTypeSelect: create.reducer((state, action: PayloadAction<string>) => {
            state.sortType = action.payload
        }),

        // Thunks
        // получить данные для фильтров
        getTyresParametrs: create.asyncThunk(
            async (): Promise<tiresAPI> => {
                const response = await filtersApi.getTyres()
                // The value we return becomes the `fulfilled` action payload
                return response
            },
            {
                pending: state => {
                    state.filtersStatus = 'loading'
                },
                fulfilled: (state, action: PayloadAction<tiresAPI>) => {
                    state.filtersStatus = 'succeeded'
                    state.tiresAPI = action.payload
                    state.checkboxes[0].value = action.payload.response_data.runflat.filter(hasProductFeature)
                    state.checkboxes[1].value = action.payload.response_data.powerload.filter(hasProductFeature)
                    state.priceMin = action.payload.min_price
                    state.priceMax = action.payload.max_price
                },
                rejected: state => {
                    state.filtersStatus = 'failed'
                },
                options: {
                    condition: (_, api): boolean => (api.getState() as RootState).tiresFilters.filtersStatus !== 'loading',
                },
            },
        ),
        // Получение карточек товаров по установленным фильтрам
        getTyresCards: create.asyncThunk(
            async (refresh: boolean, thunkAPI): Promise<{ response: tyresCards, refresh: boolean }> => {
                const store = thunkAPI.getState() as RootState
                const state = store.tiresFilters
                const fields: fieldsTyresType = {}

                for (const item of state.selects) {
                    const key = item.selectName.apiName as 'diameter' | 'width' | 'height' | 'marka'
                    if (item.value.length) fields[key] = item.value
                }
                if (state.season !== 'all') fields.seazon = seasonValues(state.tiresAPI.response_data.seazon, state.season)
                if (state.studding !== 'all') fields.thorning = studdingValues(state.tiresAPI.response_data.thorning, state.studding)
                if (state.checkboxes[0].checked) fields.runflat = state.checkboxes[0].value
                if (state.checkboxes[1].checked) fields.powerload = state.checkboxes[1].value

                if (state.priceStart !== 0 || state.priceEnd !== 0) {
                    fields.price = [state.priceStart !== 0 ? state.priceStart : 0,
                        state.priceEnd !== 0 ? state.priceEnd : 10000000]
                }

                let url = null
                if (!refresh && state.tyresCardsArr.next) {
                    url = state.tyresCardsArr.next.split('?')[1]
                }

                if (state.onlyCompleteSets) fields.min_balance = 4
                const orderBy = catalogOrderBy(state.sortType)
                const response: tyresCards = await filtersApi.getFilteredTyres(fields, orderBy, url)
                const cart = (thunkAPI.getState() as RootState).cart.tyres
                const results = response.results.map(item => ({
                    ...item,
                    amount: item.balance < 1 ? 0 : Math.min(item.balance,
                        cart.find(product => product.id === item.id)?.amount || 1),
                }))
                return { response: { ...response, results }, refresh }
            },
            {
                pending: (state, action) => {
                    state.cardsStatus = 'loading'
                    state.cardsError = null
                    state.cardsRequestId = action.meta.requestId
                    state.cardsRefresh = action.meta.arg
                },
                fulfilled: (state, action) => {
                    if (state.cardsRequestId !== action.meta.requestId) return
                    const res = action.payload.response
                    state.cardsStatus = 'succeeded'
                    state.cardsRequestId = null
                    state.tyresCardsArr.count = res.count
                    state.tyresCardsArr.next = res.next
                    state.tyresCardsArr.previous = res.previous
                    if (action.payload.refresh) {
                        state.tyresCardsArr.results = res.results
                    } else {
                        const ids = new Set(state.tyresCardsArr.results.map(item => item.id))
                        state.tyresCardsArr.results.push(...res.results.filter(item => !ids.has(item.id)))
                    }
                },
                rejected: (state, action) => {
                    if (state.cardsRequestId !== action.meta.requestId) return
                    state.cardsStatus = 'failed'
                    state.cardsRequestId = null
                    state.cardsError = 'Не удалось загрузить шины. Попробуйте ещё раз.'
                },
                options: {
                    condition: (refresh, api): boolean => {
                        const state = (api.getState() as RootState).tiresFilters
                        return refresh || (state.cardsStatus !== 'loading' && state.tyresCardsArr.next !== null)
                    },
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
export const { setSeason, setStudding, selectsSelect, checkboxesSelect,
    getTyresParametrs, sortTyresTypeSelect,
    getTyresCards, resetFilters, setPrice, amountHandler, setOnlyCompleteSets, prepareHomeSearch,
} =
    filterBlock1Slice.actions


// selectors
export const { selectSelector, seasonsSelectSelector, priceEndSelector,
    checkboxesSelectSelector, tiresAPISelector, sortTyresTypeSelector,
    filteredTyresSelector, priceStartSelector, priceMinSelector,
    priceMaxSelector,
} =
    filterBlock1Slice.selectors
