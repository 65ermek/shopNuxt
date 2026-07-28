<template>
  <div class="profile-page">
    <div class="profile-container">
      <h1 class="profile-title">📄 Moje faktury</h1>

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
            <NuxtLink to="/profile/orders" class="nav-link">
              <span class="nav-icon">📦</span>
              Moje objednávky
            </NuxtLink>
            <NuxtLink to="/profile/invoices" class="nav-link active">
              <span class="nav-icon">📄</span>
              Moje faktury
            </NuxtLink>
          </nav>

          <button @click="handleLogout" class="btn-logout">
            🚪 Odhlásit se
          </button>
        </div>

        <!-- Правая колонка: Список faktur -->
        <div class="profile-main">
          <div v-if="orders.length === 0" class="empty-invoices">
            <div class="empty-icon">📭</div>
            <h3>Zatím nemáte žádné faktury</h3>
            <p>Faktury se generují automaticky po vytvoření objednávky.</p>
            <NuxtLink to="/" class="btn-shop">Pokračovat v nákupu</NuxtLink>
          </div>

          <div v-else class="invoices-list">
            <div
                v-for="order in orders"
                :key="order.id"
                class="invoice-card"
            >
              <div class="invoice-header">
                <div>
                  <div class="invoice-number">Faktura #{{ order.order_number }}</div>
                  <div class="invoice-date">Datum vystavení: {{ formatDate(order.invoice_issued_at || order.created_at) }}</div>
                  <div class="invoice-due">Datum splatnosti: {{ formatDate(order.invoice_due_date || order.created_at) }}</div>
                </div>
                <div class="invoice-status">
                  <span class="status-badge" :class="getPaymentStatusClass(order.payment_status)">
                    {{ getPaymentStatusText(order.payment_status) }}
                  </span>
                </div>
              </div>

              <div class="invoice-items">
                <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="invoice-item"
                >
                  <span class="invoice-item-name">{{ item.product_name }}</span>
                  <span class="invoice-item-meta">{{ item.quantity }} × {{ formatPrice(item.price) }} Kč</span>
                  <span class="invoice-item-price">{{ formatPrice(item.total) }} Kč</span>
                </div>
              </div>

              <div class="invoice-footer">
                <div class="invoice-total">
                  <span class="invoice-total-label">Celkem:</span>
                  <span class="invoice-total-price">{{ formatPrice(order.total) }} Kč</span>
                </div>
                <div class="invoice-actions">
                  <a
                      :href="`/admin/orders/${order.id}/invoice-view`"
                      target="_blank"
                      class="btn-pdf"
                  >
                    📄 Zobrazit fakturu
                  </a>
                  <a
                      :href="`/admin/orders/${order.id}/invoice-pdf`"
                      target="_blank"
                      class="btn-download"
                  >
                    📥 Stáhnout PDF
                  </a>
                </div>
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

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
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

const getPaymentStatusText = (status) => {
  const map = {
    'pending': 'Čeká na platbu',
    'paid': 'Zaplaceno',
    'failed': 'Selhalo',
    'refunded': 'Vráceno'
  }
  return map[status] || status
}

const getPaymentStatusClass = (status) => {
  const map = {
    'pending': 'status-pending',
    'paid': 'status-paid',
    'failed': 'status-failed',
    'refunded': 'status-refunded'
  }
  return map[status] || 'status-pending'
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
      toastStore.error('Chyba', 'Nepodařilo se načíst faktury.')
    }
  } catch (error) {
    toastStore.error('Chyba', 'Při načítání faktur došlo k chybě.')
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

/* ===== ФАКТУРЫ ===== */
.invoices-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.invoice-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.invoice-number {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.invoice-date, .invoice-due {
  font-size: 13px;
  color: #6b7280;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending { background: #fef3c7; color: #92400e; }
.status-paid { background: #d1fae5; color: #065f46; }
.status-failed { background: #fee2e2; color: #991b1b; }
.status-refunded { background: #e5e7eb; color: #4b5563; }

.invoice-items {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.invoice-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 4px 0;
}

.invoice-item-name {
  color: #4b5563;
  flex: 1;
}

.invoice-item-meta {
  color: #6b7280;
  margin: 0 16px;
}

.invoice-item-price {
  font-weight: 600;
  color: #1e293b;
}

.invoice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.invoice-total {
  font-size: 16px;
}

.invoice-total-label {
  font-weight: 600;
  color: #4b5563;
}

.invoice-total-price {
  font-size: 18px;
  font-weight: 700;
  color: #e11d48;
}

.invoice-actions {
  display: flex;
  gap: 10px;
}

.btn-pdf, .btn-download {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-pdf {
  background: #1e293b;
  color: white;
}

.btn-pdf:hover {
  background: #0f172a;
}

.btn-download {
  background: #e11d48;
  color: white;
}

.btn-download:hover {
  background: #be123c;
}

.empty-invoices {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-invoices h3 {
  font-size: 20px;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-invoices p {
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

  .invoice-header {
    flex-direction: column;
  }

  .invoice-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .invoice-actions {
    flex-direction: column;
  }

  .btn-pdf, .btn-download {
    text-align: center;
  }
}
</style>