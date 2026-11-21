import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cookies from 'js-cookie'
import { AxiosError, AxiosHeaders } from 'axios'
import { authApi } from '../../api/auth'
import { orderApi } from '../../api/order'
import { setName, setPhone, toogleModal } from '../../app/slices/authSlice'
import { makeStore } from '../../app/store'
import { renderWithProviders } from '../../utils/test-utils'
import { RegModal } from './RegModal'

vi.mock('../../api/auth', () => ({ authApi: { getSmsCode: vi.fn(), login: vi.fn() } }))
vi.mock('../../api/order', () => ({ orderApi: { createOrder: vi.fn() } }))

const renderModal = () => {
  const store = makeStore()
  store.dispatch(setName('Алёна'))
  store.dispatch(setPhone('79990001122'))
  store.dispatch(toogleModal())
  return renderWithProviders(<RegModal />, { store })
}

beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); Cookies.remove('token') })
afterEach(() => { cleanup(); vi.useRealTimers(); Cookies.remove('token') })

describe('Настоящий SMS-сценарий с mock API', () => {
  it('не объявляет SMS отправленной до успешного ответа', async () => {
    let resolve!: () => void
    vi.mocked(authApi.getSmsCode).mockImplementation(() => new Promise(done => { resolve = done }))
    renderModal()
    const sendButton = screen.getByRole('button', { name: 'Отправить SMS-код' })
    fireEvent.click(sendButton)
    expect(screen.queryByLabelText('Код из SMS')).not.toBeInTheDocument()
    expect(sendButton).toBeDisabled()
    await act(async () => { resolve() })
    expect(screen.getByLabelText('Код из SMS')).toBeInTheDocument()
    expect(authApi.getSmsCode).toHaveBeenCalledWith('Алёна', '+79990001122')
  })

  it('ошибку 503 показывает как недоступность, а не выдуманный лимит SMS', async () => {
    vi.mocked(authApi.getSmsCode).mockRejectedValue(new Error('Request failed with status code 503'))
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Сервис временно недоступен')
    expect(screen.getByRole('alert')).not.toHaveTextContent('Слишком много')
    expect(screen.queryByLabelText('Код из SMS')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Повторить через 60 с' })).toBeDisabled()
  })

  it('отличает реальный ответ 429 от ошибки сервиса', async () => {
    vi.mocked(authApi.getSmsCode).mockRejectedValue(new Error('Request failed with status code 429'))
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Слишком много запросов')
  })

  it('уважает Retry-After429 и не позволяет нажимать отправку до окончания интервала', async () => {
    vi.useFakeTimers()
    const failure = new AxiosError('private-error', 'ERR_BAD_REQUEST')
    failure.response = { status: 429, statusText: 'rate', headers: { 'retry-after': '90' },
      config: { headers: new AxiosHeaders() }, data: { code: 'sms_cooldown', error: 'private-body' } }
    vi.mocked(authApi.getSmsCode).mockRejectedValue(failure)
    const { store } = renderModal()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' })) })
    expect(screen.getByRole('button', { name: 'Повторить через 2 мин' })).toBeDisabled()
    expect(screen.getByRole('alert')).not.toHaveTextContent('private-')
    act(() => { store.dispatch(toogleModal()); store.dispatch(toogleModal()) })
    act(() => vi.advanceTimersByTime(89_000))
    expect(screen.getByRole('button', { name: 'Повторить через 1 с' })).toBeDisabled()
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByRole('button', { name: 'Отправить SMS-код' })).toBeEnabled()
    expect(authApi.getSmsCode).toHaveBeenCalledTimes(1)
  })

  it('проверка кода429 имеет свой отсчёт и не выдаёт токен', async () => {
    vi.useFakeTimers()
    vi.mocked(authApi.getSmsCode).mockResolvedValue(undefined)
    const failure = new AxiosError('rate', 'ERR_BAD_REQUEST')
    failure.response = { status: 429, statusText: 'rate', headers: { 'retry-after': '12' },
      config: { headers: new AxiosHeaders() }, data: {} }
    vi.mocked(authApi.login).mockRejectedValue(failure)
    const { store } = renderModal()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' })) })
    await act(async () => { fireEvent.change(screen.getByLabelText('Код из SMS'), { target: { value: '123456' } }) })
    expect(screen.getByRole('button', { name: 'Проверить через 12 с' })).toBeDisabled()
    expect(screen.getByLabelText('Код из SMS')).toBeDisabled()
    expect(store.getState().auth.token).toBe('')
    act(() => vi.advanceTimersByTime(12_000))
    expect(screen.getByRole('button', { name: 'Проверить код' })).toBeEnabled()
    expect(authApi.login).toHaveBeenCalledTimes(1)
  })

  it('поздний ответ проверки не подтверждает другой введённый номер', async () => {
    vi.mocked(authApi.getSmsCode).mockResolvedValue(undefined)
    let resolve!: (data: { token: string }) => void
    vi.mocked(authApi.login).mockImplementation(() => new Promise(done => { resolve = done }))
    const { store } = renderModal()
    fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' }))
    const input = await screen.findByLabelText('Код из SMS')
    fireEvent.change(input, { target: { value: '123456' } })
    await waitFor(() => expect(authApi.login).toHaveBeenCalledTimes(1))
    act(() => { store.dispatch(setPhone('79990002233')) })
    await act(async () => { resolve({ token: 'old-synthetic-token' }) })
    expect(store.getState().auth.token).toBe('')
    expect(Cookies.get('token')).toBeUndefined()
    expect(localStorage.getItem('customerLocalData')).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Телефон подтверждён' })).not.toBeInTheDocument()
  })

  it('разрешает повтор через 60 секунд после успешной отправки и не сбрасывает таймер закрытием', async () => {
    vi.useFakeTimers()
    vi.mocked(authApi.getSmsCode).mockResolvedValue(undefined)
    const { store } = renderModal()
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' })) })
    expect(screen.getByRole('button', { name: 'Повторить через 60 с' })).toBeDisabled()
    act(() => { store.dispatch(toogleModal()); store.dispatch(toogleModal()) })
    act(() => vi.advanceTimersByTime(59_000))
    expect(screen.getByRole('button', { name: 'Повторить через 1 с' })).toBeDisabled()
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByRole('button', { name: 'Отправить код повторно' })).toBeEnabled()
    expect(authApi.getSmsCode).toHaveBeenCalledTimes(1)
  })

  it('проверяет только шесть цифр, сохраняет неверный код и не создаёт заказ после успеха', async () => {
    vi.mocked(authApi.getSmsCode).mockResolvedValue(undefined)
    vi.mocked(authApi.login).mockRejectedValueOnce(new Error('Request failed with status code 400')).mockResolvedValueOnce({ token: 'mock-token' })
    const { store } = renderModal()
    fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' }))
    const input = await screen.findByLabelText('Код из SMS')
    fireEvent.change(input, { target: { value: '65432' } })
    expect(authApi.login).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: '654321' } })
    expect(await screen.findByRole('alert')).toHaveTextContent('Код не подошёл')
    expect(input).toHaveValue('654321')
    fireEvent.click(screen.getByRole('button', { name: 'Проверить код' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Телефон подтверждён' })).toBeInTheDocument())
    expect(store.getState().auth.token).toBe('mock-token')
    expect(screen.getByText(/Заказ ещё не отправлен/)).toBeInTheDocument()
    expect(orderApi.createOrder).not.toHaveBeenCalled()
    expect(JSON.parse(localStorage.getItem('customerLocalData')!)).toEqual({ name: 'Алёна', phone: '+79990001122' })
  })
})
