<template>
  <div class="topbar">
    <div class="topbar-inner">
      <!-- Левая часть -->
      <div class="topbar-left">
        <NuxtLink to="/obchodni-podminky" class="topbar-link" @click.prevent="blockLink">
          OBCHODNÍ PODMÍNKY
        </NuxtLink>
        <NuxtLink to="/jak-objednat" class="topbar-link" @click.prevent="blockLink">
          JAK OBJEDNAT
        </NuxtLink>
        <NuxtLink to="/pro-firmy-a-instituce" class="topbar-link" @click.prevent="blockLink">
          PRO FIRMY A INSTITUCE
        </NuxtLink>
        <NuxtLink to="/kontakt" class="topbar-link" @click.prevent="blockLink">
          KONTAKT
        </NuxtLink>
      </div>

      <!-- Правая часть -->
      <div class="topbar-right">
        <!-- Неавторизованный пользователь -->
        <div v-if="!isLoggedIn" class="login-area">
          <span class="user-icon">👤</span>
          <div
              class="login-wrapper"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
          >
            <a class="login-link" href="#" @click.prevent>PŘIHLÁŠENÍ</a>

            <ClientOnly>
              <div class="login-popup-wrapper">
                <LoginPopup
                    v-if="showPopup"
                    :is-visible="showPopup"
                    @close="closePopup"
                    @login="handleLogin"
                    @forgot-password="forgotPassword"
                    @register="goToRegister"
                />
              </div>
            </ClientOnly>
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
                @load="handleAvatarLoad"
            />
            <span class="user-name">{{ userName }}</span>
            <span class="chevron-icon" :class="{ rotate: isUserMenuOpen }">▼</span>
          </div>

          <div class="user-dropdown-menu" v-if="isUserMenuOpen" @click.stop>
            <NuxtLink to="/ucet" class="dropdown-item" @click.prevent="blockLink">
              👤 Můj účet
            </NuxtLink>
            <NuxtLink to="/objednavky" class="dropdown-item" @click.prevent="blockLink">
              📦 Moje objednávky
            </NuxtLink>
            <NuxtLink to="/faktury" class="dropdown-item" @click.prevent="blockLink">
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import LoginPopup from '~/components/common/LoginPopup.vue'

// Состояния
const showPopup = ref(false)
const isLoggedIn = ref(false)
const userName = ref('')
const userAvatar = ref('/images/default-avatar.png')
const isUserMenuOpen = ref(false)
const customerData = ref(null)
let closeTimeout = null

// ===== ИНИЦИАЛИЗАЦИЯ =====
const initAuth = () => {
  if (!import.meta.client) return

  try {
    const token = localStorage.getItem('token')
    const customer = localStorage.getItem('customer')

    // console.log('🔍 InitAuth - token:', token ? 'exists' : 'not found')
    // console.log('🔍 InitAuth - customer:', customer ? 'exists' : 'not found')

    if (token && customer) {
      const parsed = JSON.parse(customer)
      console.log('🔍 InitAuth - parsed customer:', parsed)

      isLoggedIn.value = true
      userName.value = parsed.name || 'Uživatel'
      customerData.value = parsed

      // Обработка аватара
      if (parsed.avatar) {
        if (parsed.avatar.startsWith('http')) {
          userAvatar.value = parsed.avatar
        } else {
          // Проверяем, не начинается ли уже с /
          const avatarPath = parsed.avatar.startsWith('/') ? parsed.avatar : `/${parsed.avatar}`
          userAvatar.value = `https://obchod.tanatar.cz${avatarPath}`
        }
        console.log('🔍 InitAuth - avatar URL:', userAvatar.value)
      } else {
        userAvatar.value = '/images/default-avatar.png'
      }
    }
  } catch (error) {
    console.error('❌ InitAuth error:', error)
    logout()
  }
}

// ===== ВЫХОД =====
const logout = () => {
  if (!import.meta.client) return

  console.log('🔓 Logout')
  isLoggedIn.value = false
  userName.value = ''
  userAvatar.value = '/images/default-avatar.png'
  customerData.value = null
  isUserMenuOpen.value = false

  localStorage.removeItem('token')
  localStorage.removeItem('customer')
}

// ===== ОБРАБОТЧИК ВХОДА =====
const handleLogin = (data) => {
  if (!import.meta.client) return

  console.log('✅ Přihlášení úspěšné:', data)
  console.log('📦 Customer data:', data.customer)
  console.log('🔑 Token:', data.token ? 'exists' : 'not found')

  // Сохраняем токен
  if (data.token) {
    localStorage.setItem('token', data.token)
    console.log('💾 Token saved to localStorage')
  }

  // Сохраняем данные пользователя
  if (data.customer) {
    localStorage.setItem('customer', JSON.stringify(data.customer))
    console.log('💾 Customer data saved to localStorage')

    isLoggedIn.value = true
    userName.value = data.customer.name || 'Uživatel'
    customerData.value = data.customer

    // Обработка аватара с проверкой
    if (data.customer.avatar) {
      try {
        let avatarUrl
        if (data.customer.avatar.startsWith('http')) {
          avatarUrl = data.customer.avatar
        } else {
          const avatarPath = data.customer.avatar.startsWith('/')
              ? data.customer.avatar
              : `/${data.customer.avatar}`
          avatarUrl = `https://obchod.tanatar.cz${avatarPath}`
        }
        userAvatar.value = avatarUrl
        console.log('🖼️ Avatar URL set to:', avatarUrl)
      } catch (error) {
        console.error('❌ Error setting avatar:', error)
        userAvatar.value = '/images/default-avatar.png'
      }
    } else {
      userAvatar.value = '/images/default-avatar.png'
    }
  }

  closePopup()
}

// ===== ВЫХОД ИЗ АККАУНТА =====
const handleLogout = async () => {
  if (!import.meta.client) return

  console.log('🚪 Logging out...')

  const token = localStorage.getItem('token')

  if (token) {
    try {
      const response = await fetch('https://obchod.tanatar.cz/api/customers/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      console.log('📡 Logout response:', response.status)
    } catch (error) {
      console.error('❌ Chyba při odhlášení:', error)
    }
  }

  logout()
  navigateTo('/')
}

// ===== ОСТАЛЬНЫЕ МЕТОДЫ =====
const handleMouseEnter = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  showPopup.value = true
}

const handleMouseLeave = () => {
  closeTimeout = setTimeout(() => {
    showPopup.value = false
    closeTimeout = null
  }, 300)
}

const closePopup = () => {
  showPopup.value = false
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

const handleClickOutside = (event) => {
  if (!import.meta.client) return

  const wrapper = document.querySelector('.login-wrapper')
  if (wrapper && !wrapper.contains(event.target)) {
    showPopup.value = false
  }

  const menu = document.querySelector('.user-dropdown-menu')
  const trigger = document.querySelector('.user-dropdown-trigger')
  if (menu && trigger) {
    const isClickOutside = !menu.contains(event.target) && !trigger.contains(event.target)
    if (isClickOutside) {
      isUserMenuOpen.value = false
    }
  }
}

const forgotPassword = () => {
  if (!import.meta.client) return
  alert('📧 Odkaz pro obnovení hesla bude zaslán na váš email.')
  closePopup()
}

const goToRegister = () => {
  if (!import.meta.client) return
  navigateTo('/register')
  closePopup()
}

// ===== ОБРАБОТКА АВАТАРА =====
const handleAvatarError = (event) => {
  console.warn('⚠️ Avatar load error, using default')
  userAvatar.value = '/images/default-avatar.png'
  // Предотвращаем бесконечный цикл
  event.target.src = '/images/default-avatar.png'
}

const handleAvatarLoad = (event) => {
  console.log('✅ Avatar loaded successfully', event.target)
}

// ===== ПЕРЕКЛЮЧЕНИЕ МЕНЮ =====
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// ===== ЖИЗНЕННЫЙ ЦИКЛ =====
onMounted(() => {
  if (!import.meta.client) return
  // console.log('🚀 TopBar mounted')
  initAuth()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  console.log('🛑 TopBar unmounting')
  document.removeEventListener('click', handleClickOutside)
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
})
</script>

<style scoped>
/* ===== Базовые стили ===== */
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

/* ===== Левая часть ===== */
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
  display: flex;
  align-items: center;
}

.topbar-link:hover {
  background-color: #e5e7eb;
}

/* ===== Правая часть ===== */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* ===== ЛОГИН ===== */
.login-area {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
}

.user-icon {
  font-size: 15px;
  color: #007bff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin-top: 1px;
}

.login-wrapper {
  position: relative;
  display: inline-block;
  align-items: center;
}

.login-link {
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  color: #1e293b;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  line-height: 1;
}

.login-link:hover {
  background-color: #e5e7eb;
}

.login-popup-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 9999;
  min-width: 280px;
  margin-top: 2px;
}

/* ===== Меню пользователя ===== */
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
  line-height: 1;
}

.chevron-icon {
  font-size: 10px;
  color: #6b7280;
  transition: transform 0.3s;
  line-height: 1;
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

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .topbar-left {
    gap: 0;
  }

  .topbar-link {
    font-size: 10px;
    padding: 4px 8px;
  }

  .login-link {
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

  .login-link {
    font-size: 10px;
    padding: 4px 10px;
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

  .login-link {
    font-size: 9px;
    padding: 3px 8px;
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