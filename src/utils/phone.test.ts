import { describe, expect, it } from 'vitest'
import { formatPhoneInput, normalizePhoneNumber } from './other'

describe('номер покупателя', () => {
  it.each([
    ['999 000-11-22', '+79990001122'], ['8 (999) 000-11-22', '+79990001122'],
    ['7 999 0001122', '+79990001122'], ['+7 (999) 000-11-22', '+79990001122'],
    ['+49 30 123456', '+4930123456'], ['+81 90 1234 5678', '+819012345678'],
  ])('нормализует %s без подмены международного кода', (raw, expected) => {
    expect(normalizePhoneNumber(raw)).toBe(expected)
  })
  it.each(['', '+7', '123', '+04912345678', 'abc9990001122', '+7+9990001122', '+1234567890123456'])('отклоняет неполный/повреждённый ввод %s', value => {
    expect(normalizePhoneNumber(value)).toBe(false)
  })
  it('подставляет российский префикс и позволяет заменить код страны', () => {
    expect(formatPhoneInput('')).toBe('+7')
    expect(formatPhoneInput('9990001122')).toBe('+79990001122')
    expect(formatPhoneInput('89990001122')).toBe('+79990001122')
    expect(formatPhoneInput('+49 30')).toBe('+4930')
  })
})
