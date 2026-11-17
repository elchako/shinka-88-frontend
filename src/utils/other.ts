// Поставщик может кодировать отсутствие признака строкой, а не null.
export const hasProductFeature = (value: string | null | undefined): boolean =>
    Boolean(value && !['0', 'нет', 'false', '_', '-', 'null'].includes(value.trim().toLowerCase()) && value.trim())

export const normalizePhoneNumber = (input: string): string | false => {
    const raw = input.trim()
    if (!/^\+?[0-9\s().-]+$/.test(raw)) return false
    const digits = raw.replace(/\D/g, '')
    if (raw.startsWith('+')) {
        if (digits.startsWith('7')) return /^7[0-9]{10}$/.test(digits) ? `+${digits}` : false
        return /^[1-9][0-9]{6,14}$/.test(digits) ? `+${digits}` : false
    }
    if (digits.length === 11 && /^[78]/.test(digits)) return `+7${digits.slice(1)}`
    if (digits.length === 10) return `+7${digits}`
    return false
}

// Отображение ввода: +7 по умолчанию; явно введённый +код страны не подменяется.
export const formatPhoneInput = (input: string): string => {
    const raw = input.trim()
    if (!raw) return '+7'
    const digits = raw.replace(/\D/g, '')
    if (raw.startsWith('+')) return `+${digits}`
    if (digits.length === 10) return `+7${digits}`
    if (/^[78]/.test(digits)) return `+7${digits.slice(1)}`
    return `+7${digits}`
}
