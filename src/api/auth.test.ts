import { afterEach, describe, expect, it, vi } from 'vitest'
import { authApi } from './auth'

afterEach(() => vi.restoreAllMocks())

describe('SMS API: только явное подтверждение, без настоящей сети', () => {
  it('принимает message_sent=true для200/201', async () => {
    const post = vi.spyOn(authApi.instance, 'post')
    for (const status of [200, 201]) {
      post.mockResolvedValue({ status, data: { message_sent: true } })
      await expect(authApi.getSmsCode('Тест', '79990000001')).resolves.toBeUndefined()
    }
  })
  it('не считает любой HTTP200 успешной отправкой', async () => {
    const post = vi.spyOn(authApi.instance, 'post')
    for (const data of [{}, { message_sent: false }, { message_sent: 'true' }, null]) {
      post.mockResolvedValue({ status: 200, data })
      await expect(authApi.getSmsCode('Тест', '79990000001')).rejects.toThrow('unexpected_auth_response')
    }
  })
  it('выдаёт только непустой токен из подтверждённого200', async () => {
    const post = vi.spyOn(authApi.instance, 'post')
    post.mockResolvedValue({ status: 200, data: { token: 'synthetic-token' } })
    await expect(authApi.login('79990000001', '123456')).resolves.toEqual({ token: 'synthetic-token' })
    for (const data of [{}, { token: '' }, { token: false }, null]) {
      post.mockResolvedValue({ status: 200, data })
      await expect(authApi.login('79990000001', '123456')).rejects.toThrow('unexpected_auth_response')
    }
  })
})
