import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { beforeEach, expect, test, vi } from 'vitest'
import { App } from './App'
import { Catalogs } from './components/catalogs/Catalogs'
import { filtersApi } from './api/catalog'
import { makeStore } from './app/store'
import { renderWithProviders } from './utils/test-utils'
import * as tyres from './app/slices/filters/tiresFiltersSlice'
import * as disks from './app/slices/filters/disksFiltersSlice'

vi.mock('./api/catalog', () => ({ filtersApi: { getTyres: vi.fn(), getDisks: vi.fn(), getFilteredTyres: vi.fn(), getFilteredDisks: vi.fn() } }))
const tyreMetadata = () => ({ ...tyres.initialState.tiresAPI, response_data: { ...tyres.initialState.tiresAPI.response_data, diameter: ['17'], seazon: ['Зимняя'], thorning: ['Ш.'] } })
const diskMetadata = () => ({ ...disks.filterBlock2Slice.getInitialState().disksAPI, response_data: { ...disks.filterBlock2Slice.getInitialState().disksAPI.response_data, diameter: ['17'] } })
const empty = { count: 0, next: null, previous: null, results: [] }
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  window.history.replaceState(null, '', '/')
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.mocked(filtersApi.getTyres).mockResolvedValue(tyreMetadata())
  vi.mocked(filtersApi.getDisks).mockResolvedValue(diskMetadata())
  vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue(empty)
  vi.mocked(filtersApi.getFilteredDisks).mockResolvedValue(empty)
})

test.each(['tyres', 'disks'])('поиск с главной не наследует невидимую цену/комплектность: %s', async kind => {
  const store = makeStore()
  const actions = kind === 'tyres' ? tyres : disks
  store.dispatch(actions.setPrice({ number: 4500, isStartOrEnd: false }))
  store.dispatch(actions.setOnlyCompleteSets(true))
  renderWithProviders(<App />, { store })
  if (kind === 'disks') fireEvent.click(screen.getByRole('tab', { name: 'Диски' }))
  await screen.findByRole('option', { name: kind === 'tyres' ? 'R17' : '17' })
  fireEvent.click(screen.getByRole('button', { name: kind === 'tyres' ? 'Подобрать шины' : 'Подобрать диски' }))
  const api = kind === 'tyres' ? filtersApi.getFilteredTyres : filtersApi.getFilteredDisks
  await waitFor(() => expect(api).toHaveBeenLastCalledWith({}, 'complete_set', null))
})

test.each(['tyres', 'disks'])('исчезнувший из справочника диаметр остаётся явно виден: %s', async kind => {
  const store = makeStore()
  store.dispatch((kind === 'tyres' ? tyres : disks).selectsSelect({ selectName: 'diameter', value: '16', isOneChoice: true }))
  renderWithProviders(<App />, { store })
  if (kind === 'disks') fireEvent.click(screen.getByRole('tab', { name: 'Диски' }))
  await screen.findByRole('option', { name: kind === 'tyres' ? 'R17' : '17' })
  expect(screen.getByLabelText('Диаметр')).toHaveValue('16')
  expect(screen.getByRole('option', { name: kind === 'tyres' ? 'R16' : '16' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: kind === 'tyres' ? 'Подобрать шины' : 'Подобрать диски' }))
  const api = kind === 'tyres' ? filtersApi.getFilteredTyres : filtersApi.getFilteredDisks
  await waitFor(() => expect(api).toHaveBeenLastCalledWith({ diameter: ['16'] }, 'complete_set', null))
})

test('сезон ждёт фактические строки API, а обновление справочника меняет payload', async () => {
  let resolve!: (value: ReturnType<typeof tyreMetadata>) => void
  vi.mocked(filtersApi.getTyres).mockReturnValueOnce(new Promise(done => { resolve = done }))
  const store = makeStore()
  store.dispatch(tyres.setSeason('winter'))
  renderWithProviders(<MemoryRouter initialEntries={['/tires']}><HelmetProvider><Catalogs /></HelmetProvider></MemoryRouter>, { store })
  expect(filtersApi.getFilteredTyres).not.toHaveBeenCalled()
  await act(async () => { resolve({ ...tyreMetadata(), response_data: { ...tyreMetadata().response_data, seazon: ['Зимние'] } }) })
  await waitFor(() => expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ seazon: ['Зимние'] }, 'complete_set', null))
  expect(filtersApi.getFilteredTyres).toHaveBeenCalledTimes(1)
  await act(async () => { await store.dispatch(tyres.getTyresParametrs()) })
  await waitFor(() => expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ seazon: ['Зимняя'] }, 'complete_set', null))
})

test('ошибка нужного справочника не выдаёт ложную пустую выдачу и допускает повтор', async () => {
  vi.mocked(filtersApi.getTyres).mockRejectedValueOnce(new Error('fixture'))
  const store = makeStore()
  store.dispatch(tyres.setSeason('winter'))
  renderWithProviders(<MemoryRouter initialEntries={['/tires']}><HelmetProvider><Catalogs /></HelmetProvider></MemoryRouter>, { store })
  expect(await screen.findByRole('heading', { name: 'Не удалось загрузить параметры поиска' })).toBeInTheDocument()
  expect(screen.queryByText('Товары не найдены')).not.toBeInTheDocument()
  expect(filtersApi.getFilteredTyres).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Загрузить параметры поиска' }))
  await waitFor(() => expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ seazon: ['Зимняя'] }, 'complete_set', null))
})
