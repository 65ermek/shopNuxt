// app/stores/cartStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface CartItem {
    id: number
    product_id: number
    name: string
    slug: string
    price: number
    old_price?: number
    image?: string
    unit?: string
    quantity: number
    type: 'cart' | 'favorite' | 'history'
    is_selected?: boolean
}

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Получаем session_id (для гостей)
    const getSessionId = (): string => {
        let sessionId = localStorage.getItem('cart_session_id')
        if (!sessionId) {
            sessionId = 'guest_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
            localStorage.setItem('cart_session_id', sessionId)
        }
        return sessionId
    }

    // Получаем токен (для авторизованных)
    const getToken = (): string | null => {
        return localStorage.getItem('token')
    }

    // Заголовки для запросов
    const getHeaders = () => {
        const token = getToken()
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    }

    // Загрузить корзину с сервера
    const fetchCart = async () => {
        isLoading.value = true
        error.value = null
        try {
            const sessionId = getSessionId()
            const token = getToken()

            const params = new URLSearchParams()
            params.append('session_id', sessionId)
            if (token) params.append('token', token)

            const response = await fetch(`https://obchod.tanatar.cz/api/cart?${params.toString()}`, {
                headers: getHeaders()
            })

            if (!response.ok) throw new Error('Failed to fetch cart')

            const data = await response.json()
            items.value = data.cart || []
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error'
            console.error('Error fetching cart:', err)
        } finally {
            isLoading.value = false
        }
    }

    // Добавить товар в корзину
    const addItem = async (product: any, quantity: number = 1, type: 'cart' | 'favorite' = 'cart') => {
        isLoading.value = true
        error.value = null
        try {
            const sessionId = getSessionId()
            const token = getToken()

            const response = await fetch('https://obchod.tanatar.cz/api/cart', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    product_id: product.id,
                    quantity: quantity,
                    type: type,
                    session_id: sessionId,
                    token: token
                })
            })

            if (!response.ok) throw new Error('Failed to add item')

            // Обновляем корзину после добавления
            await fetchCart()
            return true
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error'
            console.error('Error adding item:', err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    // Обновить количество товара
    const updateQuantity = async (cartItemId: number, quantity: number) => {
        if (quantity < 1) {
            await removeItem(cartItemId)
            return
        }

        isLoading.value = true
        try {
            const response = await fetch(`https://obchod.tanatar.cz/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ quantity })
            })

            if (!response.ok) throw new Error('Failed to update quantity')

            await fetchCart()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error'
            console.error('Error updating quantity:', err)
        } finally {
            isLoading.value = false
        }
    }

    // Удалить товар из корзины
    const removeItem = async (cartItemId: number) => {
        isLoading.value = true
        try {
            const response = await fetch(`https://obchod.tanatar.cz/api/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: getHeaders()
            })

            if (!response.ok) throw new Error('Failed to remove item')

            await fetchCart()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error'
            console.error('Error removing item:', err)
        } finally {
            isLoading.value = false
        }
    }

    // Очистить корзину
    const clearCart = async () => {
        // Удаляем все товары по одному
        for (const item of items.value) {
            await removeItem(item.id)
        }
    }

    // Вычисляемые свойства
    const totalItems = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
    })

    const totalPrice = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    })

    const totalPriceWithoutVat = computed(() => {
        return totalPrice.value / 1.21
    })

    // Инициализация — загружаем корзину при создании стора
    const init = () => {
        fetchCart()
    }

    return {
        items,
        isLoading,
        error,
        totalItems,
        totalPrice,
        totalPriceWithoutVat,
        fetchCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        init,
        getSessionId,
        getToken
    }
})