// stores/cartStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Типы
interface Product {
    id: number
    name: string
    slug: string
    price: string | number
    old_price?: string | number | null
    image?: string | null
    unit?: string
    in_stock?: boolean | number
    discount?: number | null
    is_new?: boolean
    category_id?: number
    created_at?: string
    [key: string]: unknown // ✅ вместо any используем unknown
}

interface CartItem {
    id: number
    customer_id?: number | null
    session_id?: string
    product_id: number
    quantity: number
    type: 'cart' | 'favorite' | 'history'
    is_selected?: boolean
    email?: string | null
    group_name?: string | null
    product?: Product
    created_at?: string
    updated_at?: string
    deleted_at?: string | null
    [key: string]: unknown // ✅ вместо any используем unknown
}

// ✅ Добавляем интерфейс для ответа от сервера
interface CartResponse {
    id?: number
    cart?: CartItem
    message?: string
    status?: string
    [key: string]: unknown
}

interface ApiResponse {
    cart?: CartItem[]
    data?: CartItem[]
    [key: string]: unknown // ✅ вместо any
}

export const useCartStore = defineStore('cart', () => {
    // Состояние
    const items = ref<CartItem[]>([])
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const sessionId = ref<string | null>(null)

    const API_BASE_URL = 'https://obchod.tanatar.cz'

    // 📊 Геттеры
    const cartItems = computed<CartItem[]>(() => {
        return items.value.filter(item => item.type === 'cart' || item.type === null)
    })

    const favoriteItems = computed<CartItem[]>(() => {
        return items.value.filter(item => item.type === 'favorite')
    })

    const cartCount = computed<number>(() => {
        return cartItems.value.reduce((total, item) => total + (item.quantity || 0), 0)
    })

    const cartTotal = computed<number>(() => {
        return cartItems.value.reduce((total, item) => {
            const product = item.product || item
            const price = parseFloat(String(product.price || 0))
            return total + (price * (item.quantity || 0))
        }, 0)
    })

    const favoriteCount = computed<number>(() => {
        return favoriteItems.value.length
    })

    // 🔧 Инициализация session_id
    const initSession = (): string | null => {
        // ✅ Используем проверку на наличие window (клиент)
        if (typeof window !== 'undefined') {
            let session = localStorage.getItem('session_id')

            if (!session) {
                session = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
                localStorage.setItem('session_id', session)
            }

            sessionId.value = session
            console.log('🆔 Session ID:', sessionId.value)
            return sessionId.value
        }
        return null
    }
    // 📦 Загрузка корзины с сервера
    const fetchCart = async (): Promise<CartItem[]> => {
        try {
            loading.value = true
            error.value = null

            // ✅ Проверяем, авторизован ли пользователь
            let token = null
            let customerId = null

            if (typeof window !== 'undefined') {
                token = localStorage.getItem('token')
                const customerData = localStorage.getItem('customer')
                if (customerData) {
                    try {
                        const customer = JSON.parse(customerData)
                        customerId = customer.id
                    } catch (e) {
                        console.error('Ошибка парсинга customer:', e)
                    }
                }
            }

            const sid = sessionId.value || initSession()

            console.log('🔍 Запрос с токеном:', token ? 'есть' : 'нет')
            console.log('🔍 customer_id:', customerId)
            console.log('🔍 session_id:', sid)

            // ✅ Формируем параметры
            const params: Record<string, string> = {}
            params['session_id'] = sid || ''

            // Если есть customer_id, добавляем его
            if (customerId) {
                params['customer_id'] = String(customerId)
            }

            // ✅ Формируем заголовки
            const headers: Record<string, string> = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

            // ✅ Если есть токен - добавляем Authorization
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
                console.log('🔑 Токен добавлен в заголовки')
            } else {
                console.log('⚠️ Токен отсутствует, запрос как гость')
            }

            const response = await $fetch<ApiResponse | CartItem[]>(`${API_BASE_URL}/api/cart`, {
                method: 'GET',
                params: params,
                headers: headers
            })

            console.log('📦 Ответ от сервера:', response)

            let cartData: CartItem[] = []
            if (Array.isArray(response)) {
                cartData = response
            } else if (response && typeof response === 'object') {
                if (Array.isArray(response.data)) {
                    cartData = response.data
                } else if (Array.isArray(response.cart)) {
                    cartData = response.cart
                }
            }

            items.value = cartData.map(item => ({
                ...item,
                type: item.type || 'cart'
            }))

            console.log(`📦 Загружено: ${items.value.length} записей`)
            console.log('🛒 Корзина:', cartItems.value.length)
            console.log('❤️ Избранное:', favoriteItems.value.length)

            saveToLocalStorage()

            return items.value
        } catch (err) {
            console.error('❌ Ошибка загрузки корзины:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            loadFromLocalStorage()
            return items.value
        } finally {
            loading.value = false
        }
    }

    // ➕ Добавление в корзину/избранное
    const addItem = async (product: Product, quantity: number = 1, type: 'cart' | 'favorite' = 'cart'): Promise<void> => {
        try {
            loading.value = true

            // ✅ Получаем токен и customer_id
            let token = null
            let customerId = null

            if (typeof window !== 'undefined') {
                token = localStorage.getItem('token')
                const customerData = localStorage.getItem('customer')
                if (customerData) {
                    try {
                        const customer = JSON.parse(customerData)
                        customerId = customer.id
                    } catch (e) {}
                }
            }

            const sid = sessionId.value || initSession()

            // Проверяем для корзины
            if (type === 'cart') {
                const existingItem = cartItems.value.find(
                    item => item.product_id === product.id
                )
                if (existingItem) {
                    const newQuantity = (existingItem.quantity || 0) + quantity
                    await updateItem(existingItem.id, newQuantity)
                    return
                }
            }

            // Проверяем для избранного
            if (type === 'favorite') {
                const existingItem = favoriteItems.value.find(
                    item => item.product_id === product.id
                )
                if (existingItem) {
                    console.log('ℹ️ Produkt již je v oblíbených')
                    return
                }
            }

            // ✅ Формируем заголовки
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            // ✅ Формируем тело запроса
            const body: Record<string, any> = {
                session_id: sid,
                product_id: product.id,
                quantity: quantity,
                type: type
            }

            // ✅ Если есть customer_id - добавляем в запрос
            if (customerId) {
                body.customer_id = customerId
            }

            console.log('🔍 Отправка запроса:', { headers, body })

            // Отправляем запрос на сервер
            const response = await $fetch<CartResponse>(`${API_BASE_URL}/api/cart`, {
                method: 'POST',
                headers: headers,
                body: body
            })

            console.log(`✅ Добавлено в ${type === 'favorite' ? 'избранное' : 'корзину'}:`, response)

            // ... остальной код (создание newItem и т.д.)
            let newId: number
            if (response.cart && typeof response.cart === 'object' && 'id' in response.cart) {
                newId = (response.cart as CartItem).id
            } else if (response.id) {
                newId = response.id
            } else {
                newId = Date.now()
            }

            const newItem: CartItem = {
                id: newId,
                product_id: product.id,
                product: product,
                quantity: quantity,
                type: type,
                session_id: sid || undefined,
                customer_id: customerId || undefined
            }

            items.value.push(newItem)

            saveToLocalStorage()

            // Обновляем данные с сервера для синхронизации
            await fetchCart()

        } catch (err) {
            console.error('❌ Ошибка добавления:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            loading.value = false
        }
    }
    // 🔄 Обновление количества
    const updateItem = async (itemId: number, quantity: number): Promise<void> => {
        try {
            loading.value = true

            await $fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
                method: 'PUT',
                body: { quantity }
            })

            const item = items.value.find(i => i.id === itemId)
            if (item) {
                item.quantity = quantity
            }

            saveToLocalStorage()
            await fetchCart()

        } catch (err) {
            console.error('❌ Ошибка обновления:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            loading.value = false
        }
    }

    // 🗑 Удаление из корзины/избранного
    const removeItem = async (itemId: number): Promise<void> => {
        try {
            loading.value = true

            await $fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
                method: 'DELETE'
            })

            items.value = items.value.filter(item => item.id !== itemId)

            saveToLocalStorage()
            await fetchCart()

        } catch (err) {
            console.error('❌ Ошибка удаления:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            loading.value = false
        }
    }

    // 📧 Сохранение email (только на checkout)
    const setUserEmail = async (email: string): Promise<{ success: boolean; message?: string }> => {
        try {
            loading.value = true

            const sid = sessionId.value || initSession()

            const response = await $fetch<{ success: boolean; message?: string }>(`${API_BASE_URL}/api/cart/update-email`, {
                method: 'POST',
                body: {
                    session_id: sid,
                    email: email
                }
            })

            console.log('📧 Email обновлен:', email)

            // Обновляем локальные данные
            items.value = items.value.map(item => ({
                ...item,
                email: email
            }))

            saveToLocalStorage()
            await fetchCart()

            return response

        } catch (err) {
            console.error('❌ Ошибка сохранения email:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            loading.value = false
        }
    }

    // 🔗 Объединение корзины с пользователем (после регистрации)
    const mergeCartWithUser = async (customerId: number): Promise<{ success: boolean; message?: string }> => {
        try {
            loading.value = true

            const sid = sessionId.value || initSession()

            const response = await $fetch<{ success: boolean; message?: string }>(`${API_BASE_URL}/api/cart/merge`, {
                method: 'POST',
                body: {
                    session_id: sid,
                    customer_id: customerId
                }
            })

            console.log('🔄 Корзина объединена с пользователем:', response)

            await fetchCart()

            return response

        } catch (err) {
            console.error('❌ Ошибка объединения корзины:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            loading.value = false
        }
    }

    // 🗑 Очистка корзины
    const clearCart = async (): Promise<void> => {
        try {
            loading.value = true

            for (const item of cartItems.value) {
                await $fetch(`${API_BASE_URL}/api/cart/${item.id}`, {
                    method: 'DELETE'
                })
            }

            items.value = items.value.filter(item => item.type !== 'cart')

            saveToLocalStorage()
            await fetchCart()

        } catch (err) {
            console.error('❌ Ошибка очистки корзины:', err)
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            loading.value = false
        }
    }

    // 💾 Сохранение в localStorage
    const saveToLocalStorage = (): void => {
        // ✅ Используем проверку на наличие window (клиент)
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('cart_data', JSON.stringify(items.value))
                if (sessionId.value) {
                    localStorage.setItem('session_id', sessionId.value)
                }
            } catch (e) {
                console.error('Chyba při ukládání do localStorage:', e)
            }
        }
    }

    // 📂 Загрузка из localStorage
    const loadFromLocalStorage = (): void => {
        // ✅ Используем проверку на наличие window (клиент)
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('cart_data')
                if (saved) {
                    items.value = JSON.parse(saved)
                }

                const session = localStorage.getItem('session_id')
                if (session) {
                    sessionId.value = session
                }
            } catch (e) {
                console.error('Chyba při načítání z localStorage:', e)
            }
        }
    }

    // Инициализация
    // ✅ Используем проверку на наличие window (клиент)
    if (typeof window !== 'undefined') {
        initSession()
        loadFromLocalStorage()
        fetchCart()
    }

    return {
        items,
        cartItems,
        favoriteItems,
        cartCount,
        cartTotal,
        favoriteCount,
        loading,
        error,
        sessionId,
        initSession,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        setUserEmail,
        mergeCartWithUser,
        clearCart,
        saveToLocalStorage,
        loadFromLocalStorage
    }
})