<!-- pages/objednavka-uspesna.vue -->
<template>
  <div class="success-page">
    <div class="success-container">
      <div class="success-icon">✅</div>
      <h1 class="success-title">Objednávka byla úspěšně vytvořena!</h1>

      <div class="success-order-info">
        <p class="order-number">
          Číslo objednávky: <strong>{{ orderNumber }}</strong>
        </p>
        <p class="order-status">
          Stav: <span class="status-new">Nový</span>
        </p>
        <p class="order-email">
          Potvrzení bylo zasláno na e-mail: <strong>{{ orderEmail }}</strong>
        </p>
      </div>

      <div class="success-actions">
        <NuxtLink to="/" class="btn-home">
          Pokračovat v nákupu
        </NuxtLink>
        <NuxtLink
            v-if="isAuthenticated"
            to="/profile/orders"
            class="btn-order"
        >
          Moje objednávky
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'checkout'
})
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

const orderNumber = ref(route.query.order || '')
const orderEmail = ref('')

onMounted(() => {
  orderNumber.value = route.query.order || localStorage.getItem('lastOrderNumber') || ''
  orderEmail.value = route.query.email || localStorage.getItem('customerEmail') || ''

  if (!orderNumber.value) {
    navigateTo('/')
  }

  localStorage.removeItem('lastOrderNumber')
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
.success-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.success-container {
  max-width: 600px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  text-align: center;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

.success-order-info {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.order-number {
  font-size: 16px;
  margin: 0 0 8px 0;
}

.order-number strong {
  color: #e11d48;
}

.order-status {
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 4px 0;
}

.order-email {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
}

.status-new {
  color: #10b981;
  font-weight: 600;
}

.success-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-home {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  background: #e5e7eb;
  color: #1e293b;
}

.btn-home:hover {
  background: #d1d5db;
}

.btn-order {
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  background: #e11d48;
  color: white;
}

.btn-order:hover {
  background: #be123c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
}

@media (max-width: 640px) {
  .success-container {
    padding: 24px 16px;
  }

  .success-title {
    font-size: 20px;
  }

  .success-actions {
    flex-direction: column;
  }

  .btn-home,
  .btn-order {
    width: 100%;
    text-align: center;
  }
}
</style>