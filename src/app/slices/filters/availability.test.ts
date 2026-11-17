import { beforeEach, describe, expect, it, vi } from 'vitest'
import { filtersApi } from '../../../api/catalog'
import { makeStore } from '../../store'
import * as tyres from './tiresFiltersSlice'
import * as disks from './disksFiltersSlice'

vi.mock('../../../api/catalog', () => ({ filtersApi: {
  getTyres: vi.fn(), getDisks: vi.fn(), getFilteredTyres: vi.fn(), getFilteredDisks: vi.fn(),
} }))

beforeEach(() => {
  vi.clearAllMocks()
  const page = { count: 0, next: null, previous: null, results: [] }
  vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue(page)
  vi.mocked(filtersApi.getFilteredDisks).mockResolvedValue(page)
})

describe('комплекты в обоих каталогах', () => {
  it('по умолчанию запрашивает серверную сортировку комплектов', async () => {
    const store = makeStore()
    await store.dispatch(tyres.getTyresCards(true))
    await store.dispatch(disks.getDisksCards(true))
    expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({}, 'complete_set', null)
    expect(filtersApi.getFilteredDisks).toHaveBeenLastCalledWith({}, 'complete_set', null)
  })

  it('передаёт минимальный остаток, сохраняет честную сортировку цены и сбрасывает фильтр', async () => {
    const store = makeStore()
    store.dispatch(tyres.setOnlyCompleteSets(true))
    store.dispatch(tyres.sortTyresTypeSelect('Дешевле'))
    store.dispatch(disks.setOnlyCompleteSets(true))
    store.dispatch(disks.sortDisksTypeSelect('Дороже'))
    await store.dispatch(tyres.getTyresCards(true))
    await store.dispatch(disks.getDisksCards(true))
    expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ min_balance: 4 }, 'price_sale', null)
    expect(filtersApi.getFilteredDisks).toHaveBeenLastCalledWith({ min_balance: 4 }, '-price_sale', null)
    store.dispatch(tyres.resetFilters())
    store.dispatch(disks.resetFilters())
    expect(store.getState().tiresFilters.onlyCompleteSets).toBe(false)
    expect(store.getState().disksFilters.onlyCompleteSets).toBe(false)
  })

  it('не смешивает фильтр шин и дисков', () => {
    const store = makeStore()
    store.dispatch(tyres.setOnlyCompleteSets(true))
    expect(store.getState().disksFilters.onlyCompleteSets).toBe(false)
  })
})
