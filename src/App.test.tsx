import { screen, waitFor } from '@testing-library/react'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { App } from './App'
import { renderWithProviders } from './utils/test-utils'
import { filtersApi } from './api/catalog'
import { STORE_MAP_URL, STORE_MAP_WIDGET } from './components/pages/main/blocks/contacts/Contacts'

vi.mock('./api/catalog', () => ({ filtersApi: { getTyres: vi.fn(), getDisks: vi.fn(), getFilteredTyres: vi.fn(), getFilteredDisks: vi.fn() } }))

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  localStorage.clear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.mocked(filtersApi.getTyres).mockResolvedValue({ min_price: 2500, max_price: 20000, response_data: { width: ['205'], height: ['55'], diameter: ['16'], goodland: [], load: [], marka: [], model: [], powerload: [null], runflat: [null], seazon: ['Летняя', 'Зимняя'], speed: [], territory_rn: [], thorning: ['Ш.', '_'], thorntype: [] } })
  vi.mocked(filtersApi.getDisks).mockResolvedValue({ min_price: 3000, max_price: 30000, response_data: { type_disk: ['Литой'], goodland: [], marka: [], model: [], diameter: ['16'], width: [], holesquant: [], pcd: ['5×112'], wheeloffset: [], dia: [], color: [], processway: [], territory_rn: [], provider: [] } })
  vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue({ count: 0, next: null, previous: null, results: [] })
  vi.mocked(filtersApi.getFilteredDisks).mockResolvedValue({ count: 0, next: null, previous: null, results: [] })
})
afterEach(() => { vi.restoreAllMocks() })

test('главная сохраняет карту, Яндекс-маршрут и настоящие tel-ссылки', async () => {
  const { container } = renderWithProviders(<App />)
  await screen.findByRole('option', { name: '205' })
  expect(screen.getByRole('heading', { name: 'Подбор шин по параметрам' })).toBeInTheDocument()
  expect(screen.getByTitle('Шинка88 на Яндекс Картах')).toHaveAttribute('src', STORE_MAP_WIDGET)
  expect(screen.getByRole('link', { name: 'Построить маршрут' })).toHaveAttribute('href', STORE_MAP_URL)
  const phones = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'))
  expect(phones.length).toBeGreaterThanOrEqual(2)
  expect(phones.every(phone => phone.getAttribute('href') === 'tel:+79197728888')).toBe(true)
  expect(screen.queryByRole('textbox', { name: 'Поиск товаров' })).not.toBeInTheDocument()
})

test('главные вкладки имеют одну активную форму с подключёнными параметрами', async () => {
  const { user } = renderWithProviders(<App />)
  await screen.findByRole('option', { name: '205' })
  await user.click(screen.getByRole('tab', { name: 'Диски' }))
  await screen.findByRole('option', { name: '5×112' })
  expect(screen.getByRole('heading', { name: 'Подбор дисков по параметрам' })).toBeInTheDocument()
  expect(screen.getByLabelText('Крепление, PCD')).toBeInTheDocument()
  expect(screen.queryByLabelText('Ширина, мм')).not.toBeInTheDocument()
  expect(screen.queryByRole('tab', { name: 'Масла' })).not.toBeInTheDocument()
})

test('кнопка подбора открывает настоящий каталог, API в тесте замокан', async () => {
  const { user } = renderWithProviders(<App />)
  await screen.findByRole('option', { name: '205' })
  await user.click(screen.getByRole('button', { name: 'Подобрать шины' }))
  await screen.findByRole('heading', { name: 'Каталог шин' })
  await waitFor(() => expect(filtersApi.getFilteredTyres).toHaveBeenCalled())
  expect(await screen.findByRole('heading', { name: 'Товары не найдены' })).toBeInTheDocument()
})

test('выбор Все сбрасывает только сезон, без составного фиктивного значения', async () => {
  const { user, store } = renderWithProviders(<App />)
  await screen.findByRole('option', { name: '205' })
  await user.click(screen.getByRole('button', { name: 'Зима, шипы' }))
  expect(store.getState().tiresFilters.season).toHaveLength(1)
  await user.click(screen.getByRole('button', { name: 'Все' }))
  expect(store.getState().tiresFilters.season).toEqual([])
})

test('автозапчасти не показывают фиктивные товары или работающий VIN-поиск', () => {
  window.history.replaceState(null, '', '/autoParts')
  renderWithProviders(<App />)
  expect(screen.getByRole('heading', { name: 'Автозапчасти', level: 1 })).toBeInTheDocument()
  expect(screen.getByText(/Онлайн-поиск в этом разделе пока недоступен/)).toBeInTheDocument()
  expect(screen.queryByPlaceholderText(/VIN/)).not.toBeInTheDocument()
})
