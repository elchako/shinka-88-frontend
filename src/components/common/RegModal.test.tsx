import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Cookies from 'js-cookie'
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
    expect(screen.getByRole('button', { name: 'Отправить SMS-код' })).toBeEnabled()
  })

  it('отличает реальный ответ 429 от ошибки сервиса', async () => {
    vi.mocked(authApi.getSmsCode).mockRejectedValue(new Error('Request failed with status code 429'))
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: 'Отправить SMS-код' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Слишком много запросов')
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
