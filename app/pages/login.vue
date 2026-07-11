<template>
  <div class="login-page">
    <div class="login-grid">
      <aside class="login-sidebar">
        <CategoryMenu />
      </aside>

      <section class="login-content">
        <Breadcrumbs />

        <h1 class="login-title">🔑 Přihlášení</h1>

        <div class="login-container">
          <div class="login-benefits">
            <h2>Vítejte zpět!</h2>
            <p>Přihlaste se ke svému účtu a pokračujte v nákupu.</p>
            <ul>
              <li>✔ Rychlé opakované objednávky</li>
              <li>✔ Přehled nákupů pro firmu</li>
              <li>✔ Lepší ceny při pravidelném odběru</li>
            </ul>
            <div class="benefits-note">
              💰 Pro restaurace, bistra i jídelny připravujeme individuální ceny.
            </div>
            <NuxtLink to="/register" class="register-link">
              Nemáte účet? Zaregistrujte se →
            </NuxtLink>
          </div>

          <div class="login-form">
            <h3>Přihlásit se</h3>

            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    required
                    placeholder="vas@email.cz"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Heslo *</label>
                <input
                    v-model="form.password"
                    type="password"
                    class="form-input"
                    required
                    placeholder="Vaše heslo"
                />
              </div>

              <div class="form-options">
                <label class="checkbox-label">
                  <input
                      v-model="form.remember"
                      type="checkbox"
                      class="checkbox-input"
                  />
                  Zapamatovat si mě
                </label>
                <NuxtLink to="/forgot-password" class="forgot-link">
                  Zapomenuté heslo?
                </NuxtLink>
              </div>

              <div class="form-error" v-if="errorMessage">
                {{ errorMessage }}
              </div>

              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? 'Přihlašuji...' : 'Přihlásit' }}
              </button>
            </form>

            <div class="form-links">
              <p>
                Nemáte účet?
                <NuxtLink to="/register" class="link">Zaregistrujte se</NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cartStore'
import Breadcrumbs from "~/components/common/Breadcrumbs.vue"

// ============================================================
// 📌 ТИПЫ
// ============================================================

interface Customer {
  id: number
  name: string
  email: string
  phone?: string | null
  avatar?: string | null
  group_id?: number
  status?: string
  type?: string
  street?: string | null
  postcode?: string | null
  city?: string | null
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

interface LoginResponse {
  status?: string
  message?: string
  token: string
  customer: Customer
}

// ============================================================
// 📌 ЛОГИКА
// ============================================================

const router = useRouter()
const cartStore = useCartStore()

// Состояния
const form = ref({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const errorMessage = ref('')

// ✅ Определяем, куда редиректить после входа
const getRedirectPath = (): string => {
  const cartItems = cartStore.cartItems

  if (cartItems.length > 0) {
    console.log('🛒 В корзине есть товары, редирект на /cart')
    return '/cart'
  }

  console.log('🏠 Корзина пуста, редирект на главную')
  return '/'
}

// ✅ Обработка входа
const handleLogin = async (): Promise<void> => {
  errorMessage.value = ''

  // Валидация
  if (!form.value.email || !form.value.email.includes('@')) {
    errorMessage.value = 'Zadejte prosím platný email'
    return
  }

  if (!form.value.password) {
    errorMessage.value = 'Zadejte prosím heslo'
    return
  }

  loading.value = true

  try {
    console.log('🔑 Вход пользователя:', {
      email: form.value.email,
      remember: form.value.remember
    })

    const response = await $fetch<LoginResponse>('https://obchod.tanatar.cz/api/customers/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password,
        remember: form.value.remember
      }
    })

    console.log('✅ Вход успешен:', response)

    if (!response || !response.token) {
      throw new Error('Neplatná odpověď ze serveru')
    }

    // Сохраняем данные пользователя
    localStorage.setItem('token', response.token)
    if (response.customer) {
      localStorage.setItem('customer', JSON.stringify(response.customer))
    }

    // ✅ Объединяем гостевую корзину с пользователем
    if (response.customer?.id) {
      console.log('🔄 Объединение корзины с пользователем...')

      // ✅ Передаем email как строку (он точно есть)
      await cartStore.mergeCartWithUser(
          response.customer.id,
          response.customer.email // ✅ без undefined
      )
      await cartStore.fetchCart()
    }

    const redirectPath = getRedirectPath()
    console.log('🔄 Редирект на:', redirectPath)

    setTimeout(() => {
      router.push(redirectPath)
    }, 300)

  } catch (error) {
    console.error('❌ Chyba při přihlášení:', error)
    const err = error as { data?: { message?: string }; message?: string }
    errorMessage.value = err.data?.message || err.message || 'Přihlášení selhalo. Zkuste to prosím znovu.'
  } finally {
    loading.value = false
  }
}

// Загружаем корзину при загрузке страницы
onMounted(async () => {
  await cartStore.fetchCart()
  console.log('📦 Корзина загружена:', cartStore.cartItems)
})

// SEO
useHead({
  title: 'Přihlášení | New Idea',
  meta: [
    {
      name: 'description',
      content: 'Přihlaste se ke svému účtu v internetovém obchodě New Idea.'
    }
  ]
})
</script>


<style scoped>
.login-page {
  padding: 20px 0;
}

.login-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

.login-sidebar {
  min-width: 220px;
}

.login-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* ============================================================
   КОНТЕЙНЕР
   ============================================================ */

.login-container {
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* ============================================================
   ПРЕИМУЩЕСТВА
   ============================================================ */

.login-benefits {
  background: #f8fafc;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.login-benefits h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.login-benefits p {
  color: #4b5563;
  margin-bottom: 16px;
}

.login-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.login-benefits ul li {
  padding: 6px 0;
  font-size: 14px;
  color: #1e293b;
}

.benefits-note {
  background: #fef3c7;
  padding: 12px 16px;
  border-radius: 6px;
  color: #92400e;
  font-size: 14px;
  margin-bottom: 16px;
}

.register-link {
  display: inline-block;
  padding: 12px 20px;
  background: #1e293b;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: background 0.2s;
  margin-top: auto;
}

.register-link:hover {
  background: #46a3fa;
}

/* ============================================================
   ФОРМА
   ============================================================ */

.login-form h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: border-color 0.2s;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #46a3fa;
  box-shadow: 0 0 0 3px rgba(70, 163, 250, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 16px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-link {
  font-size: 13px;
  color: #46a3fa;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #2c7fd4;
  text-decoration: underline;
}

.form-error {
  padding: 10px 14px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
}

/* ============================================================
   КНОПКА
   ============================================================ */

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #46a3fa;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #2c7fd4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(70, 163, 250, 0.3);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* ============================================================
   ССЫЛКИ
   ============================================================ */

.form-links {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #4b5563;
}

.form-links .link {
  color: #46a3fa;
  text-decoration: none;
  font-weight: 600;
}

.form-links .link:hover {
  text-decoration: underline;
}

/* ============================================================
   СОЦИАЛЬНЫЙ ВХОД (опционально)
   ============================================================ */

.social-login {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.social-divider {
  text-align: center;
  margin-bottom: 16px;
  position: relative;
}

.social-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.social-divider span {
  background: white;
  padding: 0 12px;
  color: #94a3b8;
  font-size: 13px;
  position: relative;
  z-index: 1;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.google-login-btn:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* ============================================================
   АДАПТИВНОСТЬ
   ============================================================ */

@media (max-width: 992px) {
  .login-grid {
    grid-template-columns: 1fr;
  }

  .login-sidebar {
    min-width: auto;
  }

  .login-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .login-title {
    font-size: 22px;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }

  .login-benefits {
    padding: 16px;
  }

  .login-benefits h2 {
    font-size: 18px;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .google-login-btn {
    font-size: 13px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 12px;
  }

  .login-title {
    font-size: 18px;
  }

  .form-input {
    font-size: 13px;
    padding: 8px 12px;
  }

  .submit-btn {
    font-size: 14px;
    padding: 12px;
  }

  .login-benefits ul li {
    font-size: 13px;
  }
}
</style>