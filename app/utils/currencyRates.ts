// app/utils/currencyRates.ts
import { ref } from 'vue'
import { useToastStore } from '~/stores/toastStore'

export interface CurrencyRate {
    code: string
    name: string
    rate: number        // Курс в Kč (сколько CZK za 1 EUR/USD)
    previousRate: number
    change: number
    changePercent: number
    signal: 'buy' | 'sell' | 'neutral'
    lastUpdate: string
}

// Пороги для сигналов (в CZK za 1 EUR/USD)
export const THRESHOLDS = {
    EUR: {
        buy: 24.0,    // Ниже 24 - покупать (зеленый)
        sell: 25.0,   // Выше 25 - продавать (красный)
    },
    USD: {
        buy: 20.0,    // Ниже 20 - покупать (зеленый)
        sell: 22.0,   // Выше 22 - продавать (красный)
    }
}

// Состояние курсов (singleton)
const rates = ref<CurrencyRate[]>([
    {
        code: 'EUR',
        name: 'Euro',
        rate: 0,
        previousRate: 0,
        change: 0,
        changePercent: 0,
        signal: 'neutral',
        lastUpdate: ''
    },
    {
        code: 'USD',
        name: 'Dolar',
        rate: 0,
        previousRate: 0,
        change: 0,
        changePercent: 0,
        signal: 'neutral',
        lastUpdate: ''
    }
])

const isLoading = ref(false)
const error = ref<string | null>(null)
const lastNotification = ref<Record<string, string>>({})
let updateInterval: ReturnType<typeof setInterval> | null = null

/**
 * Обновление курса конкретной валюты
 */
export const updateRate = (code: string, newRate: number) => {
    const toastStore = useToastStore()

    const index = rates.value.findIndex(r => r.code === code)
    if (index === -1) return

    const currentRate = rates.value[index]
    if (!currentRate) return

    // ✅ Сохраняем курс как есть (CZK za 1 EUR/USD)
    const previousRate = currentRate.rate || newRate
    const change = newRate - previousRate
    const changePercent = previousRate !== 0 ? (change / previousRate) * 100 : 0

    const updatedRate: CurrencyRate = {
        ...currentRate,
        previousRate: previousRate,
        rate: newRate,
        change: change,
        changePercent: changePercent,
        lastUpdate: new Date().toLocaleString('cs-CZ')
    }

    // Определяем сигнал на основе курса
    const threshold = code === 'EUR' ? THRESHOLDS.EUR : THRESHOLDS.USD
    let signal: 'buy' | 'sell' | 'neutral' = 'neutral'
    let signalMessage = ''

    if (newRate <= threshold.buy) {
        signal = 'buy'
        signalMessage = `${code} je pod ${threshold.buy} Kč! Dobrá příležitost k nákupu.`
    } else if (newRate >= threshold.sell) {
        signal = 'sell'
        signalMessage = `${code} je nad ${threshold.sell} Kč! Dobrá příležitost k prodeji.`
    }

    updatedRate.signal = signal
    rates.value[index] = updatedRate

    // Отправляем уведомление
    if (signal !== 'neutral') {
        const notificationKey = `${code}-${signal}`
        const currentTime = new Date().getTime()
        const lastNotify = lastNotification.value[notificationKey]

        if (!lastNotify || (currentTime - parseInt(lastNotify)) > 3600000) {
            lastNotification.value[notificationKey] = String(currentTime)

            toastStore.warning(
                `📊 ${signalMessage}`,
                `Aktuální kurz: ${newRate.toFixed(2)} Kč`,
                8000
            )
            console.log(`🔔 ${signalMessage} Kurz: ${newRate.toFixed(2)} Kč`)
        }
    }
}

/**
 * Получение курсов валют из API
 */
export const fetchRates = async () => {
    try {
        isLoading.value = true
        error.value = null

        // Используем API, который возвращает курсы относительно CZK
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/CZK')

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // ✅ Получаем курсы: сколько CZK за 1 EUR/USD
        // API возвращает rates, где указано сколько CZK в 1 EUR
        // Нам нужно обратное: сколько EUR в 1 CZK
        // Поэтому берем 1 / rates.EUR
        const eurRate = 1 / data.rates.EUR
        const usdRate = 1 / data.rates.USD

        updateRate('EUR', eurRate)
        updateRate('USD', usdRate)

        isLoading.value = false
    } catch (err) {
        console.error('❌ Chyba při načítání kurzů:', err)
        error.value = err instanceof Error ? err.message : 'Nepodařilo se načíst kurzy'
        isLoading.value = false
    }
}

/**
 * Запуск автоматического обновления
 */
export const startAutoUpdate = (intervalMs: number = 60000) => {
    if (updateInterval) {
        clearInterval(updateInterval)
    }
    fetchRates()
    updateInterval = setInterval(fetchRates, intervalMs)
}

/**
 * Остановка автоматического обновления
 */
export const stopAutoUpdate = () => {
    if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
    }
}

/**
 * Получение сигнала для валюты
 */
export const getSignal = (code: string): 'buy' | 'sell' | 'neutral' => {
    const rate = rates.value.find(r => r.code === code)
    return rate?.signal || 'neutral'
}

/**
 * Получение цвета сигнала
 */
export const getSignalColor = (code: string): string => {
    const signal = getSignal(code)
    switch (signal) {
        case 'buy':
            return 'text-green-600'
        case 'sell':
            return 'text-red-600'
        default:
            return 'text-gray-500'
    }
}

/**
 * Получение текста сигнала
 */
export const getSignalText = (code: string): string => {
    const signal = getSignal(code)
    const threshold = code === 'EUR' ? THRESHOLDS.EUR : THRESHOLDS.USD
    switch (signal) {
        case 'buy':
            return `🟢 Nákup (pod ${threshold.buy} Kč)`
        case 'sell':
            return `🔴 Prodej (nad ${threshold.sell} Kč)`
        default:
            return `⚪ Čekat (${threshold.buy}-${threshold.sell} Kč)`
    }
}

/**
 * Получение курса валюты
 */
export const getRate = (code: string): number | null => {
    const rate = rates.value.find(r => r.code === code)
    return rate?.rate || null
}

/**
 * Получение всех курсов
 */
export const getRates = () => {
    return rates.value
}

/**
 * Получение состояния загрузки
 */
export const getLoadingState = () => {
    return isLoading.value
}

/**
 * Получение ошибки
 */
export const getError = () => {
    return error.value
}

/**
 * Получение времени последнего обновления
 */
export const getLastUpdate = (): string => {
    const eur = rates.value.find(r => r.code === 'EUR')
    return eur?.lastUpdate || '---'
}

// Инициализация при импорте (только на клиенте)
if (typeof window !== 'undefined') {
    startAutoUpdate(60000)

    window.addEventListener('beforeunload', () => {
        stopAutoUpdate()
    })
}