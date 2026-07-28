<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1 class="profile-title">👤 Můj účet</h1>

      <div v-if="authStore.isLoading" class="profile-loading">
        <div class="loader">Načítání...</div>
      </div>

      <div v-else class="profile-content">
        <!-- Левая колонка: Навигация -->
        <div class="profile-sidebar">
          <div class="profile-avatar">
            <img
                :src="userAvatar"
                alt="Avatar"
                class="avatar-image"
                @error="handleAvatarError"
            />
            <div class="avatar-name">{{ authStore.customer?.name || 'Uživatel' }}</div>
            <div class="avatar-email">{{ authStore.customer?.email || '' }}</div>
          </div>

          <nav class="profile-nav">
            <NuxtLink to="/profile" class="nav-link active">
              <span class="nav-icon">👤</span>
              Můj účet
            </NuxtLink>
            <NuxtLink to="/profile/orders" class="nav-link">
              <span class="nav-icon">📦</span>
              Moje objednávky
            </NuxtLink>
            <NuxtLink to="/profile/invoices" class="nav-link">
              <span class="nav-icon">📄</span>
              Moje faktury
            </NuxtLink>
          </nav>

          <button @click="handleLogout" class="btn-logout">
            🚪 Odhlásit se
          </button>
        </div>

        <!-- Правая колонка: Данные профиля -->
        <div class="profile-main">
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-title">Osobní údaje</h2>
              <button class="btn-edit" @click="toggleEditMode">
                {{ isEditing ? 'Zrušit' : 'Upravit' }}
              </button>
            </div>

            <!-- Режим просмотра -->
            <div v-if="!isEditing" class="info-grid">
              <div class="info-item">
                <span class="info-label">Jméno a příjmení:</span>
                <span class="info-value">{{ authStore.customer?.name || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">E-mail:</span>
                <span class="info-value">{{ authStore.customer?.email || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Telefon:</span>
                <span class="info-value">{{ authStore.customer?.phone || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Adresa:</span>
                <span class="info-value">{{ customerAddress || 'Neznámé' }}</span>
              </div>
              <div v-if="authStore.customer?.company_name" class="info-item">
                <span class="info-label">Firma:</span>
                <span class="info-value">{{ authStore.customer.company_name }}</span>
              </div>
              <div v-if="authStore.customer?.ico" class="info-item">
                <span class="info-label">IČO:</span>
                <span class="info-value">{{ authStore.customer.ico }}</span>
              </div>
              <div v-if="authStore.customer?.dic" class="info-item">
                <span class="info-label">DIČ:</span>
                <span class="info-value">{{ authStore.customer.dic }}</span>
              </div>
            </div>

            <!-- Режим редактирования -->
            <div v-else class="edit-form">
              <div class="form-group">
                <label class="form-label">Jméno a příjmení *</label>
                <input v-model="editForm.name" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Telefon *</label>
                <input v-model="editForm.phone" type="tel" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Ulice a číslo popisné</label>
                <input v-model="editForm.street" type="text" class="form-input" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Město</label>
                  <input v-model="editForm.city" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">PSČ</label>
                  <input v-model="editForm.postcode" type="text" class="form-input" />
                </div>
              </div>
              <div v-if="authStore.customer?.company_name" class="form-group">
                <label class="form-label">Název firmy</label>
                <input v-model="editForm.company_name" type="text" class="form-input" />
              </div>
              <div class="form-actions">
                <button class="btn-save" @click="saveProfile" :disabled="isSaving">
                  {{ isSaving ? 'Ukládám...' : 'Uložit změny' }}
                </button>
                <button class="btn-cancel" @click="cancelEdit">Zrušit</button>
              </div>
            </div>
          </div>

          <!-- ✅ ИСПРАВЛЕНАЯ ФОРМА СМЕНЫ ПАРОЛЯ -->
          <div class="profile-section">
            <h2 class="section-title">🔑 Změna hesla</h2>

            <div class="password-form">
              <div class="form-group">
                <label class="form-label">Současné heslo *</label>
                <input v-model="passwordForm.current_password" type="password" class="form-input" placeholder="Zadejte současné heslo" />
              </div>
              <div class="form-group">
                <label class="form-label">Nové heslo *</label>
                <input v-model="passwordForm.new_password" type="password" class="form-input" placeholder="Zadejte nové heslo" />
              </div>
              <div class="form-group">
                <label class="form-label">Potvrzení hesla *</label>
                <input v-model="passwordForm.confirm_password" type="password" class="form-input" placeholder="Potvrďte nové heslo" />
              </div>
              <button class="btn-change-password" @click="changePassword" :disabled="isChangingPassword">
                {{ isChangingPassword ? 'Zpracovávám...' : 'Změnit heslo' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'auth'})

import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useToastStore } from '~/stores/toastStore'

const authStore = useAuthStore()
const toastStore = useToastStore()

const isSaving = ref(false)
const isChangingPassword = ref(false)
const isEditing = ref(false)

const userAvatar = ref('/avatars/default.png')

// Форма редактирования
const editForm = ref({
  name: '',
  phone: '',
  street: '',
  city: '',
  postcode: '',
  company_name: '',
})

// ✅ ИСПРАВЛЕНАЯ ФОРМА СМЕНЫ ПАРОЛЯ
const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

const customerAddress = computed(() => {
  const data = authStore.customer
  if (!data) return ''
  const parts = []
  if (data.street) parts.push(data.street)
  if (data.city) parts.push(data.city)
  if (data.postcode) parts.push(data.postcode)
  return parts.join(', ') || 'Neznámé'
})

const handleAvatarError = (e) => {
  e.target.src = '/avatars/default.png'
}

const loadCustomerData = () => {
  if (authStore.isAuthenticated && authStore.customer) {
    editForm.value = {
      name: authStore.customer.name || '',
      phone: authStore.customer.phone || '',
      street: authStore.customer.street || '',
      city: authStore.customer.city || '',
      postcode: authStore.customer.postcode || '',
      company_name: authStore.customer.company_name || '',
    }

    if (authStore.customer.avatar) {
      userAvatar.value = `https://obchod.tanatar.cz${authStore.customer.avatar}`
    } else {
      userAvatar.value = '/avatars/default.png'
    }
  }
}

const toggleEditMode = () => {
  if (isEditing.value) {
    cancelEdit()
  } else {
    isEditing.value = true
  }
}

const cancelEdit = () => {
  isEditing.value = false
  if (authStore.customer) {
    editForm.value = {
      name: authStore.customer.name || '',
      phone: authStore.customer.phone || '',
      street: authStore.customer.street || '',
      city: authStore.customer.city || '',
      postcode: authStore.customer.postcode || '',
      company_name: authStore.customer.company_name || '',
    }
  }
}

const saveProfile = async () => {
  if (!editForm.value.name || !editForm.value.phone) {
    toastStore.warning('Chybí údaje', 'Prosím, vyplňte jméno a telefon.')
    return
  }

  isSaving.value = true
  try {
    const token = authStore.token
    const response = await fetch('https://obchod.tanatar.cz/api/customers/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editForm.value)
    })

    const result = await response.json()

    if (response.ok) {
      const updatedCustomer = { ...authStore.customer, ...editForm.value }
      authStore.customer = updatedCustomer
      localStorage.setItem('customer', JSON.stringify(updatedCustomer))

      toastStore.success('✅ Údaje byly aktualizovány', 'Vaše údaje byly úspěšně uloženy.')
      isEditing.value = false
    } else {
      toastStore.error('Chyba', result.message || 'Nepodařilo se uložit údaje.')
    }
  } catch (error) {
    toastStore.error('Chyba', 'Při ukládání došlo k chybě.')
  } finally {
    isSaving.value = false
  }
}

// ✅ ИСПРАВЛЕННЫЙ МЕТОД СМЕНЫ ПАРОЛЯ
const changePassword = async () => {
  // Проверка заполнения всех полей
  if (!passwordForm.value.current_password) {
    toastStore.warning('Chybí heslo', 'Prosím, vyplňte současné heslo.')
    return
  }

  if (!passwordForm.value.new_password || !passwordForm.value.confirm_password) {
    toastStore.warning('Chybí heslo', 'Prosím, vyplňte obě pole s novým heslem.')
    return
  }

  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    toastStore.warning('Hesla se neshodují', 'Zadaná hesla musí být stejná.')
    return
  }

  if (passwordForm.value.new_password.length < 6) {
    toastStore.warning('Heslo je krátké', 'Heslo musí mít alespoň 6 znaků.')
    return
  }

  isChangingPassword.value = true
  try {
    const token = authStore.token
    const response = await fetch('https://obchod.tanatar.cz/api/customers/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        current_password: passwordForm.value.current_password,
        password: passwordForm.value.new_password,
        password_confirmation: passwordForm.value.confirm_password
      })
    })

    const result = await response.json()

    if (response.ok) {
      toastStore.success('✅ Heslo bylo změněno', 'Vaše heslo bylo úspěšně změněno.')
      passwordForm.value = { current_password: '', new_password: '', confirm_password: '' }
    } else {
      toastStore.error('Chyba', result.message || 'Nepodařilo se změnit heslo.')
    }
  } catch (error) {
    toastStore.error('Chyba', 'Při změně hesla došlo k chybě.')
  } finally {
    isChangingPassword.value = false
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    toastStore.success('Odhlášení', 'Byli jste úspěšně odhlášeni.')
    navigateTo('/')
  } catch (error) {
    toastStore.error('Chyba', 'Při odhlášení došlo k chybě.')
  }
}

onMounted(() => {
  loadCustomerData()
})
</script>

<style scoped>
/* ===== ВСЕ СТИЛИ ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ ===== */
.profile-page {
  max-width: 1270px;
  margin: 0 auto;
  padding: 40px 15px 60px;
}

.profile-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.profile-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 30px 0;
}

.profile-loading {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.profile-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

/* ===== ЛЕВАЯ КОЛОНКА ===== */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-avatar {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.avatar-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e11d48;
  margin-bottom: 12px;
}

.avatar-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.avatar-email {
  font-size: 14px;
  color: #6b7280;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #4b5563;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.nav-link.active {
  background: #fef2f2;
  color: #e11d48;
}

.nav-icon {
  font-size: 20px;
}

.btn-logout {
  padding: 12px 16px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #fee2e2;
}

/* ===== ПРАВАЯ КОЛОНКА ===== */
.profile-main {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.btn-edit {
  padding: 6px 16px;
  background: #e11d48;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-edit:hover {
  background: #be123c;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  color: #1e293b;
  font-weight: 500;
}

/* ===== ФОРМЫ ===== */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
}

.form-input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: border-color 0.2s;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #e11d48;
  box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-save {
  padding: 10px 24px;
  background: #e11d48;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #be123c;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 10px 24px;
  background: #f1f5f9;
  color: #4b5563;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.btn-change-password {
  padding: 10px 24px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
}

.btn-change-password:hover:not(:disabled) {
  background: #0f172a;
}

.btn-change-password:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 992px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 20px 10px 40px;
  }

  .profile-container {
    padding: 16px;
  }

  .profile-title {
    font-size: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    order: 2;
  }

  .profile-main {
    order: 1;
  }
}
</style>