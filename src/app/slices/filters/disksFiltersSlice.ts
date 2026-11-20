import { type PayloadAction } from "@reduxjs/toolkit"
import { catalogOrderBy, selectsNames2, sorts } from "../../../consts"
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
    const initValue: Array<string> = []
    return { selectName, value: initValue }
})


const initialState: IinitialState = {
    // данные для фильтров
    disksAPI: {
        max_price: 0,
        min_price: 0,
        response_data: {
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
        }
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
    onlyCompleteSets: false,
    priceStart: 0,
    priceEnd: 0,
    priceMin: 0,
    priceMax: 0,
    filtersStatus: 'idle',
    cardsStatus: 'idle',
    cardsError: null,
    cardsRequestId: null,
    cardsRefresh: true,
}

export const filterBlock2Slice = createAppSlice({
    name: "disksFilters",
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
        setDiskType: create.reducer((state, action: PayloadAction<string[]>) => {
            const item = state.selects.find(select => select.selectName.apiName === 'type_disk')
            if (item) item.value = action.payload
        }),
        setOnlyCompleteSets: create.reducer((state, action: PayloadAction<boolean>) => {
            state.onlyCompleteSets = action.payload
        }),
        // сортировка
        sortDisksTypeSelect: create.reducer((state, action: PayloadAction<string>) => {
            state.sortType = action.payload
        }),
        // плюс/минус количество конкретного товара
        amountHandler: create.reducer((state, action: PayloadAction<{ id: number, isPlus: boolean }>) => {
            for (let i = 0; i < state.disksCardsArr.results.length; i++) {
                if (state.disksCardsArr.results[i].id === action.payload.id) {
                    const item = state.disksCardsArr.results[i]
                    if (item.balance < 1) break
                    item.amount = Math.min(item.balance,
                        Math.max(1, item.amount + (action.payload.isPlus ? 1 : -1)))
                    break
                }
            }
        }),
        // установить цену
        setPrice: create.reducer((state, action: PayloadAction<{ number: number, isStartOrEnd: boolean }>) => {
            if (!Number.isFinite(action.payload.number)) return
            let number = Math.max(0, action.payload.number)
            if (state.priceMax > 0 && number > state.priceMax) number = state.priceMax
            if (action.payload.isStartOrEnd) state.priceStart = number
            else state.priceEnd = number
        }),
        prepareHomeSearch: create.reducer(state => {
            state.priceStart = 0
            state.priceEnd = 0
            state.onlyCompleteSets = false
            state.sortType = sorts[0]
        }),
        // сбросить фильтры
        resetFilters: create.reducer(state => {
            state.selects = selects
            // console.log(selects)
            state.priceStart = 0
            state.priceEnd = 0
            state.onlyCompleteSets = false
        }),

        // Thunks
        // получить данные для фильтров
        getDisksParametrs: create.asyncThunk(
            async (): Promise<disksAPI> => {
                const response = await filtersApi.getDisks()
                // The value we return becomes the `fulfilled` action payload
                return response
            },
            {
                pending: state => {
                    state.filtersStatus = 'loading'
                },
                fulfilled: (state, action: PayloadAction<disksAPI>) => {
                    state.filtersStatus = 'succeeded'
                    state.disksAPI = action.payload
                    state.priceMin = action.payload.min_price
                    state.priceMax = action.payload.max_price
                },
                rejected: state => {
                    state.filtersStatus = 'failed'
                },
                options: {
                    condition: (_, api): boolean => (api.getState() as RootState).disksFilters.filtersStatus !== 'loading',
                },
            },
        ),
        // Получение карточек товаров по установленным фильтрам
        getDisksCards: create.asyncThunk(
            async (refresh: boolean, thunkAPI): Promise<{ response: disksCards, refresh: boolean }> => {
                const store = thunkAPI.getState() as RootState
                const state = store.disksFilters

                const fields: fieldsDiskType = {}

                for (const item of state.selects) {
                    const key = item.selectName.apiName as 'width' | 'diameter' | 'holesquant' | 'pcd' | 'wheeloffset' | 'dia' | 'type_disk'
                    if (item.value.length) fields[key] = item.value
                }

                let url = null
                if (!refresh && state.disksCardsArr.next) {
                    url = state.disksCardsArr.next.split('?')[1]
                }

                if (state.priceStart !== 0 || state.priceEnd !== 0) {
                    fields.price = [state.priceStart !== 0 ? state.priceStart : 0,
                        state.priceEnd !== 0 ? state.priceEnd : 20000]
                }

                if (state.onlyCompleteSets) fields.min_balance = 4
                const orderBy = catalogOrderBy(state.sortType)
                const response: disksCards = await filtersApi.getFilteredDisks(fields, orderBy, url)
                const cart = (thunkAPI.getState() as RootState).cart.disks
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
                    state.disksCardsArr.count = res.count
                    state.disksCardsArr.next = res.next
                    state.disksCardsArr.previous = res.previous
                    if (action.payload.refresh) {
                        state.disksCardsArr.results = res.results
                    } else {
                        const ids = new Set(state.disksCardsArr.results.map(item => item.id))
                        state.disksCardsArr.results.push(...res.results.filter(item => !ids.has(item.id)))
                    }
                },
                rejected: (state, action) => {
                    if (state.cardsRequestId !== action.meta.requestId) return
                    state.cardsStatus = 'failed'
                    state.cardsRequestId = null
                    state.cardsError = 'Не удалось загрузить диски. Попробуйте ещё раз.'
                },
                options: {
                    condition: (refresh, api): boolean => {
                        const state = (api.getState() as RootState).disksFilters
                        return refresh || (state.cardsStatus !== 'loading' && state.disksCardsArr.next !== null)
                    },
                },
            },
        ),
    }),
    selectors: {
        disksAPISelector: state => state.disksAPI.response_data,
        selectSelector: state => state.selects,
        filteredDisksSelector: state => state.disksCardsArr,
        sortDisksTypeSelector: state => state.sortType,
        priceStartSelector: state => state.priceStart,
        priceEndSelector: state => state.priceEnd,
        priceMinSelector: state => state.priceMin,
        priceMaxSelector: state => state.priceMax,
    },
})


// actions
export const { selectsSelect, getDisksParametrs, sortDisksTypeSelect,
    getDisksCards, amountHandler, setPrice, resetFilters, setOnlyCompleteSets, setDiskType, prepareHomeSearch } = filterBlock2Slice.actions


// selectors
export const { selectSelector, disksAPISelector, filteredDisksSelector,
    sortDisksTypeSelector, priceStartSelector, priceEndSelector,
    priceMinSelector, priceMaxSelector
} = filterBlock2Slice.selectors
