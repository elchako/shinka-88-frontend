export const normalizePhoneNumber = (input: string) => {
    // Удаляем всё, кроме цифр, но учитываем, что "+" в начале допустим
    const digits = input.replace(/^\+/, '').replace(/\D/g, '')

    // Проверяем количество цифр
    if (digits.length < 10) {
        return false
    }

    // Если номер начинается с 8 или 7 и содержит 11 цифр, заменяем первую цифру на 7
    if (digits.length === 11 && (digits.startsWith('8') || digits.startsWith('7'))) {
        return `7${digits.slice(1)}`
    }

    // Если номер содержит 10 цифр, добавляем 7 в начало
    if (digits.length === 10) {
        return `7${digits}`
    }

    return false
};
