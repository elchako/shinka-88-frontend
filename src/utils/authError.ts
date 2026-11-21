import axios from 'axios'

export type AuthFailure = {
  kind: 'rate_limited' | 'invalid_input' | 'invalid_code' | 'forbidden' | 'unavailable' | 'network' | 'unexpected'
  status: number | null
  retryAfter: number | null
  limit?: 'daily' | 'cooldown'
}

export const retryAfterSeconds = (value: unknown, now = Date.now()): number | null => {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const text = String(value).trim()
  if (!text || text.length > 128 || /^[+-]/.test(text)) return null
  let seconds: number
  if (/^[0-9]+(?:\.[0-9]+)?$/.test(text)) seconds = Number(text)
  else {
    const deadline = Date.parse(text)
    if (!Number.isFinite(deadline)) return null
    seconds = (deadline - now) / 1000
  }
  return Number.isFinite(seconds) ? Math.min(86400, Math.max(1, Math.ceil(seconds))) : null
}

// Только безопасные поля доходят до Redux/интерфейса, не Axios URL/body/headers.
export const normalizeAuthError = (error: unknown, verification = false): AuthFailure => {
  let status: number | null = null
  let retryAfter: number | null = null
  let limit: AuthFailure['limit']
  if (axios.isAxiosError(error)) {
    status = error.response?.status ?? null
    retryAfter = retryAfterSeconds(error.response?.headers['retry-after'])
    const code = error.response?.data && typeof error.response.data === 'object' ? error.response.data.code : null
    if (code === 'sms_daily_limit') limit = 'daily'
    if (code === 'sms_cooldown') limit = 'cooldown'
  } else if (error instanceof Error) {
    // Совместимость с сериализованными legacy-ошибками; текст наружу не возвращается.
    const found = /\b(400|401|403|429|503)\b/.exec(error.message)
    if (found) status = Number(found[1])
  }
  const kind: AuthFailure['kind'] = status === 429 ? 'rate_limited'
    : verification && [400, 401, 403].includes(status ?? 0) ? 'invalid_code'
      : status === 400 ? 'invalid_input' : status === 403 ? 'forbidden'
        : status !== null && status >= 500 ? 'unavailable'
          : axios.isAxiosError(error) && !error.response ? 'network' : 'unexpected'
  return { kind, status, retryAfter, ...(limit ? { limit } : {}) }
}
