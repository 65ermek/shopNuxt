<!-- components/CheckoutTopBar.vue -->
<template>
  <div class="topbar">
    <div class="topbar-inner">
      <!-- Левая часть: ссылки (скрываются на мобильных) -->
      <div class="topbar-left">
<!--        <NuxtLink to="/obchodni-podminky" class="topbar-link" @click.prevent="blockLink">-->
<!--          OBCHODNÍ PODMÍNKY-->
<!--        </NuxtLink>-->
<!--        <NuxtLink to="/jak-objednat" class="topbar-link" @click.prevent="blockLink">-->
<!--          JAK OBJEDNAT-->
<!--        </NuxtLink>-->
<!--        <NuxtLink to="/pro-firmy-a-instituce" class="topbar-link" @click.prevent="blockLink">-->
<!--          PRO FIRMY A INSTITUCE-->
<!--        </NuxtLink>-->
<!--        <NuxtLink to="/reklamace" class="topbar-link" @click.prevent="blockLink">-->
<!--          REKLAMACE-->
<!--        </NuxtLink>-->
<!--        <NuxtLink to="/kontakt" class="topbar-link" @click.prevent="blockLink">-->
<!--          KONTAKT-->
<!--        </NuxtLink>-->
      </div>

      <!-- Правая часть: логин или профиль -->
      <div class="topbar-right">
        <!-- Неавторизованный пользователь -->
        <div v-if="!isLoggedIn" class="login-area">
          <span class="user-icon">👤</span>
          <div
              class="login-wrapper"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
          >
            <div class="topbar-right">
              <NuxtLink to="/login" class="topbar-link">PŘIHLÁŠENÍ</NuxtLink>
            </div>
            <div
                class="login-popup-wrapper"
                @mouseenter="handleMouseEnter"
                @mouseleave="handleMouseLeave"
            >
              <ClientOnly>
                <LoginPopup
                    v-if="showPopup"
                    :is-visible="showPopup"
                    @close="closePopup"
                    @login="handleLogin"
                    @forgot-password="forgotPassword"
                    @register="goToRegister"
                />
              </ClientOnly>
            </div>
          </div>
        </div>
        <!-- Авторизованный пользователь -->
        <div v-else class="user-menu-wrapper">
          <div class="user-dropdown-trigger" @click="toggleUserMenu">
            <img
                :src="userAvatar"
                alt="Avatar"
                class="user-avatar"
                @error="handleAvatarError"
            />
            <span class="user-name">{{ userName }}</span>
            <span class="chevron-icon" :class="{ rotate: isUserMenuOpen }">▼</span>
          </div>

          <!-- ✅ ИСПРАВЛЕННЫЕ ССЫЛКИ -->
          <div class="user-dropdown-menu" v-if="isUserMenuOpen" @click.stop>
            <NuxtLink to="/profile" class="dropdown-item" @click="closeUserMenu">
              👤 Můj účet
            </NuxtLink>
            <NuxtLink to="/profile/orders" class="dropdown-item" @click="closeUserMenu">
              📦 Moje objednávky
            </NuxtLink>
            <NuxtLink to="/profile/invoices" class="dropdown-item" @click="closeUserMenu">
              📄 Moje faktury
            </NuxtLink>
            <hr class="dropdown-divider" />
            <button @click="handleLogout" class="dropdown-item text-danger">
              🚪 Odhlásit se
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useAuthStore } from '~/stores/authStore'
import LoginPopup from '~/components/common/LoginPopup.vue'

// ===== ИСПОЛЬЗУЕМ ХРАНИЛИЩА =====
const cartStore = useCartStore()
const authStore = useAuthStore()

// ===== СОСТОЯНИЯ =====
const showPopup = ref(false)
const isLoggedIn = ref(false)
const userName = ref('')
const userAvatar = ref('/avatars/default.png')
const isUserMenuOpen = ref(false)
const customerData = ref(null)
let closeTimeout = null

// ===== ИНИЦИАЛИЗАЦИЯ АВТОРИЗАЦИИ =====
const initAuth = () => {
  if (!import.meta.client) return

  // Используем данные из authStore
  if (authStore.isAuthenticated && authStore.customer) {
    isLoggedIn.value = true
    userName.value = authStore.customer.name || 'Uživatel'
    customerData.value = authStore.customer

    // ✅ Проверяем, есть ли аватарка
    if (authStore.customer.avatar) {
      userAvatar.value = `https://obchod.tanatar.cz${authStore.customer.avatar}`
    } else {
      userAvatar.value = '/avatars/default.png' // Fallback
    }
  } else {
    // Проверяем localStorage напрямую (для обратной совместимости)
    const token = localStorage.getItem('token')
    const customer = localStorage.getItem('customer')
    if (token && customer) {
      try {
        const parsed = JSON.parse(customer)
        isLoggedIn.value = true
        userName.value = parsed.name || 'Uživatel'
        customerData.value = parsed
        if (parsed.avatar) {
          userAvatar.value = `https://obchod.tanatar.cz${parsed.avatar}`
        }
      } catch (e) {
        console.error('Chyba při parsování customer:', e)
      }
    }
  }
}

// ===== ОБРАБОТКА ВХОДА МЫШИ =====
const handleMouseEnter = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  showPopup.value = true
}

// ===== ОБРАБОТКА ВЫХОДА МЫШИ =====
const handleMouseLeave = () => {
  closeTimeout = setTimeout(() => {
    showPopup.value = false
    closeTimeout = null
  }, 500)
}

// ===== ЗАКРЫТИЕ ПОПАПА =====
const closePopup = () => {
  showPopup.value = false
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

// ===== ОБРАБОТКА УСПЕШНОГО ВХОДА (ОБНОВЛЕННАЯ) =====
const handleLogin = async (data) => {
  if (!import.meta.client) return

  console.log('✅ Přihlášení úspěšné:', data)

  try {
    // 1. Сохраняем данные в authStore
    if (data.token) {
      authStore.token = data.token
      localStorage.setItem('token', data.token)
    }

    if (data.customer) {
      authStore.customer = data.customer
      localStorage.setItem('customer', JSON.stringify(data.customer))
    }

    // 2. Обновляем состояние
    isLoggedIn.value = true
    userName.value = data.customer?.name || 'Uživatel'
    customerData.value = data.customer

    if (data.customer?.avatar) {
      userAvatar.value = `https://obchod.tanatar.cz${data.customer.avatar}`
    }

    closePopup()

    // 3. ✅ ВАЖНО: Объединяем корзину и обновляем
    console.log('🔄 Обновляем корзину после входа...')

    // Проверяем, есть ли гостевые товары
    const hasGuestItems = cartStore.items.some(item =>
        item.session_id && !item.customer_id
    )

    if (hasGuestItems && data.customer) {
      console.log('📦 Обнаружены гостевые товары, объединяем...')
      try {
        await cartStore.mergeCartWithUser(data.customer.id, data.customer.email)
        console.log('✅ Корзина успешно объединена')
      } catch (mergeError) {
        console.error('❌ Ошибка объединения корзины:', mergeError)
        // Если объединение не удалось, просто обновляем корзину
        await cartStore.fetchCart()
      }
    } else {
      // Просто обновляем корзину
      await cartStore.fetchCart()
    }

    // 4. Закрываем меню пользователя если открыто
    isUserMenuOpen.value = false

  } catch (error) {
    console.error('❌ Ошибка при входе:', error)
    // В случае ошибки все равно пытаемся обновить корзину
    await cartStore.fetchCart()
  }
}

// ===== ОБРАБОТКА ОШИБКИ АВАТАРА =====
const handleAvatarError = () => {
  userAvatar.value = '/images/default-avatar.png'
}

// ===== ВЫХОД ИЗ АККАУНТА (ОБНОВЛЕННЫЙ) =====
const handleLogout = async () => {
  if (!import.meta.client) return

  try {
    // Выход через authStore
    await authStore.logout()

    // Обновляем состояние
    isLoggedIn.value = false
    userName.value = ''
    customerData.value = null
    isUserMenuOpen.value = false
    userAvatar.value = '/images/default-avatar.png'

    // ✅ Обновляем корзину (теперь гостевая)
    await cartStore.fetchCart()

    console.log('✅ Выход выполнен успешно')

  } catch (error) {
    console.error('❌ Ошибка при выходе:', error)
    // Принудительный выход даже при ошибке
    localStorage.removeItem('token')
    localStorage.removeItem('customer')
    authStore.token = null
    authStore.customer = null
    isLoggedIn.value = false
    userName.value = ''
    customerData.value = null
    isUserMenuOpen.value = false
    await cartStore.fetchCart()
  }

  navigateTo('/')
}

// ===== ПЕРЕКЛЮЧЕНИЕ МЕНЮ ПОЛЬЗОВАТЕЛЯ =====
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// ===== ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ ВНЕ =====
const handleClickOutside = (event) => {
  if (!import.meta.client) return
  const wrapper = document.querySelector('.user-menu-wrapper')
  if (wrapper && !wrapper.contains(event.target)) {
    isUserMenuOpen.value = false
  }
}

// ===== ЗАБЫТЫЙ ПАРОЛЬ =====
const forgotPassword = () => {
  if (!import.meta.client) return
  alert('📧 Odkaz pro obnovení hesla bude zaslán na váš email.')
  closePopup()
}

// ===== ПЕРЕХОД НА РЕГИСТРАЦИЮ =====
const goToRegister = () => {
  if (!import.meta.client) return
  navigateTo('/register')
}

// ===== ЗАГЛУШКА ДЛЯ БЛОКИРОВКИ ССЫЛОК =====
const blockLink = () => {
  console.log('🔗 Ссылка временно заблокирована')
}

// ===== СЛЕЖЕНИЕ ЗА ИЗМЕНЕНИЕМ АВТОРИЗАЦИИ =====
watch(() => authStore.isAuthenticated, (newVal) => {
  if (newVal && authStore.customer) {
    isLoggedIn.value = true
    userName.value = authStore.customer.name || 'Uživatel'
    customerData.value = authStore.customer
    if (authStore.customer.avatar) {
      userAvatar.value = `https://obchod.tanatar.cz${authStore.customer.avatar}`
    }
  } else {
    isLoggedIn.value = false
    userName.value = ''
    customerData.value = null
    userAvatar.value = '/images/default-avatar.png'
  }
})

// ===== ЖИЗНЕННЫЙ ЦИКЛ =====
onMounted(() => {
  if (!import.meta.client) return

  // Инициализация
  initAuth()

  // Добавляем слушатели событий
  document.addEventListener('click', handleClickOutside)

  // ✅ Загружаем корзину при загрузке страницы
  cartStore.fetchCart()

  /*  console.log('🔍 Текущее состояние авторизации:', {
      isLoggedIn: isLoggedIn.value,
      authStoreAuth: authStore.isAuthenticated,
      hasCustomer: !!authStore.customer
    })*/
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('click', handleClickOutside)
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
})
</script>

<style scoped>
/* ===== ВСЕ ВАШИ СТИЛИ ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ ===== */
.topbar {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e5e7eb;
  padding: 4px 0;
  font-size: 12px;
}

.topbar-inner {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
}

.topbar-link {
  color: #1e293b;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 11px;
  padding: 6px 12px;
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 4px;
}

.topbar-link:hover {
  background-color: #e5e7eb;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.login-area {
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-icon {
  font-size: 14px;
  color: #007bff;
}

.login-wrapper {
  position: relative;
  display: inline-block;
}

.login-popup-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  padding-top: 5px;
  z-index: 9999;
  min-width: 280px;
}

.user-menu-wrapper {
  position: relative;
  display: inline-block;
}

.user-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-dropdown-trigger:hover {
  background-color: #e5e7eb;
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

.chevron-icon {
  font-size: 10px;
  color: #6b7280;
  transition: transform 0.3s;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.12);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: #1e293b;
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
}

.dropdown-divider {
  margin: 4px 0;
  border-top: 1px solid #e5e7eb;
}

.text-danger {
  color: #dc3545 !important;
}

.text-danger:hover {
  background-color: #fee2e2 !important;
}

@media (max-width: 992px) {
  .topbar-left {
    gap: 0;
  }
  .topbar-link {
    font-size: 10px;
    padding: 4px 8px;
  }
}

@media (max-width: 768px) {
  .topbar-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 4px 10px;
  }
  .topbar-left {
    justify-content: center;
    flex-wrap: wrap;
    gap: 2px;
  }
  .topbar-link {
    font-size: 9px;
    padding: 3px 6px;
  }
  .topbar-right {
    justify-content: center;
  }
  .user-name {
    font-size: 11px;
  }
  .user-avatar {
    width: 22px;
    height: 22px;
  }
  .login-popup-wrapper {
    min-width: 260px;
    right: -10px;
  }
}

@media (max-width: 480px) {
  .topbar-link {
    font-size: 8px;
    padding: 2px 4px;
  }
  .topbar-left {
    gap: 0;
  }
  .topbar-right {
    gap: 6px;
  }
  .user-name {
    font-size: 10px;
  }
  .login-popup-wrapper {
    min-width: 220px;
    right: -5px;
  }
}
</style>