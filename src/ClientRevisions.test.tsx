import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { App } from './App'
import { filtersApi } from './api/catalog'
import { renderWithProviders } from './utils/test-utils'
import { makeStore } from './app/store'
import * as tyres from './app/slices/filters/tiresFiltersSlice'
import * as disks from './app/slices/filters/disksFiltersSlice'
import { classifyStudding, filterOptions, studdingValues } from './utils/catalogFilters'

vi.mock('./api/catalog', () => ({ filtersApi: { getTyres: vi.fn(), getDisks: vi.fn(), getFilteredTyres: vi.fn(), getFilteredDisks: vi.fn() } }))
const empty = { count: 0, next: null, previous: null, results: [] }
beforeEach(() => {
  vi.clearAllMocks()
  window.history.replaceState(null, '', '/')
  localStorage.clear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.mocked(filtersApi.getTyres).mockResolvedValue({ ...tyres.initialState.tiresAPI, min_price: 100, max_price: 20000,
    response_data: { ...tyres.initialState.tiresAPI.response_data, diameter: ['16'], width: ['205'], height: ['55'], marka: ['Michelin'], goodland: ['Россия'], seazon: ['Летняя', 'Зимняя', 'Всесезонная'], thorning: ['Ш.', '_', 'н/ш.'], runflat: [null, 'нет', 'RFT'], powerload: ['0', 'XL'] },
  })
  const initial = disks.filterBlock2Slice.getInitialState().disksAPI
  vi.mocked(filtersApi.getDisks).mockResolvedValue({ ...initial,
    response_data: { ...initial.response_data, width: ['6.5'], diameter: ['16'], holesquant: ['5'], pcd: ['112'], wheeloffset: ['45'], dia: ['57.1'], type_disk: ['Литой', 'Штампованный'] },
  })
  vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue(empty)
  vi.mocked(filtersApi.getFilteredDisks).mockResolvedValue(empty)
})

test('на главной четыре поля шин в запрошенном порядке, производитель не страна', async () => {
  const { container } = renderWithProviders(<App />)
  await screen.findByRole('option', { name: 'Michelin' })
  const labels = [...container.querySelectorAll('#home-filter-panel label[for]')].map(label => label.textContent)
  expect(labels).toEqual(['Диаметр', 'Ширина, мм', 'Высота профиля, %', 'Производитель'])
  expect(screen.queryByRole('option', { name: 'Россия' })).not.toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Производитель'), { target: { value: 'Michelin' } })
  fireEvent.click(screen.getByRole('button', { name: 'Подобрать шины' }))
  await waitFor(() => expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ marka: ['Michelin'] }, 'complete_set', null))
})

test('сезон и шипы независимы, без шипов включает оба фактических обозначения', async () => {
  const store = makeStore()
  await store.dispatch(tyres.getTyresParametrs())
  store.dispatch(tyres.setSeason('winter'))
  store.dispatch(tyres.setStudding('unstudded'))
  await store.dispatch(tyres.getTyresCards(true))
  expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ seazon: ['Зимняя'], thorning: ['_', 'н/ш.'] }, 'complete_set', null)
  store.dispatch(tyres.setSeason('all'))
  await store.dispatch(tyres.getTyresCards(true))
  expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ thorning: ['_', 'н/ш.'] }, 'complete_set', null)
  store.dispatch(tyres.setStudding('all'))
  await store.dispatch(tyres.getTyresCards(true))
  expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({}, 'complete_set', null)
})

test('отрицательные признаки не попадают в RunFlat и усиленные', async () => {
  const store = makeStore()
  await store.dispatch(tyres.getTyresParametrs())
  store.dispatch(tyres.checkboxesSelect('RunFlat'))
  store.dispatch(tyres.checkboxesSelect('Усиленные'))
  await store.dispatch(tyres.getTyresCards(true))
  expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ runflat: ['RFT'], powerload: ['XL'] }, 'complete_set', null)
})

test('диски: все шесть параметров и тип реально передаются совместно', async () => {
  const { container } = renderWithProviders(<App />)
  fireEvent.click(screen.getByRole('tab', { name: 'Диски' }))
  await screen.findByRole('option', { name: '57.1' })
  const panel = screen.getByRole('tabpanel')
  const fields = [...container.querySelectorAll<HTMLSelectElement>('#home-filter-panel select')]
  expect(fields.map(field => field.labels?.[0].textContent)).toEqual(['Ширина, дюймы', 'Диаметр', 'Количество отверстий', 'Расстояние (PCD), мм', 'Вылет (ET), мм', 'Ступица, мм'])
  ;['6.5', '16', '5', '112', '45', '57.1'].forEach((value, index) => fireEvent.change(fields[index], { target: { value } }))
  fireEvent.click(within(panel).getByRole('button', { name: 'Штампованные' }))
  fireEvent.click(screen.getByRole('button', { name: 'Подобрать диски' }))
  await waitFor(() => expect(filtersApi.getFilteredDisks).toHaveBeenLastCalledWith({ width: ['6.5'], diameter: ['16'], holesquant: ['5'], pcd: ['112'], wheeloffset: ['45'], dia: ['57.1'], type_disk: ['Штампованный'] }, 'complete_set', null))
})

test('переключение категории не стирает выбранные параметры шин', async () => {
  renderWithProviders(<App />)
  await screen.findByRole('option', { name: '205' })
  fireEvent.change(screen.getByLabelText('Ширина, мм'), { target: { value: '205' } })
  fireEvent.click(screen.getByRole('tab', { name: 'Диски' }))
  fireEvent.click(screen.getByRole('tab', { name: 'Шины' }))
  expect(screen.getByLabelText('Ширина, мм')).toHaveValue('205')
})

test.each(['Масла', 'Аккумуляторы', 'Автозапчасти'])('вкладка %s не притворяется подключённым каталогом', title => {
  renderWithProviders(<App />)
  fireEvent.click(screen.getByRole('tab', { name: title }))
  expect(within(screen.getByRole('tabpanel')).getByText(/Онлайн-поиск в этом разделе пока недоступен/)).toBeInTheDocument()
  expect(within(screen.getByRole('tabpanel')).getByRole('link', { name: '+7 (919) 772 88 88' })).toHaveAttribute('href', 'tel:+79197728888')
  expect(within(screen.getByRole('tabpanel')).queryByRole('textbox')).not.toBeInTheDocument()
})

test('контактная подпись, помощь с товаром и услуги доступны с главной', () => {
  renderWithProviders(<App />)
  expect(screen.getByText('«Шинка», МО, г. Егорьевск, ул. Рязанская')).toBeInTheDocument()
  expect(screen.getByRole('complementary', { name: 'Помощь с поиском товара' })).toHaveTextContent('Не нашли нужный товар?')
  expect(within(screen.getByRole('navigation', { name: 'Основная навигация' })).getByRole('link', { name: 'Услуги и цены' })).toHaveAttribute('href', '/services')
})

test('значения фильтров не мутируют и не приписывают шипы неизвестному обозначению', () => {
  const values = ['н/ш.', '_', null, 'Ш.', '']
  expect(filterOptions(values)).toEqual(['_', 'н/ш.', 'Ш.'])
  expect(values).toEqual(['н/ш.', '_', null, 'Ш.', ''])
  expect(classifyStudding('неизвестно')).toBeNull()
  expect(studdingValues(values, 'unstudded')).toEqual(['_', 'н/ш.'])
})
