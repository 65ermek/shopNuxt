<template>
  <div class="topbar">
    <div class="topbar-inner">
      <!-- Левая часть: ссылки (скрываются на мобильных) -->
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
            <a class="login-link" href="#" @click.prevent>PŘIHLÁŠENÍ</a>

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
// import LoginPopup from '~/components/common/LoginPopup.vue' // Автоимпорт

// Состояния
const showPopup = ref(false)
const isLoggedIn = ref(false)
const userName = ref('')
const userAvatar = ref('/images/default-avatar.png')
const isUserMenuOpen = ref(false)
const customerData = ref(null)
let closeTimeout = null

// Инициализация авторизации
const initAuth = () => {
  if (!import.meta.client) return
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

// Обработка входа мыши
const handleMouseEnter = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  showPopup.value = true
}

// Обработка выхода мыши с задержкой
const handleMouseLeave = () => {
  closeTimeout = setTimeout(() => {
    showPopup.value = false
    closeTimeout = null
  }, 500)
}

// Закрытие попапа
const closePopup = () => {
  showPopup.value = false
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

// Обработка успешного входа
const handleLogin = (data) => {
  if (!import.meta.client) return
  console.log('Přihlášení úspěšné:', data)
  isLoggedIn.value = true
  userName.value = data.customer.name || 'Uživatel'
  customerData.value = data.customer
  if (data.customer.avatar) {
    userAvatar.value = `https://obchod.tanatar.cz${data.customer.avatar}`
  }
  closePopup()
}

// Обработка ошибки аватара
const handleAvatarError = () => {
  userAvatar.value = '/images/default-avatar.png'
}

// Выход из аккаунта
const handleLogout = async () => {
  if (!import.meta.client) return
  const token = localStorage.getItem('token')
  if (token) {
    try {
      await fetch('https://obchod.tanatar.cz/api/customers/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Chyba při odhlášení:', error)
    }
  }
  localStorage.removeItem('token')
  localStorage.removeItem('customer')
  isLoggedIn.value = false
  userName.value = ''
  customerData.value = null
  isUserMenuOpen.value = false
  navigateTo('/')
}

// Переключение меню пользователя
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// Закрытие меню при клике вне
const handleClickOutside = (event) => {
  if (!import.meta.client) return
  const wrapper = document.querySelector('.user-menu-wrapper')
  if (wrapper && !wrapper.contains(event.target)) {
    isUserMenuOpen.value = false
  }
}

// Забытый пароль
const forgotPassword = () => {
  if (!import.meta.client) return
  alert('📧 Odkaz pro obnovení hesla bude zaslán na váš email.')
  closePopup()
}

// Переход на регистрацию
const goToRegister = () => {
  if (!import.meta.client) return
  navigateTo('/register')
}

onMounted(() => {
  if (!import.meta.client) return
  initAuth()
  document.addEventListener('click', handleClickOutside)
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
/* ===== ОБЩИЕ СТИЛИ ===== */
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

/* ===== ЛЕВАЯ ЧАСТЬ ===== */
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

/* ===== ПРАВАЯ ЧАСТЬ ===== */
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

.login-link {
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  color: #1e293b;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s;
  display: inline-block;
  cursor: pointer;
}

.login-link:hover {
  background-color: #e5e7eb;
}

.login-popup-wrapper {
  position: absolute;
  top: 100%;
  right: 0;
  padding-top: 5px;
  z-index: 9999;
  min-width: 280px;
}

/* ===== МЕНЮ ПОЛЬЗОВАТЕЛЯ ===== */
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

/* ===== АДАПТИВНОСТЬ ===== */
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