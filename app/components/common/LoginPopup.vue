<template>
  <div class="login-popup" :class="{ show: isVisible }">
    <div class="popup-header">
      <h4 class="popup-title">Přihlášení</h4>
      <button class="popup-close" @click="close">✕</button>
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label class="form-label">Email *</label>
        <input
            type="email"
            class="form-control"
            v-model="form.email"
            required
            placeholder="vas@email.cz"
            :disabled="isLoading"
            @input="saveEmailToStorage"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Heslo *</label>
        <input
            type="password"
            class="form-control"
            v-model="form.password"
            required
            placeholder="Vaše heslo"
            :disabled="isLoading"
        />
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'Přihlašování...' : 'Přihlásit' }}
        </button>
      </div>

      <div class="form-links">
        <a href="#" class="forgot-link" @click.prevent="forgotPassword">
          Zaslat zapomenuté heslo
        </a>
        <a href="#" class="register-link" @click.prevent="goToRegister">
          Ještě nemám účet, chci se Registrovat
        </a>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useCartStore } from '~/stores/cartStore'

const props = defineProps({
  isVisible: Boolean
})

const emit = defineEmits(['close', 'login', 'forgot-password', 'register'])

// Используем хранилища
const authStore = useAuthStore()
const cartStore = useCartStore()

const form = ref({
  email: '',
  password: ''
})
const isLoading = ref(false)
const errorMessage = ref('')

// ===== СОХРАНЕНИЕ EMAIL В STORAGE =====
const SAVED_EMAIL_KEY = 'saved_login_email'

// Сохранение email при вводе
const saveEmailToStorage = () => {
  if (typeof window !== 'undefined') {
    if (form.value.email) {
      localStorage.setItem(SAVED_EMAIL_KEY, form.value.email)
    }
  }
}

// Загрузка сохраненного email
const loadSavedEmail = () => {
  if (typeof window !== 'undefined') {
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY)
    if (savedEmail) {
      form.value.email = savedEmail
    }
  }
}

// ===== ОБРАБОТЧИК ВХОДА (обновленный) =====
const handleLogin = async () => {
  // Валидация
  if (!form.value.email || !form.value.password) {
    errorMessage.value = 'Prosím vyplňte všechny pole'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // 1. Отправляем запрос на вход
    const response = await fetch('https://obchod.tanatar.cz/api/customers/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password
      })
    })

    const data = await response.json()

    if (response.ok) {
      // ✅ Успешный вход
      saveEmailToStorage()

      // 2. Сохраняем данные в authStore
      authStore.token = data.token
      authStore.customer = data.customer

      localStorage.setItem('token', data.token)
      localStorage.setItem('customer', JSON.stringify(data.customer))

      console.log('✅ Вход выполнен:', data.customer.email)

      // 3. ✅ ВАЖНО: Объединяем гостевую корзину с пользователем
      try {
        console.log('🔄 Начинаем объединение корзины...')

        // Проверяем, есть ли гостевые товары
        const hasGuestItems = cartStore.items.some(item =>
            item.session_id && !item.customer_id
        )

        if (hasGuestItems) {
          console.log('📦 Обнаружены гостевые товары, объединяем...')
          await cartStore.mergeCartWithUser(data.customer.id, data.customer.email)
          console.log('✅ Корзина успешно объединена')
        } else {
          console.log('ℹ️ Нет гостевых товаров для объединения')
          // Просто обновляем корзину
          await cartStore.fetchCart()
        }
      } catch (mergeError) {
        console.error('❌ Ошибка объединения корзины:', mergeError)
        // Показываем ошибку, но не блокируем вход
        errorMessage.value = 'Вход выполнен, но произошла ошибка при объединении корзины'
        // Все равно передаем данные о входе
      }

      // 4. Передаем данные в родительский компонент
      emit('login', {
        customer: data.customer,
        token: data.token
      })

      // 5. Очищаем пароль и закрываем попап
      form.value.password = ''
      errorMessage.value = ''
      emit('close')

    } else {
      errorMessage.value = data.error || 'Přihlášení selhalo'
    }
  } catch (err) {
    console.error('Login error:', err)
    errorMessage.value = 'Chyba připojení k serveru'
  } finally {
    isLoading.value = false
  }
}

// ===== ЗАКРЫТИЕ ПОПАПА =====
const close = () => {
  emit('close')
  errorMessage.value = ''
  if (form.value.email) {
    saveEmailToStorage()
  }
}

// ===== ДРУГИЕ МЕТОДЫ =====
const forgotPassword = () => {
  emit('forgot-password')
}

const goToRegister = () => {
  emit('register')
}

// ===== НАБЛЮДАТЕЛЬ ЗА ВИДИМОСТЬЮ =====
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    loadSavedEmail()
    errorMessage.value = ''
  }
}, { immediate: true })
</script>

<style scoped>
/* ... все ваши стили остаются без изменений ... */
.login-popup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 24px 28px;
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  border: 1px solid #e5e7eb;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  position: relative;
}

.login-popup.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Стрелочка */
.login-popup::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
  filter: drop-shadow(0 -2px 4px rgba(0,0,0,0.05));
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.popup-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.popup-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  line-height: 1;
}

.popup-close:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  transition: all 0.2s;
  outline: none;
  min-height: 44px;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-control:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.error-message {
  padding: 8px 12px;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 12px;
  text-align: center;
}

.form-actions {
  margin-top: 8px;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-login:disabled {
  background: #93c5fd;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-links {
  margin-top: 16px;
  text-align: center;
}

.forgot-link,
.register-link {
  display: block;
  font-size: 13px;
  color: #007bff;
  text-decoration: none;
  padding: 4px 0;
  transition: all 0.2s;
}

.forgot-link:hover,
.register-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.register-link {
  font-weight: 600;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .login-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    max-width: 320px;
    min-width: 0;
    width: 90%;
  }

  .login-popup.show {
    transform: translate(-50%, -50%) scale(1);
  }

  .login-popup::before {
    display: none;
  }

  .login-popup {
    padding: 20px;
  }
}
</style>