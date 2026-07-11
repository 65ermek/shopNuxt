<template>
  <div class="register-page">
    <div class="register-grid">
      <aside class="register-sidebar">
        <CategoryMenu />
      </aside>

      <section class="register-content">
        <Breadcrumbs />

        <h1 class="register-title">📝 Registrace</h1>

        <div class="register-container">
          <div class="register-benefits">
            <h2>Proč se registrovat?</h2>
            <ul>
              <li>✔ Rychlé opakované objednávky</li>
              <li>✔ Přehled nákupů pro firmu</li>
              <li>✔ Lepší ceny při pravidelném odběru</li>
            </ul>
            <div class="benefits-note">
              💰 Pro restaurace, bistra i jídelny připravujeme individuální ceny.
            </div>
          </div>

          <div class="register-form">
            <h3>Registrovat přes:</h3>

            <form @submit.prevent="handleRegister">
              <div class="form-group">
                <label class="form-label">Jméno *</label>
                <input
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    required
                    placeholder="Jan Novák"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Email *</label>
                <input
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    required
                    placeholder="petrnovak@seznam.cz"
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

              <div class="form-group">
                <label class="form-label">Heslo znovu *</label>
                <input
                    v-model="form.passwordConfirm"
                    type="password"
                    class="form-input"
                    required
                    placeholder="Heslo znovu"
                />
              </div>

              <Captcha
                  ref="captchaRef"
                  @update:valid="captchaValid = $event"
                  @update:value="captchaValue = $event"
              />

              <div class="form-error" v-if="errorMessage">
                {{ errorMessage }}
              </div>

              <button type="submit" class="submit-btn" :disabled="loading || !captchaValid">
                {{ loading ? 'Registruji...' : 'Registrovat' }}
              </button>
            </form>

            <div class="form-links">
              <p>Již máte účet? <NuxtLink to="/login" class="link">Přihlaste se</NuxtLink></p>
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
import Captcha from '~/components/common/Captcha.vue'

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

interface RegisterResponse {
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
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const loading = ref(false)
const errorMessage = ref('')
const captchaValid = ref(false)
const captchaValue = ref('')
const captchaRef = ref<InstanceType<typeof Captcha>>()

// ✅ Определяем, куда редиректить после регистрации
const getRedirectPath = (): string => {
  const cartItems = cartStore.cartItems

  if (cartItems.length > 0) {
    console.log('🛒 В корзине есть товары, редирект на /cart')
    return '/cart'
  }

  console.log('🏠 Корзина пуста, редирект на главную')
  return '/'
}

// ✅ Регистрация
const handleRegister = async (): Promise<void> => {
  errorMessage.value = ''

  // Валидация
  if (!form.value.name.trim()) {
    errorMessage.value = 'Zadejte prosím své jméno'
    return
  }

  if (!form.value.email || !form.value.email.includes('@')) {
    errorMessage.value = 'Zadejte prosím platný email'
    return
  }

  if (form.value.password.length < 6) {
    errorMessage.value = 'Heslo musí mít alespoň 6 znaků'
    return
  }

  if (form.value.password !== form.value.passwordConfirm) {
    errorMessage.value = 'Hesla se neshodují'
    return
  }

  if (!captchaValid.value) {
    errorMessage.value = 'Prosím ověřte, že nejste robot'
    captchaRef.value?.resetCaptcha()
    return
  }

  loading.value = true

  try {
    const sessionId = localStorage.getItem('session_id')

    console.log('📝 Регистрация пользователя:', {
      name: form.value.name,
      email: form.value.email,
      session_id: sessionId
    })

    const response = await $fetch<RegisterResponse>('https://obchod.tanatar.cz/api/customers/register', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        password_confirmation: form.value.passwordConfirm,
        session_id: sessionId,
        captcha: captchaValue.value
      }
    })

    console.log('✅ Регистрация успешна:', response)

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
      await cartStore.mergeCartWithUser(
          response.customer.id,
          response.customer.email
      )
      await cartStore.fetchCart()
    }

    // ✅ Редиректим в зависимости от наличия товаров в корзине
    const redirectPath = getRedirectPath()
    console.log('🔄 Редирект на:', redirectPath)

    setTimeout(() => {
      router.push(redirectPath)
    }, 300)

  } catch (error) {
    console.error('❌ Chyba při registraci:', error)
    const err = error as { data?: { message?: string }; message?: string }
    errorMessage.value = err.data?.message || err.message || 'Registrace selhala. Zkuste to prosím znovu.'
    captchaRef.value?.resetCaptcha()
  } finally {
    loading.value = false
  }
}

// Загружаем корзину при загрузке страницы
onMounted(async () => {
  await cartStore.fetchCart()
  console.log('📦 Корзина загружена:', cartStore.cartItems)
})
</script>

<style scoped>
.register-page {
  padding: 20px 0;
}

.register-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

.register-sidebar {
  min-width: 220px;
}

.register-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.register-container {
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.register-benefits {
  background: #f8fafc;
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.register-benefits h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.register-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.register-benefits ul li {
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

.register-form h3 {
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

.form-error {
  padding: 10px 14px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
}

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

@media (max-width: 992px) {
  .register-grid {
    grid-template-columns: 1fr;
  }
  .register-sidebar {
    min-width: auto;
  }
  .register-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .register-title {
    font-size: 22px;
  }
}

@media (max-width: 768px) {
  .register-container {
    padding: 16px;
  }
  .register-benefits {
    padding: 16px;
  }
  .register-benefits h2 {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 12px;
  }
  .register-title {
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
}
</style>