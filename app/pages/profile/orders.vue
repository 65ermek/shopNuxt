<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1 class="profile-title">📦 Moje objednávky</h1>

      <div v-if="isLoading" class="profile-loading">
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
            <NuxtLink to="/profile" class="nav-link">
              <span class="nav-icon">👤</span>
              Můj účet
            </NuxtLink>
            <NuxtLink to="/profile/orders" class="nav-link active">
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

        <!-- Правая колонка: Список objednávek -->
        <div class="profile-main">
          <div v-if="orders.length === 0" class="empty-orders">
            <div class="empty-icon">📭</div>
            <h3>Zatím nemáte žádné objednávky</h3>
            <p>Prohlédněte si naši nabídku a vytvořte svou první objednávku.</p>
            <NuxtLink to="/" class="btn-shop">Pokračovat v nákupu</NuxtLink>
          </div>

          <div v-else class="orders-list">
            <div
                v-for="order in orders"
                :key="order.id"
                class="order-card"
            >
              <div class="order-header">
                <div class="order-number">
                  <span class="order-label">Objednávka:</span>
                  <span class="order-value">#{{ order.order_number }}</span>
                </div>
                <div class="order-date">
                  <span class="order-label">Datum:</span>
                  <span class="order-value">{{ formatDate(order.created_at) }}</span>
                </div>
                <div class="order-status">
                  <span class="status-badge" :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
              </div>

              <div class="order-items">
                <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="order-item"
                >
                  <img
                      :src="getProductImage(item)"
                      :alt="item.product_name"
                      class="order-item-image"
                      @error="handleImageError"
                  />
                  <div class="order-item-info">
                    <div class="order-item-name">{{ item.product_name }}</div>
                    <div class="order-item-meta">
                      {{ item.quantity }} × {{ formatPrice(item.price) }} Kč
                    </div>
                  </div>
                  <div class="order-item-total">
                    {{ formatPrice(item.total) }} Kč
                  </div>
                </div>
              </div>

              <div class="order-footer">
                <div class="order-total">
                  <span class="order-label">Celkem:</span>
                  <span class="order-total-price">{{ formatPrice(order.total) }} Kč</span>
                </div>
                <div class="order-payment">
                  <span class="order-label">Platba:</span>
                  <span class="order-value">{{ getPaymentMethodText(order.payment_method) }}</span>
                </div>
                <NuxtLink :to="`/profile/order/${order.id}`" class="btn-detail">
                  Zobrazit detail →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useToastStore } from '~/stores/toastStore'

const authStore = useAuthStore()
const toastStore = useToastStore()

const isLoading = ref(false)
const orders = ref([])
const userAvatar = ref('/avatars/default.png')

const handleAvatarError = (e) => {
  e.target.src = '/avatars/default.png'
}

const handleImageError = (e) => {
  e.target.src = '/images/no-image.png'
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0,00'
  }
  return parseFloat(price).toLocaleString('cs-CZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getStatusText = (status) => {
  const map = {
    'new': 'Nový',
    'processing': 'Zpracovává se',
    'shipped': 'Odesláno',
    'delivered': 'Doručeno',
    'cancelled': 'Zrušeno',
    'refunded': 'Vráceno'
  }
  return map[status] || status
}

const getStatusClass = (status) => {
  const map = {
    'new': 'status-new',
    'processing': 'status-processing',
    'shipped': 'status-shipped',
    'delivered': 'status-delivered',
    'cancelled': 'status-cancelled',
    'refunded': 'status-refunded'
  }
  return map[status] || 'status-new'
}

const getPaymentMethodText = (method) => {
  const map = {
    'dobirka': 'Platba dobírkou',
    'bank-transfer': 'Bankovní převod',
    'qr-payment': 'QR kód',
    'card': 'Platební karta'
  }
  return map[method] || method
}

const getProductImage = (item) => {
  if (item.product_image) {
    return `https://obchod.tanatar.cz/${item.product_image}`
  }
  return '/images/no-image.png'
}

const loadOrders = async () => {
  isLoading.value = true
  try {
    const token = authStore.token
    const response = await fetch('https://obchod.tanatar.cz/api/orders', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      orders.value = data.data || []
    } else if (response.status === 401) {
      toastStore.warning('Přihlášení vypršelo', 'Prosím, přihlaste se znovu.')
      await authStore.logout()
      navigateTo('/login')
    } else {
      toastStore.error('Chyba', 'Nepodařilo se načíst objednávky.')
    }
  } catch (error) {
    toastStore.error('Chyba', 'Při načítání objednávek došlo k chybě.')
  } finally {
    isLoading.value = false
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
  if (authStore.customer?.avatar) {
    userAvatar.value = `https://obchod.tanatar.cz${authStore.customer.avatar}`
  }
  loadOrders()
})
</script>

<style scoped>
/* ===== ОБЩИЕ СТИЛИ ===== */
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

/* ===== ЛЕВАЯ КОЛОНКА (SIDEBAR) ===== */
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

/* ===== ОРДЕРА ===== */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.order-number {
  display: flex;
  align-items: center;
  gap: 6px;
}

.order-label {
  font-size: 13px;
  color: #6b7280;
}

.order-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-new { background: #dbeafe; color: #1e40af; }
.status-processing { background: #fef3c7; color: #92400e; }
.status-shipped { background: #d1fae5; color: #065f46; }
.status-delivered { background: #d1fae5; color: #065f46; }
.status-cancelled { background: #fee2e2; color: #991b1b; }
.status-refunded { background: #e5e7eb; color: #4b5563; }

.order-items {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 0;
}

.order-item-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
  background: #f8f9fa;
  flex-shrink: 0;
}

.order-item-info {
  flex: 1;
}

.order-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.order-item-meta {
  font-size: 12px;
  color: #6b7280;
}

.order-item-total {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.order-total-price {
  font-size: 18px;
  font-weight: 700;
  color: #e11d48;
}

.btn-detail {
  color: #e11d48;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s;
}

.btn-detail:hover {
  color: #be123c;
  text-decoration: underline;
}

.empty-orders {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-orders h3 {
  font-size: 20px;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-orders p {
  color: #6b7280;
  margin-bottom: 20px;
}

.btn-shop {
  display: inline-block;
  padding: 12px 32px;
  background: #e11d48;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-shop:hover {
  background: #be123c;
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

  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-detail {
    text-align: center;
  }
}
</style>