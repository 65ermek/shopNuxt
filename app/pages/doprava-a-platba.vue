<template>
  <div class="shipping-page">
    <CheckoutStepper :current-step="1" />

    <div class="shipping-container">
      <h1 class="shipping-title">🚚 Doprava a platba</h1>

      <div class="shipping-grid">
        <!-- Левая колонка -->
        <div class="shipping-left">
          <!-- Способы доставки -->
          <div class="shipping-section">
            <h2 class="section-title">Zvolte způsob dopravy</h2>

            <div class="shipping-options">
              <div
                  v-for="option in shippingOptions"
                  :key="option.id"
                  class="shipping-option"
                  :class="{ selected: selectedShipping === option.id }"
                  @click="selectedShipping = option.id"
              >
                <div class="option-radio">
                  <div class="radio-circle">
                    <div v-if="selectedShipping === option.id" class="radio-dot"></div>
                  </div>
                </div>
                <div class="option-content">
                  <div class="option-header">
                    <span class="option-name">{{ option.name }}</span>
                    <span class="option-price">
                      {{ option.free && cartTotalPrice >= option.free ? 'ZDARMA' : option.price + ' Kč' }}
                    </span>
                  </div>
                  <p class="option-description">{{ option.description }}</p>
                  <span v-if="option.free" class="option-free">
                    Nad {{ option.free }} Kč doprava ZDARMA
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Способы оплаты -->
          <div class="shipping-section">
            <h2 class="section-title">Zvolte způsob platby</h2>

            <div class="payment-options">
              <div
                  v-for="option in paymentOptions"
                  :key="option.id"
                  class="payment-option"
                  :class="{ selected: selectedPayment === option.id }"
                  @click="selectedPayment = option.id"
              >
                <div class="option-radio">
                  <div class="radio-circle">
                    <div v-if="selectedPayment === option.id" class="radio-dot"></div>
                  </div>
                </div>
                <div class="option-content">
      <span class="option-name">
        <span v-if="option.id === 'qr-payment'" class="option-icon"></span>
        {{ option.name }}
      </span>
                  <span class="option-price">{{ option.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка -->
        <div class="shipping-right">
          <div class="order-summary">
            <h2 class="section-title">📋 Souhrn objednávky</h2>

            <div class="summary-items">
              <div
                  v-for="item in cartItems"
                  :key="item.id"
                  class="summary-item"
              >
                <div class="summary-item-left">
                  <img
                      :src="getProductImage(item)"
                      :alt="getProductName(item)"
                      class="summary-item-image"
                      loading="lazy"
                      @error="handleImageError"
                  />
                  <span class="item-name">{{ item.quantity }}x {{ getProductName(item) }}</span>
                </div>
                <span class="item-price">{{ formatPrice(getProductPrice(item) * item.quantity) }} Kč</span>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-totals">
              <div class="summary-row">
                <span>Cena zboží:</span>
                <span>{{ formatPrice(cartTotalPrice) }} Kč</span>
              </div>
              <div class="summary-row" v-if="selectedShippingOption">
                <span>Způsob dopravy:</span>
                <span>{{ formatPrice(shippingPrice) }} Kč</span>
              </div>
              <div class="summary-row" v-if="selectedPaymentOption && selectedPaymentOption.price_value > 0">
                <span>Způsob platby:</span>
                <span>{{ formatPrice(selectedPaymentOption.price_value) }} Kč</span>
              </div>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-final">
              <div class="summary-row summary-total">
                <span>Celková cena:</span>
                <span>{{ formatPrice(finalTotalPrice) }} Kč</span>
              </div>
            </div>

            <div class="summary-actions">
              <NuxtLink to="/cart" class="back-btn">
                ← zpět do košíku
              </NuxtLink>
              <NuxtLink
                  to="/dodaci-udaje"
                  class="next-btn"
                  :class="{ disabled: !selectedShipping || !selectedPayment }"
                  @click.prevent="!selectedShipping || !selectedPayment ? null : null"
              >
                Pokračovat v objednávce →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import CheckoutStepper from '~/components/CheckoutStepper.vue'

const cartStore = useCartStore()

// ============================================================
// 📌 ДАННЫЕ
// ============================================================

const shippingOptions = [
  {
    id: 'ppl',
    name: 'PPL',
    description: 'PPL',
    price: 165,
    free: 2500
  },
  {
    id: 'ppl-parcelshop',
    name: 'PPL ParcelShop',
    description: 'PPL ParcelShop',
    price: 140,
    free: 2500
  },
  {
    id: 'our-car',
    name: 'NAŠE AUTO - Kralupy nad Vltavou + Okolí do 60 km',
    description: 'Kralupy nad Vltavou, Mělník, Roudnice nad Labem, Praha, Kladno, Slaný, Litoměřice, Louny atd.',
    price: 120,
    free: 1500
  }
]

const paymentOptions = [
  {
    id: 'dobirka',
    name: 'Platba dobírkou',
    price: '35 Kč',
    price_value: 35
  },
  {
    id: 'bank-transfer',
    name: 'Bankovním převodem',
    price: 'ZDARMA',
    price_value: 0
  },
  {
    id: 'qr-payment',
    name: 'Okamžitá platba QR kódem',
    price: 'ZDARMA',
    price_value: 0
  }
]

// ============================================================
// 📌 СОСТОЯНИЯ
// ============================================================

const selectedShipping = ref(null)
const selectedPayment = ref(null)

// ============================================================
// 📌 ГЕТТЕРЫ
// ============================================================

const cartItems = computed(() => {
  return cartStore.items.filter(item => item.type === 'cart')
})
// ✅ Получение изображения
const getProductImage = (item) => {
  if (!item) return '/images/no-image.png'
  if (item.image) {
    return `https://obchod.tanatar.cz/${item.image}`
  }
  if (item.product && typeof item.product === 'object' && item.product.image) {
    return `https://obchod.tanatar.cz/${item.product.image}`
  }
  return '/images/no-image.png'
}

const handleImageError = (e) => {
  e.target.src = '/images/no-image.png'
}
const cartTotalPrice = computed(() => {
  if (!cartItems.value || !Array.isArray(cartItems.value)) return 0
  return cartItems.value.reduce((sum, item) => {
    const price = getProductPrice(item)
    const quantity = item?.quantity || 1
    return sum + (price * quantity)
  }, 0)
})

const selectedShippingOption = computed(() => {
  return shippingOptions.find(o => o.id === selectedShipping.value)
})

const selectedPaymentOption = computed(() => {
  return paymentOptions.find(o => o.id === selectedPayment.value)
})

const shippingPrice = computed(() => {
  if (!selectedShippingOption.value) return 0
  const total = cartTotalPrice.value
  if (selectedShippingOption.value.free && total >= selectedShippingOption.value.free) {
    return 0
  }
  return selectedShippingOption.value.price
})

const paymentPrice = computed(() => {
  if (!selectedPaymentOption.value) return 0
  return selectedPaymentOption.value.price_value || 0
})

const finalTotalPrice = computed(() => {
  return cartTotalPrice.value + shippingPrice.value + paymentPrice.value
})

// ============================================================
// 📌 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

const getProductName = (item) => {
  if (!item) return 'Neznámý produkt'
  if (item.name) return item.name
  if (item.product && item.product.name) return item.product.name
  return 'Neznámý produkt'
}

const getProductPrice = (item) => {
  if (!item) return 0
  if (item.price !== undefined && item.price !== null) {
    const num = parseFloat(item.price)
    return isNaN(num) ? 0 : num
  }
  if (item.product && typeof item.product === 'object' && item.product.price !== undefined && item.product.price !== null) {
    const num = parseFloat(item.product.price)
    return isNaN(num) ? 0 : num
  }
  return 0
}

const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0,00'
  }
  const num = parseFloat(price)
  if (isNaN(num)) return '0,00'
  return num.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(() => {
  cartStore.fetchCart()
})

useHead({
  title: 'Doprava a platba | New Idea',
  meta: [
    {
      name: 'description',
      content: 'Vyberte způsob dopravy a platby pro vaši objednávku v internetovém obchodě New Idea.'
    }
  ]
})
</script>

<style scoped>
.shipping-page {
  max-width: 1270px;
  margin: 0 auto;
  padding: 20px 15px 60px;
}

.shipping-container {
  background: white;
  border-radius: 12px;
  padding: 24px 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.shipping-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
}

/* ============================================================
   GRID: 2 КОЛОНКИ
   ============================================================ */

.shipping-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* ============================================================
   ЛЕВАЯ КОЛОНКА
   ============================================================ */

.shipping-left {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.shipping-section {
  /* пусто */
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

/* ============================================================
   СПОСОБЫ ДОСТАВКИ
   ============================================================ */

.shipping-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shipping-option {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.shipping-option:hover {
  border-color: #94a3b8;
}

.shipping-option.selected {
  border-color: #007bff;
  background: #f8faff;
}

.option-radio {
  padding-top: 2px;
  flex-shrink: 0;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.shipping-option.selected .radio-circle {
  border-color: #007bff;
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: #007bff;
  border-radius: 50%;
}

.option-content {
  flex: 1;
  min-width: 0;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.option-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.option-price {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
}

.option-description {
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 2px 0;
  line-height: 1.4;
}

.option-free {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

/* ============================================================
   СПОСОБЫ ОПЛАТЫ
   ============================================================ */

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.payment-option:hover {
  border-color: #94a3b8;
}

.payment-option.selected {
  border-color: #007bff;
  background: #f8faff;
}

.payment-option .option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.payment-option .option-name {
  font-size: 14px;
  font-weight: 500;
}

.payment-option .option-price {
  font-size: 14px;
  font-weight: 600;
}

/* ============================================================
   ПРАВАЯ КОЛОНКА: SOUHRN
   ============================================================ */

.shipping-right {
  display: flex;
  flex-direction: column;
}

.order-summary {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.order-summary .section-title {
  margin-top: 0;
}

.summary-items {
  flex: 1;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  gap: 12px;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.summary-item-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f8f9fa;
}

.summary-item .item-name {
  font-size: 14px;
  color: #4b5563;
  flex: 1;
  word-break: break-word;
}

.summary-item .item-price {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  flex-shrink: 0;
}

.summary-divider {
  border-top: 1px solid #e5e7eb;
  margin: 12px 0;
}

.summary-totals {
  margin-bottom: 4px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
  color: #4b5563;
}

.summary-final {
  margin-top: 4px;
}

.summary-final .summary-row {
  padding: 6px 0;
}

.summary-total {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  border-top: 2px solid #e5e7eb;
  margin-top: 4px;
  padding-top: 12px;
}

/* ============================================================
   КНОПКИ
   ============================================================ */

.summary-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  gap: 12px;
}

.back-btn {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #1e293b;
}

.next-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.next-btn:hover:not(.disabled) {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.next-btn.disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

/* ============================================================
   АДАПТИВНОСТЬ
   ============================================================ */

@media (max-width: 992px) {
  .shipping-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .order-summary {
    height: auto;
  }
}

@media (max-width: 768px) {
  .shipping-page {
    padding: 16px 10px 40px;
  }

  .shipping-container {
    padding: 16px;
  }

  .shipping-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 15px;
  }

  .shipping-option {
    padding: 12px 14px;
  }

  .option-name {
    font-size: 14px;
  }

  .option-price {
    font-size: 14px;
  }

  .option-description {
    font-size: 12px;
  }

  .payment-option {
    padding: 10px 14px;
  }

  .order-summary {
    padding: 16px;
  }

  .summary-actions {
    flex-direction: column;
  }

  .next-btn {
    width: 100%;
    text-align: center;
  }

  .back-btn {
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .shipping-container {
    padding: 12px;
  }

  .shipping-title {
    font-size: 18px;
  }

  .option-name {
    font-size: 13px;
  }

  .option-price {
    font-size: 13px;
  }

  .summary-item {
    font-size: 13px;
  }

  .summary-row {
    font-size: 13px;
  }

  .summary-total {
    font-size: 16px;
  }
}
</style>