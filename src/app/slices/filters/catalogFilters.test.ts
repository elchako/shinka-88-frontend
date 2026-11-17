import { beforeEach, describe, expect, it, vi } from 'vitest'
import { filtersApi } from '../../../api/catalog'
import { makeStore } from '../../store'
import * as tires from './tiresFiltersSlice'
import * as disks from './disksFiltersSlice'
import { filterButtons } from '../../../consts'
import type { resultsTyresType, tyresCards } from '../../../types/tires'
import type { disksCards, resultsDisksType } from '../../../types/disks'

vi.mock('../../../api/catalog', () => ({ filtersApi: {
  getTyres: vi.fn(), getDisks: vi.fn(), getFilteredTyres: vi.fn(), getFilteredDisks: vi.fn(),
} }))

const tyre = (id = 1, balance = 2) => ({ id, balance, amount: 1 } as resultsTyresType)
const disk = (id = 1, balance = 2) => ({ id, balance, amount: 1 } as resultsDisksType)
const tyrePage = (results = [tyre()], next: string | null = null): tyresCards => ({ count: results.length, next, previous: null, results })
const diskPage = (results = [disk()], next: string | null = null): disksCards => ({ count: results.length, next, previous: null, results })
const parameters = () => ({ ...tires.initialState.tiresAPI, min_price: 50, max_price: 1000,
  response_data: { ...tires.initialState.tiresAPI.response_data, runflat: ['RFT'], powerload: ['XL'] },
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue(tyrePage())
  vi.mocked(filtersApi.getFilteredDisks).mockResolvedValue(diskPage())
  vi.mocked(filtersApi.getTyres).mockResolvedValue(parameters())
})

describe('Справочники и цена', () => {
  it('не удаляет последний вариант, если null отсутствует, и не меняет ответ API', async () => {
    const response = parameters()
    vi.mocked(filtersApi.getTyres).mockResolvedValue(response)
    const store = makeStore()
    await store.dispatch(tires.getTyresParametrs())
    expect(store.getState().tiresFilters.checkboxes[0].value).toEqual(['RFT'])
    expect(store.getState().tiresFilters.checkboxes[1].value).toEqual(['XL'])
    expect(response.response_data.runflat).toEqual(['RFT'])
    expect(response.response_data.powerload).toEqual(['XL'])
    expect(store.getState().tiresFilters.filtersStatus).toBe('succeeded')
  })

  it('исключает null, сохраняя все реальные варианты', async () => {
    const response = parameters()
    const runflat = ['RFT', null, 'RunFlat']
    vi.mocked(filtersApi.getTyres).mockResolvedValue({ ...response,
      response_data: { ...response.response_data, runflat, powerload: [null, 'XL'] },
    })
    const store = makeStore()
    await store.dispatch(tires.getTyresParametrs())
    expect(store.getState().tiresFilters.checkboxes[0].value).toEqual(['RFT', 'RunFlat'])
    expect(runflat).toEqual(['RFT', null, 'RunFlat'])
  })

  it('не отправляет второй запрос параметров, пока первый выполняется', async () => {
    let resolve!: (value: ReturnType<typeof parameters>) => void
    vi.mocked(filtersApi.getTyres).mockReturnValue(new Promise(done => { resolve = done }))
    const store = makeStore()
    const first = store.dispatch(tires.getTyresParametrs())
    await store.dispatch(tires.getTyresParametrs())
    expect(filtersApi.getTyres).toHaveBeenCalledTimes(1)
    resolve(parameters())
    await first
  })

  it('принимает числовую цену шин с копейками, отклоняет NaN/Infinity и отрицательное значение', () => {
    const store = makeStore()
    store.dispatch(tires.setPrice({ number: 125.5, isStartOrEnd: true }))
    store.dispatch(tires.setPrice({ number: '250.75', isStartOrEnd: false }))
    store.dispatch(tires.setPrice({ number: 'ошибка', isStartOrEnd: true }))
    store.dispatch(tires.setPrice({ number: Infinity, isStartOrEnd: false }))
    expect(store.getState().tiresFilters.priceStart).toBe(125.5)
    expect(store.getState().tiresFilters.priceEnd).toBe(250.75)
    store.dispatch(tires.setPrice({ number: -1, isStartOrEnd: true }))
    expect(store.getState().tiresFilters.priceStart).toBe(0)
  })

  it('ограничивает цену реальным максимумом и сбрасывает её', async () => {
    const store = makeStore()
    await store.dispatch(tires.getTyresParametrs())
    store.dispatch(tires.setPrice({ number: 1001, isStartOrEnd: false }))
    expect(store.getState().tiresFilters.priceEnd).toBe(1000)
    store.dispatch(tires.resetFilters())
    expect(store.getState().tiresFilters.priceEnd).toBe(0)
    store.dispatch(disks.setPrice({ number: 99.5, isStartOrEnd: true }))
    store.dispatch(disks.setPrice({ number: NaN, isStartOrEnd: true }))
    expect(store.getState().disksFilters.priceStart).toBe(99.5)
  })
})

describe('Настоящий контракт payload и количества', () => {
  it('сохраняет подключённые шинные поля и сортировку', async () => {
    const store = makeStore()
    await store.dispatch(tires.getTyresParametrs())
    for (const [selectName, value] of [['width', '205'], ['height', '55'], ['diameter', '16']]) {
      store.dispatch(tires.selectsSelect({ selectName, value, isOneChoice: true }))
    }
    store.dispatch(tires.seasonsSelectMany(filterButtons[1]))
    store.dispatch(tires.checkboxesSelect('RunFlat'))
    store.dispatch(tires.checkboxesSelect('Усиленные'))
    store.dispatch(tires.setPrice({ number: 100, isStartOrEnd: true }))
    store.dispatch(tires.setPrice({ number: 200, isStartOrEnd: false }))
    store.dispatch(tires.sortTyresTypeSelect('Дороже'))
    await store.dispatch(tires.getTyresCards(true))
    expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({
      width: ['205'], height: ['55'], diameter: ['16'], seazon: ['Зимняя'], thorning: ['Ш.'],
      runflat: ['RFT'], powerload: ['XL'], price: [100, 200],
    }, '-price_sale', null)
  })

  it('пустой вариант select действительно снимает фильтр', async () => {
    const store = makeStore()
    store.dispatch(tires.selectsSelect({ selectName: 'width', value: '205', isOneChoice: true }))
    store.dispatch(tires.selectsSelect({ selectName: 'width', value: '', isOneChoice: true }))
    await store.dispatch(tires.getTyresCards(true))
    expect(store.getState().tiresFilters.selects[0].value).toEqual([])
    expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({}, 'complete_set', null)
  })

  it('сохраняет три дисковых поля, не добавляя шинные', async () => {
    const store = makeStore()
    for (const [selectName, value] of [['diameter', '16'], ['pcd', '114.3'], ['type_disk', 'Литой']]) {
      store.dispatch(disks.selectsSelect({ selectName, value, isOneChoice: true }))
    }
    await store.dispatch(disks.getDisksCards(true))
    expect(filtersApi.getFilteredDisks).toHaveBeenLastCalledWith({
      diameter: ['16'], pcd: ['114.3'], type_disk: ['Литой'],
    }, 'complete_set', null)
    store.dispatch(disks.resetFilters())
    expect(store.getState().disksFilters.selects.every(item => item.value.length === 0)).toBe(true)
  })

  it('количество шин остаётся между 1 и остатком; отсутствующий товар имеет 0', async () => {
    vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue(tyrePage([tyre(), tyre(2, 0)]))
    const store = makeStore()
    await store.dispatch(tires.getTyresCards(true))
    store.dispatch(tires.amountHandler({ id: 1, isPlus: false }))
    expect(store.getState().tiresFilters.tyresCardsArr.results[0].amount).toBe(1)
    store.dispatch(tires.amountHandler({ id: 1, isPlus: true }))
    store.dispatch(tires.amountHandler({ id: 1, isPlus: true }))
    store.dispatch(tires.amountHandler({ id: 2, isPlus: true }))
    expect(store.getState().tiresFilters.tyresCardsArr.results.map(item => item.amount)).toEqual([2, 0])
  })

  it('количество дисков остаётся между 1 и остатком', async () => {
    const store = makeStore()
    await store.dispatch(disks.getDisksCards(true))
    store.dispatch(disks.amountHandler({ id: 1, isPlus: false }))
    expect(store.getState().disksFilters.disksCardsArr.results[0].amount).toBe(1)
    store.dispatch(disks.amountHandler({ id: 1, isPlus: true }))
    store.dispatch(disks.amountHandler({ id: 1, isPlus: true }))
    expect(store.getState().disksFilters.disksCardsArr.results[0].amount).toBe(2)
  })
})

describe('Загрузка, ошибки и пагинация', () => {
  it('показывает rejected и позволяет повторить существующий thunk', async () => {
    vi.mocked(filtersApi.getFilteredTyres).mockRejectedValueOnce(new Error('stub'))
    const store = makeStore()
    await store.dispatch(tires.getTyresCards(true))
    expect(store.getState().tiresFilters.cardsStatus).toBe('failed')
    expect(store.getState().tiresFilters.cardsError).toBeTruthy()
    await store.dispatch(tires.getTyresCards(true))
    expect(store.getState().tiresFilters.cardsStatus).toBe('succeeded')
    expect(store.getState().tiresFilters.cardsError).toBeNull()
  })

  it('игнорирует устаревший ответ после нового запроса фильтров', async () => {
    let resolveOld!: (value: tyresCards) => void
    vi.mocked(filtersApi.getFilteredTyres).mockReturnValueOnce(new Promise(done => { resolveOld = done }))
    const store = makeStore()
    const oldRequest = store.dispatch(tires.getTyresCards(true))
    vi.mocked(filtersApi.getFilteredTyres).mockResolvedValueOnce(tyrePage([tyre(2)]))
    await store.dispatch(tires.getTyresCards(true))
    resolveOld(tyrePage([tyre(1)]))
    await oldRequest
    expect(store.getState().tiresFilters.tyresCardsArr.results.map(item => item.id)).toEqual([2])
  })

  it('передаёт query next и добавляет страницу без повторов, не меняя выбранное количество', async () => {
    vi.mocked(filtersApi.getFilteredDisks)
      .mockResolvedValueOnce(diskPage([disk(1)], 'https://catalog.invalid/disk/?page=2'))
      .mockResolvedValueOnce(diskPage([disk(1), disk(2)]))
    const store = makeStore()
    await store.dispatch(disks.getDisksCards(true))
    store.dispatch(disks.amountHandler({ id: 1, isPlus: true }))
    await store.dispatch(disks.getDisksCards(false))
    expect(filtersApi.getFilteredDisks).toHaveBeenLastCalledWith({}, 'complete_set', 'page=2')
    expect(store.getState().disksFilters.disksCardsArr.results.map(item => [item.id, item.amount])).toEqual([[1, 2], [2, 1]])
  })

  it('не дублирует параллельную догрузку; ошибку страницы можно повторить', async () => {
    vi.mocked(filtersApi.getFilteredTyres).mockResolvedValueOnce(tyrePage([tyre()], 'https://catalog.invalid/tyre/?page=2'))
    const store = makeStore()
    await store.dispatch(tires.getTyresCards(true))
    let reject!: (reason: Error) => void
    vi.mocked(filtersApi.getFilteredTyres).mockReturnValueOnce(new Promise((_, fail) => { reject = fail }))
    const request = store.dispatch(tires.getTyresCards(false))
    await store.dispatch(tires.getTyresCards(false))
    expect(filtersApi.getFilteredTyres).toHaveBeenCalledTimes(2)
    reject(new Error('stub'))
    await request
    expect(store.getState().tiresFilters.cardsRefresh).toBe(false)
    expect(store.getState().tiresFilters.tyresCardsArr.results).toHaveLength(1)
    vi.mocked(filtersApi.getFilteredTyres).mockResolvedValueOnce(tyrePage([tyre(2)]))
    await store.dispatch(tires.getTyresCards(false))
    expect(store.getState().tiresFilters.tyresCardsArr.results).toHaveLength(2)
  })
})
