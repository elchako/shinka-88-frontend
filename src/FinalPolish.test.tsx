import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { App } from './App'
import { renderWithProviders } from './utils/test-utils'
import { filtersApi } from './api/catalog'
import { servicesApi } from './api/services'
import { filterBlock1Slice } from './app/slices/filters/tiresFiltersSlice'
import { filterBlock2Slice } from './app/slices/filters/disksFiltersSlice'
import { SEO_PAGES, NOT_FOUND } from './seo/pages'
import { renderPage } from './entry-prerender'

vi.mock('./api/catalog', () => ({ filtersApi: { getTyres: vi.fn(), getDisks: vi.fn(), getFilteredTyres: vi.fn(), getFilteredDisks: vi.fn() } }))
vi.mock('./api/services', () => ({ servicesApi: { get: vi.fn() } }))

beforeEach(() => {
  vi.clearAllMocks()
  window.history.replaceState(null, '', '/')
  localStorage.clear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.mocked(filtersApi.getTyres).mockResolvedValue(filterBlock1Slice.getInitialState().tiresAPI)
  vi.mocked(filtersApi.getDisks).mockResolvedValue(filterBlock2Slice.getInitialState().disksAPI)
  vi.mocked(servicesApi.get).mockResolvedValue({ groups: [] })
})

test('прайс первым в desktop-меню и вторым в постоянной мобильной навигации', () => {
  renderWithProviders(<App />)
  const desktop = screen.getByRole('navigation', { name: 'Основная навигация' })
  expect(within(desktop).getAllByRole('link')[0]).toHaveAttribute('href', '/services')
  const mobile = screen.getByRole('navigation', { name: 'Мобильная навигация' })
  expect([...mobile.children].map(node => node.textContent)).toEqual(['Главная', 'Цены', 'Каталог', 'Корзина', 'Меню'])
  expect(within(mobile).getByRole('link', { name: 'Цены' })).toHaveAttribute('href', '/services')
})

test('услуги сразу после главной в раскрытом меню, переход закрывает диалог', async () => {
  renderWithProviders(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Меню' }))
  const menu = screen.getByRole('navigation', { name: 'Разделы магазина' })
  const links = within(menu).getAllByRole('link')
  expect(links.slice(0, 5).map(node => node.textContent)).toEqual(['Главная', 'Услуги и цены', 'Шины', 'Диски', 'Корзина'])
  fireEvent.click(within(menu).getByRole('link', { name: 'Услуги и цены' }))
  expect(await screen.findByRole('heading', { level: 1, name: 'Услуги и цены' })).toBeInTheDocument()
  expect(screen.queryByRole('dialog', { name: 'Меню магазина' })).not.toBeInTheDocument()
})

test('прямой мобильный пункт открывает прайс без меню и показывает активное состояние', async () => {
  renderWithProviders(<App />)
  const mobile = screen.getByRole('navigation', { name: 'Мобильная навигация' })
  fireEvent.click(within(mobile).getByRole('link', { name: 'Цены' }))
  expect(await screen.findByRole('heading', { level: 1, name: 'Услуги и цены' })).toBeInTheDocument()
  await waitFor(() => expect(within(mobile).getByRole('link', { name: 'Цены' })).toHaveAttribute('aria-current', 'page'))
})

test.each([...SEO_PAGES, NOT_FOUND])('публичная страница $path без длинного тире в тексте и метаданных', page => {
  const { head, body } = renderPage(page)
  const longDash = String.fromCharCode(0x2014)
  expect(page.title).not.toContain(longDash)
  expect(head).not.toContain(longDash)
  expect(body).not.toContain(longDash)
  expect(page.title).toContain('| Шинка88')
})
