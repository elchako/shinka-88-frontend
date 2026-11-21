import { describe, expect, it } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { normalizeAuthError, retryAfterSeconds } from './authError'

describe('Безопасный Retry-After SMS', () => {
  it('разбирает секунды и HTTP-date с конечными пределами', () => {
    expect(retryAfterSeconds('90')).toBe(90)
    expect(retryAfterSeconds('1.5')).toBe(2)
    expect(retryAfterSeconds('999999999')).toBe(86400)
    expect(retryAfterSeconds('Tue, 01 Jan 2030 00:01:00 GMT', Date.parse('Tue, 01 Jan 2030 00:00:00 GMT'))).toBe(60)
    for (const bad of [undefined, null, '', 'not-a-date', {}, [], NaN, Infinity]) expect(retryAfterSeconds(bad)).toBeNull()
  })
  it('не переносит тело ответа/URL/данные ошибки в Redux', () => {
    const error = new AxiosError('private-password', 'ERR_BAD_REQUEST')
    error.response = { status: 429, statusText: 'rate', config: { headers: new AxiosHeaders() },
      headers: { 'retry-after': '120' }, data: { code: 'sms_daily_limit', error: 'private-body' } }
    const result = normalizeAuthError(error)
    expect(result).toEqual({ kind: 'rate_limited', status: 429, retryAfter: 120, limit: 'daily' })
    expect(JSON.stringify(result)).not.toContain('private-')
  })
})
