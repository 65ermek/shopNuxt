// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Customer {
    id: number
    name: string
    email: string
    avatar?: string
    phone?: string
    firstName?: string
    lastName?: string
    street?: string
    city?: string
    postcode?: string
    [key: string]: any
}

interface ShippingData {
    shippingMethod: string | null
    paymentMethod: string | null
    parcelshop: any | null // ✅ ДОБАВЛЯЕМ поле для ParcelShop
}

interface CustomerData {
    email: string
    password?: string
    confirmPassword?: string
    firstName: string
    lastName: string
    phone: string
    invoiceStreet: string
    invoiceCity: string
    invoicePostcode: string
    invoiceCountry: string
    isCompany: boolean
    companyName: string
    ico: string
    dic: string
    isVatPayer: boolean
    isDifferentDelivery: boolean
    deliveryName: string
    deliveryStreet: string
    deliveryCity: string
    deliveryPostcode: string
    deliveryCountry: string
    deliveryPhone: string
    deliveryEmail: string
    note: string
    agreement: boolean
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const customer = ref<Customer | null>(null)
    const isLoading = ref(false)
    const isCheckingAuth = ref(false)

    // ✅ ДОБАВЛЯЕМ parcelshop в shippingData
    const shippingData = ref<ShippingData>({
        shippingMethod: null,
        paymentMethod: null,
        parcelshop: null // 👈 НОВОЕ ПОЛЕ
    })

    const customerData = ref<CustomerData>({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        invoiceStreet: '',
        invoiceCity: '',
        invoicePostcode: '',
        invoiceCountry: 'CZ',
        isCompany: false,
        companyName: '',
        ico: '',
        dic: '',
        isVatPayer: false,
        isDifferentDelivery: false,
        deliveryName: '',
        deliveryStreet: '',
        deliveryCity: '',
        deliveryPostcode: '',
        deliveryCountry: 'CZ',
        deliveryPhone: '',
        deliveryEmail: '',
        note: '',
        agreement: false
    })

    const isAuthenticated = computed(() => {
        return !!token.value && !!customer.value
    })

    // ============================================================
    // 📌 МЕТОДЫ ДЛЯ PARCELSHOP (НОВЫЕ)
    // ============================================================

    // ✅ Метод для установки данных ParcelShop
    const setParcelshopData = (data: any) => {
        shippingData.value.parcelshop = data
        saveShippingData()
        console.log('📦 ParcelShop uložen:', data)
    }

    // ✅ Метод для получения данных ParcelShop
    const getParcelshopData = () => {
        return shippingData.value.parcelshop
    }

    // ✅ Метод для очистки ParcelShop
    const clearParcelshopData = () => {
        shippingData.value.parcelshop = null
        saveShippingData()
        console.log('🗑️ ParcelShop vymazán')
    }

    // ============================================================
    // 📌 МЕТОДЫ ДЛЯ ПОЛЬЗОВАТЕЛЯ
    // ============================================================

    const fetchCurrentUser = async (): Promise<Customer | null> => {
        try {
            isLoading.value = true

            const token = localStorage.getItem('token')
            if (!token) {
                console.warn('⚠️ Нет токена для запроса пользователя')
                return null
            }

            const response = await fetch('/api/customers/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })

            if (response.ok) {
                const userData = await response.json()
                setCustomer(userData)
                return userData
            } else if (response.status === 401) {
                await logout()
                return null
            }
            return null
        } catch (error) {
            console.error('❌ Ошибка загрузки пользователя:', error)
            return null
        } finally {
            isLoading.value = false
        }
    }

    const refreshCustomer = (userData: Customer) => {
        if (!userData) return

        customer.value = userData
        if (typeof window !== 'undefined') {
            localStorage.setItem('customer', JSON.stringify(userData))
        }

        const firstName = userData.firstName || userData.name?.split(' ')[0] || ''
        const lastName = userData.lastName || userData.name?.split(' ').slice(1).join(' ') || ''

        customerData.value = {
            ...customerData.value,
            email: userData.email || '',
            firstName: firstName,
            lastName: lastName,
            phone: userData.phone || '',
            invoiceStreet: userData.street || '',
            invoiceCity: userData.city || '',
            invoicePostcode: userData.postcode || ''
        }
        saveCustomerData()
    }

    const setToken = (newToken: string) => {
        token.value = newToken
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', newToken)
        }
    }

    const setCustomer = (userData: any) => {
        if (!userData) return

        customer.value = userData
        if (typeof window !== 'undefined') {
            localStorage.setItem('customer', JSON.stringify(userData))
        }

        if (userData) {
            const firstName = userData.firstName || userData.name?.split(' ')[0] || ''
            const lastName = userData.lastName || userData.name?.split(' ').slice(1).join(' ') || ''

            customerData.value = {
                ...customerData.value,
                email: userData.email || '',
                firstName: firstName,
                lastName: lastName,
                phone: userData.phone || '',
                invoiceStreet: userData.street || '',
                invoiceCity: userData.city || '',
                invoicePostcode: userData.postcode || ''
            }
            saveCustomerData()
        }
    }

    const fetchUserByEmail = async (email: string) => {
        try {
            isLoading.value = true

            if (typeof window !== 'undefined') {
                const savedCustomer = localStorage.getItem('customer')
                if (savedCustomer) {
                    try {
                        const userData = JSON.parse(savedCustomer)
                        if (userData.email === email) {
                            return userData
                        }
                    } catch (e) {}
                }
            }

            const token = localStorage.getItem('token')
            const response = await fetch(`/api/customers/by-email?email=${encodeURIComponent(email)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })

            if (response.ok) {
                const userData = await response.json()
                return userData
            }
            return null
        } catch (error) {
            console.error('❌ Ошибка загрузки пользователя:', error)
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updateCustomerDataFromUser = (userData: Customer) => {
        const firstName = userData.firstName || userData.name?.split(' ')[0] || ''
        const lastName = userData.lastName || userData.name?.split(' ').slice(1).join(' ') || ''

        customerData.value = {
            ...customerData.value,
            email: userData.email || '',
            firstName: firstName,
            lastName: lastName,
            phone: userData.phone || '',
            invoiceStreet: userData.street || '',
            invoiceCity: userData.city || '',
            invoicePostcode: userData.postcode || ''
        }
        saveCustomerData()
    }

    const checkAuthFromCart = async (email: string): Promise<boolean> => {
        if (isCheckingAuth.value || !email) return false

        isCheckingAuth.value = true

        try {
            const savedCustomer = localStorage.getItem('customer')
            if (savedCustomer) {
                try {
                    const userData = JSON.parse(savedCustomer)
                    if (userData.email === email) {
                        customer.value = userData
                        const savedToken = localStorage.getItem('token')
                        if (savedToken) {
                            token.value = savedToken
                        }
                        updateCustomerDataFromUser(userData)
                        return true
                    }
                } catch (e) {
                    console.error('Ошибка парсинга customer:', e)
                }
            }

            const userData = await fetchUserByEmail(email)
            if (userData) {
                setCustomer(userData)
                const savedToken = localStorage.getItem('token')
                if (savedToken) {
                    token.value = savedToken
                }
                return true
            }

            return false
        } catch (error) {
            console.error('❌ Ошибка проверки авторизации:', error)
            return false
        } finally {
            isCheckingAuth.value = false
        }
    }

    const initAuth = () => {
        if (typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('token')
            const savedCustomer = localStorage.getItem('customer')
            const savedShipping = localStorage.getItem('shippingData')
            const savedCustomerData = localStorage.getItem('customerData')

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

            if (savedShipping) {
                try {
                    const parsed = JSON.parse(savedShipping)
                    shippingData.value = {
                        shippingMethod: parsed.shippingMethod || null,
                        paymentMethod: parsed.paymentMethod || null,
                        parcelshop: parsed.parcelshop || null // ✅ Восстанавливаем parcelshop
                    }
                } catch (e) {
                    console.error('Ошибка парсинга shippingData:', e)
                }
            }

            if (savedCustomerData) {
                try {
                    customerData.value = JSON.parse(savedCustomerData)
                } catch (e) {
                    console.error('Ошибка парсинга customerData:', e)
                }
            } else if (customer.value) {
                const user = customer.value
                const firstName = user.firstName || user.name?.split(' ')[0] || ''
                const lastName = user.lastName || user.name?.split(' ').slice(1).join(' ') || ''

                customerData.value = {
                    ...customerData.value,
                    email: user.email || '',
                    firstName: firstName,
                    lastName: lastName,
                    phone: user.phone || '',
                    invoiceStreet: user.street || '',
                    invoiceCity: user.city || '',
                    invoicePostcode: user.postcode || ''
                }
                saveCustomerData()
            }
        }
    }

    // ============================================================
    // 📌 МЕТОДЫ ДЛЯ SHIPPING
    // ============================================================

    const setShippingMethod = (methodId: string) => {
        shippingData.value.shippingMethod = methodId
        saveShippingData()
    }

    const setPaymentMethod = (methodId: string) => {
        shippingData.value.paymentMethod = methodId
        saveShippingData()
    }

    const setShippingData = (data: Partial<ShippingData>) => {
        if (data.shippingMethod !== undefined) {
            shippingData.value.shippingMethod = data.shippingMethod
        }
        if (data.paymentMethod !== undefined) {
            shippingData.value.paymentMethod = data.paymentMethod
        }
        if (data.parcelshop !== undefined) {
            shippingData.value.parcelshop = data.parcelshop
        }
        saveShippingData()
    }
        // ============================================================
    // 📌 МЕТОДЫ ДЛЯ CUSTOMER DATA
    // ============================================================

    const setCustomerData = (data: Partial<CustomerData>) => {
        customerData.value = { ...customerData.value, ...data }
        saveCustomerData()
    }

    const saveCustomerData = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('customerData', JSON.stringify(customerData.value))
        }
    }
    const saveShippingData = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('shippingData', JSON.stringify(shippingData.value))
        }
    }
    const clearCustomerData = () => {
        customerData.value = {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phone: '',
            invoiceStreet: '',
            invoiceCity: '',
            invoicePostcode: '',
            invoiceCountry: 'CZ',
            isCompany: false,
            companyName: '',
            ico: '',
            dic: '',
            isVatPayer: false,
            isDifferentDelivery: false,
            deliveryName: '',
            deliveryStreet: '',
            deliveryCity: '',
            deliveryPostcode: '',
            deliveryCountry: 'CZ',
            deliveryPhone: '',
            deliveryEmail: '',
            note: '',
            agreement: false
        }
        if (typeof window !== 'undefined') {
            localStorage.removeItem('customerData')
        }
    }

    const clearShippingData = () => {
        shippingData.value = {
            shippingMethod: null,
            paymentMethod: null,
            parcelshop: null // ✅ Очищаем parcelshop
        }
        if (typeof window !== 'undefined') {
            localStorage.removeItem('shippingData')
        }
    }

    const logout = async () => {
        token.value = null
        customer.value = null
        shippingData.value = {
            shippingMethod: null,
            paymentMethod: null,
            parcelshop: null // ✅ Очищаем parcelshop
        }
        localStorage.removeItem('token')
        localStorage.removeItem('customer')
        localStorage.removeItem('shippingData')
        localStorage.removeItem('customerData')
    }

    // Инициализация
    if (typeof window !== 'undefined') {
        initAuth()
    }

    return {
        token,
        customer,
        isLoading,
        isCheckingAuth,
        isAuthenticated,
        shippingData,
        customerData,
         setParcelshopData,
        getParcelshopData,
        clearParcelshopData,
        setToken,
        setCustomer,
        refreshCustomer,
        fetchCurrentUser,
        fetchUserByEmail,
        checkAuthFromCart,
        setShippingMethod,
        setPaymentMethod,
        setShippingData,
        clearShippingData,
        setCustomerData,
        saveCustomerData,
        clearCustomerData,
        initAuth,
        logout
    }
})