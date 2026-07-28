<!-- components/AddToCartPopup.vue -->
<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
          v-if="visible"
          class="popup-overlay"
          @click.self="handleClose"
      >
        <div class="popup-container">
          <!-- Заголовок -->
          <div class="popup-header">
            <div class="popup-success-icon">✅</div>
            <h2 class="popup-title">Zboží bylo přidáno do košíku</h2>
            <button class="popup-close" @click="handleClose">✕</button>
          </div>

          <!-- Информация о товаре -->
          <div class="popup-product">
            <img
                :src="productImage"
                :alt="productName"
                class="popup-product-image"
                loading="lazy"
                @error="handleImageError"
            />
            <div class="popup-product-info">
              <h3 class="popup-product-name">{{ productName }}</h3>
              <p class="popup-product-quantity">Množství: {{ quantity }} {{ unit }}</p>
              <div class="popup-product-prices">
                <span class="popup-product-price">{{ formatPrice(productPrice * quantity) }} Kč</span>
                <span class="popup-product-price-vat">{{ formatPrice(productPriceVat * quantity) }} Kč</span>
              </div>
              <div class="popup-product-prices-sub">
                <span class="popup-product-price-vat-sub">{{ formatPrice(productPrice * quantity) }} Kč</span>
              </div>
            </div>
          </div>

          <!-- Итог -->
          <div class="popup-total">
            <span class="popup-total-label">Celkem v košíku:</span>
            <span class="popup-total-price">{{ formatPrice(cartTotal) }} Kč</span>
          </div>

          <!-- Кнопки -->
          <div class="popup-actions">
            <NuxtLink to="/" class="popup-btn popup-btn-secondary" @click="handleClose">
              ← zpět do obchodu
            </NuxtLink>
            <NuxtLink to="/cart" class="popup-btn popup-btn-primary" @click="handleClose">
              Pokračovat do košíku →
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cartStore'

const cartStore = useCartStore()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    default: '/images/no-image.png'
  },
  productPrice: {
    type: Number,
    required: true
  },
  productPriceWithoutVat: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: 'ks'
  }
})

// ✅ Используем модель для двусторонней привязки
const emit = defineEmits(['update:visible', 'close'])

// ✅ Функция закрытия
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleImageError = (e) => {
  e.target.src = '/images/no-image.png'
}

const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0,00'
  }
  const num = parseFloat(price)
  if (isNaN(num)) return '0,00'
  return num.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const productPriceVat = computed(() => {
  return props.productPrice * 1.21 // 21% DPH
})

const cartTotal = computed(() => {
  return cartStore.cartTotal || 0
})
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.popup-container {
  background: white;
  border-radius: 16px;
  max-width: 540px;
  width: 100%;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  position: relative;
}

.popup-success-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.popup-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.popup-close {
  background: none;
  border: none;
  font-size: 22px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
  line-height: 1;
}

.popup-close:hover {
  color: #1e293b;
}

.popup-product {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 16px;
}

.popup-product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  background: #f1f5f9;
}

.popup-product-info {
  flex: 1;
  min-width: 0;
}

.popup-product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.popup-product-quantity {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.popup-product-prices {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.popup-product-price {
  font-size: 18px;
  font-weight: 700;
  color: #e11d48;
}

.popup-product-price-vat {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.popup-product-prices-sub {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.popup-product-price-sub {
  font-size: 13px;
  color: #6b7280;
}

.popup-product-price-vat-sub {
  font-size: 13px;
  color: #6b7280;
}

.popup-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-top: 2px solid #e5e7eb;
  margin-bottom: 20px;
}

.popup-total-label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.popup-total-price {
  font-size: 20px;
  font-weight: 700;
  color: #e11d48;
}

.popup-actions {
  display: flex;
  gap: 12px;
}

.popup-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
}

.popup-btn-secondary {
  background: #f1f5f9;
  color: #1e293b;
}

.popup-btn-secondary:hover {
  background: #e2e8f0;
  text-decoration: none;
  color: #1e293b;
}

.popup-btn-primary {
  background: #e11d48;
  color: white;
}

.popup-btn-primary:hover {
  background: #be123c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
  text-decoration: none;
  color: white;
}

@media (max-width: 640px) {
  .popup-container {
    padding: 20px;
    margin: 10px;
  }

  .popup-product {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .popup-product-image {
    width: 120px;
    height: 120px;
  }

  .popup-product-prices {
    justify-content: center;
  }

  .popup-product-prices-sub {
    justify-content: center;
  }

  .popup-actions {
    flex-direction: column;
  }

  .popup-title {
    font-size: 16px;
  }
}
</style>