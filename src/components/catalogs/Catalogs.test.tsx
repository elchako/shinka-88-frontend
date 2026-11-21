import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { filtersApi } from '../../api/catalog'
import { makeStore } from '../../app/store'
import { filterBlock1Slice } from '../../app/slices/filters/tiresFiltersSlice'
import { filterBlock2Slice } from '../../app/slices/filters/disksFiltersSlice'
import { mobileFiltersReducer } from '../../app/slices/common/smallActions'
import { renderWithProviders } from '../../utils/test-utils'
import type { resultsTyresType, tyresCards } from '../../types/tires'
import type { resultsDisksType } from '../../types/disks'
import { Catalogs } from './Catalogs'
import { MobileFiltersModal } from './blocks/filters/MobileFiltersModal'
import { TyresCardDesktop } from './blocks/card/tyres/TyresCardDesktop'
import { DisksCardDesktop } from './blocks/card/disks/DisksCardDesktop'

vi.mock('../../api/catalog', () => ({ filtersApi: {
  getTyres: vi.fn(), getDisks: vi.fn(), getFilteredTyres: vi.fn(), getFilteredDisks: vi.fn(),
} }))

const tyre: resultsTyresType = {
  id: 1, article: 'test-tyre', name: 'Тестовая шина', name_origin: 'Тестовая шина', product_type: 'tyre',
  price_purchase: 0, price_sale: 1234.5, image_url: 'https://images.invalid/tyre.png', image: '', date_add: '',
  description: null, balance: 2, is_active: true, goodland: '', marka: 'Тест', model: 'Шина', seazon: 'Зимняя',
  diameter: '16', width: '205', height: '55', thorning: 'Ш.', speed: 'H', load: '91', thorntype: '',
  mnfcode: null, runflat: null, powerload: null, territory_rn: '', provider: 1, amount: 1,
}
const disk: resultsDisksType = {
  id: 1, article: 'test-disk', name: 'Тестовый диск', name_origin: 'Тестовый диск', product_type: 'disk',
  price_purchase: 0, price_sale: 3500, image_url: 'https://images.invalid/disk.png', image: '', date_add: '',
  description: null, balance: 2, is_active: true, type_disk: 'Литой', goodland: '', marka: '', model: '',
  diameter: '16', width: '6.5', holesquant: '5', pcd: '114.3', wheeloffset: '45', dia: '67.1', color: '',
  processway: '', mnfcode: null, territory_rn: '', provider: 1, amount: 1,
}
const page = (results = [tyre]): tyresCards => ({ count: results.length, next: null, previous: null, results })
const renderCatalog = (path = '/tires') => renderWithProviders(
  <MemoryRouter initialEntries={[path]}><HelmetProvider><Catalogs /><MobileFiltersModal /></HelmetProvider></MemoryRouter>,
)

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  const tyresState = filterBlock1Slice.getInitialState()
  const disksState = filterBlock2Slice.getInitialState()
  vi.mocked(filtersApi.getTyres).mockResolvedValue({ ...tyresState.tiresAPI, min_price: 100, max_price: 5000,
    response_data: { ...tyresState.tiresAPI.response_data, width: ['195', '205'], height: ['55'], diameter: ['16'], runflat: ['RFT'], powerload: ['XL'] },
  })
  vi.mocked(filtersApi.getDisks).mockResolvedValue({ ...disksState.disksAPI, min_price: 1000, max_price: 5000,
    response_data: { ...disksState.disksAPI.response_data, diameter: ['16'], pcd: ['114.3'], type_disk: ['Литой'] },
  })
  vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue(page())
  vi.mocked(filtersApi.getFilteredDisks).mockResolvedValue({ count: 1, next: null, previous: null, results: [disk] })
})

describe('Выдача настоящего каталога со stub API', () => {
  it.each(['/tires', '/disks'])('показывает комплектную выдачу и переключает фильтр в %s', async path => {
    renderCatalog(path)
    await screen.findByRole('article')
    expect(screen.getByLabelText('Сортировка')).toHaveValue('Сначала комплект')
    const checkbox = screen.getByRole('checkbox', { name: 'Есть 4 шт. и больше' })
    const api = path === '/tires' ? filtersApi.getFilteredTyres : filtersApi.getFilteredDisks
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    await waitFor(() => expect(api).toHaveBeenLastCalledWith({ min_balance: 4 }, 'complete_set', null))
    fireEvent.click(checkbox)
    await waitFor(() => expect(api).toHaveBeenLastCalledWith({}, 'complete_set', null))
  })

  it('не выдаёт загрузку за пустой результат и делает один начальный запрос карточек', async () => {
    let resolve!: (value: tyresCards) => void
    vi.mocked(filtersApi.getFilteredTyres).mockReturnValueOnce(new Promise(done => { resolve = done }))
    renderCatalog()
    expect(screen.getByText('Загружаем товары…')).toBeInTheDocument()
    expect(screen.queryByText('Товары не найдены')).not.toBeInTheDocument()
    await act(async () => { resolve(page([])) })
    expect(await screen.findByText('Товары не найдены')).toBeInTheDocument()
    expect(filtersApi.getFilteredTyres).toHaveBeenCalledTimes(1)
    expect(filtersApi.getTyres).toHaveBeenCalledTimes(1)
  })

  it.each(['/tires', '/disks'])('справка в %s доступна кнопкой и не видна внизу выдачи', async path => {
    const { user } = renderCatalog(path)
    const isDisks = path === '/disks'
    const heading = isDisks ? 'Как подобрать колёсные диски' : 'Как подобрать шины'
    const trigger = screen.getByRole('button', { name: isDisks ? 'Как подобрать диски' : 'Как подобрать шины' })
    expect(document.getElementById('catalog-guide')).not.toBeVisible()
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: isDisks ? 'Помощь с подбором дисков' : 'Помощь с подбором шин' })
    expect(within(dialog).getByRole('heading', { name: heading })).toBeVisible()
    expect(dialog).toHaveTextContent('Цена на сайте за штуку или за комплект?')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.getElementById('catalog-guide')).not.toBeVisible()
  })

  it.each(['/tires', '/disks'])('обновление фильтра %s сохраняет высоту предыдущих карточек, но запрещает старую покупку', async path => {
    let resolve!: (value: { count: number, next: null, previous: null, results: never[] }) => void
    const pending = new Promise<{ count: number, next: null, previous: null, results: never[] }>(done => { resolve = done })
    if (path === '/disks') vi.mocked(filtersApi.getFilteredDisks).mockResolvedValueOnce({ count: 1, next: null, previous: null, results: [disk] }).mockReturnValueOnce(pending)
    else vi.mocked(filtersApi.getFilteredTyres).mockResolvedValueOnce(page()).mockReturnValueOnce(pending)
    const { store } = renderCatalog(path)
    await screen.findByRole('article')
    fireEvent.click(screen.getByRole('checkbox', { name: 'Есть 4 шт. и больше' }))
    expect(screen.getByRole('article', { name: path === '/disks' ? disk.name : tyre.name })).toBeInTheDocument()
    expect(screen.getByText(/Обновляем товары/)).toBeInTheDocument()
    expect(screen.queryByText('Загружаем товары…')).not.toBeInTheDocument()
    const buy = within(screen.getByRole('article')).getByRole('button', { name: 'В корзину' })
    expect(buy).toBeDisabled()
    fireEvent.click(buy)
    expect(store.getState().cart.tyres).toHaveLength(0)
    expect(store.getState().cart.disks).toHaveLength(0)
    await act(async () => { resolve({ count: 0, next: null, previous: null, results: [] }) })
    expect(await screen.findByText('Товары не найдены')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })

  it('догрузка следующей страницы не блокирует уже актуальные товары', async () => {
    let resolve!: (value: tyresCards) => void
    vi.mocked(filtersApi.getFilteredTyres).mockResolvedValueOnce({ ...page(), count: 2, next: 'http://stub.invalid/tyre/?page=2' })
      .mockReturnValueOnce(new Promise<tyresCards>(done => { resolve = done }))
    renderCatalog()
    const card = await screen.findByRole('article')
    fireEvent.click(screen.getByRole('button', { name: 'Показать ещё' }))
    expect(within(card).getByRole('button', { name: 'В корзину' })).toBeEnabled()
    await act(async () => { resolve({ count: 2, next: null, previous: null, results: [{ ...tyre, id: 2 }] }) })
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('показывает ошибку и повторяет существующий запрос по кнопке', async () => {
    vi.mocked(filtersApi.getFilteredTyres).mockRejectedValueOnce(new Error('stub'))
    renderCatalog()
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить товары')
    fireEvent.click(screen.getByRole('button', { name: 'Попробовать ещё раз' }))
    expect(await screen.findByRole('article', { name: tyre.name })).toBeInTheDocument()
    expect(filtersApi.getFilteredTyres).toHaveBeenCalledTimes(2)
  })

  it('не дублирует desktop/mobile карточки, показывает настоящую картинку и размерность', async () => {
    renderCatalog()
    const card = await screen.findByRole('article', { name: tyre.name })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(within(card).getByRole('img', { name: tyre.name })).toHaveAttribute('src', tyre.image_url)
    expect(within(card).getByText('205/55 R16 91H')).toBeInTheDocument()
    expect(card.textContent).not.toContain(String.fromCharCode(0x2014))
    expect(card).toHaveTextContent('×')
    expect(card).toHaveTextContent('=')
  })

  it('не показывает ложную догрузку между страницами каталога', async () => {
    vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue({ ...page(), count: 2, next: 'http://stub.invalid/tyre/?page=2' })
    renderCatalog()
    await screen.findByRole('article', { name: tyre.name })
    expect(screen.getByRole('button', { name: 'Показать ещё' })).toBeInTheDocument()
    expect(screen.queryByText('Загружаем ещё…')).not.toBeInTheDocument()
  })

  it('передаёт выбранный порядок цены и обновлённый размер без изменения payload', async () => {
    renderCatalog()
    await screen.findByRole('article', { name: tyre.name })
    fireEvent.change(screen.getByLabelText('Сортировка'), { target: { value: 'Дороже' } })
    await waitFor(() => expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({}, '-price_sale', null))
    fireEvent.change(screen.getByLabelText('Ширина, мм'), { target: { value: '205' } })
    await waitFor(() => expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ width: ['205'] }, '-price_sale', null))
  })

  it('у дисков показывает PCD/ET/DIA и не добавляет шинные признаки', async () => {
    renderCatalog('/disks')
    const card = await screen.findByRole('article', { name: disk.name })
    expect(within(card).getByText('Литой')).toBeInTheDocument()
    expect(card).toHaveTextContent('PCD 5×114.3 · ET 45 · DIA 67.1')
    expect(screen.queryByText('RunFlat')).not.toBeInTheDocument()
    expect(screen.queryByText('Сезон')).not.toBeInTheDocument()
  })
})

describe('Мобильный диалог фильтров', () => {
  it('применяет изменения при закрытии, а не на каждом изменении открытого диалога', async () => {
    const { store } = renderCatalog()
    await screen.findByRole('article', { name: tyre.name })
    fireEvent.click(screen.getByRole('button', { name: 'Фильтры' }))
    const dialog = screen.getByRole('dialog', { name: 'Параметры шин' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    fireEvent.change(within(dialog).getByLabelText('Ширина, мм'), { target: { value: '205' } })
    expect(filtersApi.getFilteredTyres).toHaveBeenCalledTimes(1)
    expect(within(dialog).getByRole('button', { name: 'Сбросить' })).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Показать товары' }))
    await waitFor(() => expect(filtersApi.getFilteredTyres).toHaveBeenLastCalledWith({ width: ['205'] }, 'complete_set', null))
    expect(store.getState().smallActions.mobileFiltersClose).toBe(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('сбрасывает поля, закрывается Escape и не содержит фиктивных цен', async () => {
    const { store } = renderCatalog()
    await screen.findByRole('article', { name: tyre.name })
    act(() => { store.dispatch(mobileFiltersReducer()) })
    const dialog = screen.getByRole('dialog', { name: 'Параметры шин' })
    fireEvent.change(within(dialog).getByLabelText('От, ₽'), { target: { value: '200' } })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Сбросить' }))
    expect(store.getState().tiresFilters.priceStart).toBe(0)
    expect(within(dialog).getByLabelText('От, ₽')).toHaveAttribute('placeholder', '100')
    expect(within(dialog).getByLabelText('До, ₽')).toHaveAttribute('placeholder', '5000')
    expect(within(dialog).queryByPlaceholderText('20 000')).not.toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(store.getState().smallActions.mobileFiltersClose).toBe(true)
  })
})

describe('Доступная карточка и количество', () => {
  it('ограничивает кнопки количества остатком и минимумом без alert', async () => {
    const store = makeStore({ tiresFilters: { ...filterBlock1Slice.getInitialState(), tyresCardsArr: page() } })
    // Обёртка читает обновляемую Redux-позицию так же, как каталог.
    vi.mocked(filtersApi.getFilteredTyres).mockResolvedValue(page())
    const rendered = renderWithProviders(<TyresCardDesktop data={tyre} handler={vi.fn()} />, { store })
    expect(screen.getByRole('button', { name: `Уменьшить количество: ${tyre.name}` })).toBeDisabled()
    rendered.rerender(<TyresCardDesktop data={{ ...tyre, amount: 2 }} handler={vi.fn()} />)
    expect(screen.getByRole('button', { name: `Увеличить количество: ${tyre.name}` })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', { name: `Уменьшить количество: ${tyre.name}` })).toBeEnabled()
  })

  it('обновляет количество и передаёт его существующему добавлению в корзину', async () => {
    const { user, store } = renderCatalog()
    const card = await screen.findByRole('article', { name: tyre.name })
    await user.click(within(card).getByRole('button', { name: `Увеличить количество: ${tyre.name}` }))
    expect(within(card).getByLabelText('Выбрано штук')).toHaveTextContent('2')
    await user.click(within(card).getByRole('button', { name: 'В корзину' }))
    expect(store.getState().cart.tyres[0].amount).toBe(2)
    expect(within(card).getByRole('button', { name: 'В корзине' })).toBeInTheDocument()
  })

  it('не даёт купить товар с нулевым остатком и честно заменяет недоступное изображение', () => {
    renderWithProviders(<DisksCardDesktop data={{ ...disk, balance: 0, amount: 0 }} handler={vi.fn()} />)
    fireEvent.error(screen.getByRole('img', { name: disk.name }))
    expect(screen.getByRole('img', { name: `Нет изображения: ${disk.name}` })).toBeInTheDocument()
    expect(screen.getByText('Нет фото')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'В корзину' })).toBeDisabled()
    expect(screen.getByRole('button', { name: `Уменьшить количество: ${disk.name}` })).toBeDisabled()
    expect(screen.getByRole('button', { name: `Увеличить количество: ${disk.name}` })).toBeDisabled()
  })

  it('не считает диск с таким же id выбранной шиной', () => {
    const store = makeStore()
    const cart = store.getState().cart
    renderWithProviders(<TyresCardDesktop data={tyre} handler={vi.fn()} />, {
      preloadedState: { cart: { ...cart, disks: [{ ...disk, canceled: false, queue: 0 }] } },
    })
    expect(screen.getByRole('button', { name: 'В корзину' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'В корзине' })).not.toBeInTheDocument()
  })
})
