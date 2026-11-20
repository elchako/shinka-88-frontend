import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, test, vi } from 'vitest'
import { servicesApi, type ServiceGroup } from '../../../api/services'
import { Services, servicePrice } from './Services'

vi.mock('../../../api/services', () => ({ servicesApi: { get: vi.fn() } }))
const groups: ServiceGroup[] = [{ id: 1, name: 'Легковые автомобили', description: '', items: [
  { id: 1, name: 'Шиномонтаж, R16', description: '', price: '4000.00', unit: 'за 4 колеса' },
] }, { id: 2, name: 'Дополнительные услуги', description: '', items: [
  { id: 2, name: 'Сезонное хранение шин', description: '', price: null, unit: '' },
] }]
const show = () => render(<MemoryRouter><Services /></MemoryRouter>)
beforeEach(() => { vi.resetAllMocks(); vi.mocked(servicesApi.get).mockResolvedValue({ groups }) })

test('страница показывает прайс API, условие скидки и не выдумывает цену хранения', async () => {
  show()
  expect(await screen.findByRole('table', { name: 'Легковые автомобили' })).toHaveTextContent('4 000')
  expect(screen.getByRole('table', { name: 'Дополнительные услуги' })).toHaveTextContent('Уточняйте')
  expect(screen.getByRole('heading', { name: 'Скидка 10% постоянным клиентам' })).toBeInTheDocument()
  expect(screen.getByText('На комплексный шиномонтаж с 1 декабря по 1 апреля и с 1 июня по 1 ноября.')).toBeInTheDocument()
  expect(screen.queryByText('0 ₽')).not.toBeInTheDocument()
})

test('ошибка не превращается в фальшивый прайс и допускает повтор', async () => {
  vi.mocked(servicesApi.get).mockRejectedValueOnce(new Error('fixture'))
  show()
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить прайс')
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Повторить загрузку прайса' }))
  expect(await screen.findByRole('table', { name: 'Легковые автомобили' })).toBeInTheDocument()
})

test('пустой прайс предлагает телефон, без цен из зашитой копии', async () => {
  vi.mocked(servicesApi.get).mockResolvedValue({ groups: [] })
  show()
  expect(await screen.findByText('Прайс обновляется. Уточните стоимость по телефону магазина.')).toBeInTheDocument()
  expect(screen.queryByRole('table')).not.toBeInTheDocument()
})

test('новое открытие получает изменённую цену из API, сборка сайта не нужна', async () => {
  const first = show()
  await screen.findByRole('table', { name: 'Легковые автомобили' })
  first.unmount()
  vi.mocked(servicesApi.get).mockResolvedValue({ groups: [{ ...groups[0], items: [{ ...groups[0].items[0], price: '4500.50' }] }] })
  show()
  expect(await screen.findByRole('table', { name: 'Легковые автомобили' })).toHaveTextContent(servicePrice('4500.50').replace(/\s/g, ' '))
})

test('скрытое хранение не рекламируется отдельно от управляемого прайса', async () => {
  vi.mocked(servicesApi.get).mockResolvedValue({ groups: [groups[0]] })
  show()
  await screen.findByRole('table', { name: 'Легковые автомобили' })
  expect(screen.queryByText('Сезонное хранение шин')).not.toBeInTheDocument()
  expect(screen.queryByText(/В магазине есть услуга сезонного хранения/)).not.toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Уточнить услуги и стоимость' })).toBeInTheDocument()
})

test('нулевая цена отличима от неизвестной, некорректная цена не становится NaN', () => {
  expect(servicePrice('0.00')).toContain('0')
  expect(servicePrice(null)).toBe('Уточняйте')
  expect(servicePrice('не число')).toBe('Уточняйте')
  expect(servicePrice('-1')).toBe('Уточняйте')
})
