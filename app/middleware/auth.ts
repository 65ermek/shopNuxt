// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()

    // ✅ Ждем инициализацию
    if (authStore.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    // ✅ Проверяем isAuthenticated И token
    if (!authStore.isAuthenticated || !authStore.token) {
        console.log('❌ Не авторизован, перенаправление на /login')
        return navigateTo('/login')
    }

    console.log('✅ Авторизован:', {
        email: authStore.customer?.email,
        token: authStore.token?.substring(0, 20) + '...'
    })
})