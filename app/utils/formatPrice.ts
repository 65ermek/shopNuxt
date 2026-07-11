// utils/formatPrice.ts

export const formatPrice = (price: string | number | null | undefined): string => {
    if (!price) return '0,-'

    const num = typeof price === 'string'
        ? parseFloat(price.replace(',', '.'))
        : price

    if (isNaN(num)) return '0,-'

    // Проверяем, есть ли десятичная часть
    const hasDecimals = num % 1 !== 0

    if (hasDecimals) {
        // Если есть десятичная часть - показываем с копейками
        return num.toFixed(2).replace('.', ',') + ''
    }

    // Если целое число - форматируем с пробелами и запятой
    const formatted = Math.round(num).toLocaleString('cs-CZ', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    return `${formatted},-`
}