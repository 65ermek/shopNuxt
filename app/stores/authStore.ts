// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Customer {
    id: number
    name: string
    email: string
    avatar?: string
    phone?: string
    [key: string]: any
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const customer = ref<Customer | null>(null)
    const isAuthenticated = computed(() => !!token.value && !!customer.value)

    const initAuth = () => {
        if (typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('token')
            const savedCustomer = localStorage.getItem('customer')

            if (savedToken) {
                token.value = savedToken
            }

            if (savedCustomer) {
                try {
                    customer.value = JSON.parse(savedCustomer)
                } catch (e) {
                    console.error('Ошибка парсинга customer:', e)
                }
            }
        }
    }

    const logout = async () => {
        token.value = null
        customer.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('customer')
    }

    // Инициализация
    if (typeof window !== 'undefined') {
        initAuth()
    }

    return {
        token,
        customer,
        isAuthenticated,
        initAuth,
        logout
    }
})