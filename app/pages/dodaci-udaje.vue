<template>
  <div class="delivery-page">
    <CheckoutStepper :current-step="2" />

    <div class="delivery-container">
      <h1 class="delivery-title">📋 Dodací údaje</h1>

      <div class="delivery-grid">
        <!-- Левая колонка: Форма -->
        <div class="delivery-left">
          <form @submit.prevent="submitForm" class="delivery-form">
            <!-- Osobní údaje -->
            <div class="form-section">
              <h2 class="section-title">👤 Osobní údaje</h2>

              <div class="form-row">
                <div class="form-group">
                  <label for="firstName" class="form-label">Jméno *</label>
                  <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      class="form-input"
                      required
                      placeholder="Jan"
                  />
                </div>
                <div class="form-group">
                  <label for="lastName" class="form-label">Příjmení *</label>
                  <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      class="form-input"
                      required
                      placeholder="Novák"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">E-mail *</label>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    required
                    placeholder="jan.novak@email.cz"
                />
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Telefon *</label>
                <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    required
                    placeholder="+420 123 456 789"
                />
              </div>
            </div>

            <!-- Dodací adresa -->
            <div class="form-section">
              <h2 class="section-title">📍 Dodací adresa</h2>

              <div class="form-group">
                <label for="street" class="form-label">Ulice a číslo popisné *</label>
                <input
                    id="street"
                    v-model="form.street"
                    type="text"
                    class="form-input"
                    required
                    placeholder="Hlavní 123"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city" class="form-label">Město *</label>
                  <input
                      id="city"
                      v-model="form.city"
                      type="text"
                      class="form-input"
                      required
                      placeholder="Praha"
                  />
                </div>
                <div class="form-group">
                  <label for="postcode" class="form-label">PSČ *</label>
                  <input
                      id="postcode"
                      v-model="form.postcode"
                      type="text"
                      class="form-input"
                      required
                      placeholder="110 00"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="country" class="form-label">Země *</label>
                <select id="country" v-model="form.country" class="form-input" required>
                  <option value="">Vyberte zemi</option>
                  <option value="CZ">Česká republika</option>
                  <option value="SK">Slovensko</option>
                </select>
              </div>
            </div>

            <!-- Poznámka -->
            <div class="form-section">
              <h2 class="section-title">📝 Poznámka k objednávce</h2>

              <div class="form-group">
                <textarea
                    v-model="form.note"
                    class="form-textarea"
                    rows="3"
                    placeholder="Napište nám něco k objednávce..."
                ></textarea>
              </div>
            </div>

            <!-- Souhlas -->
            <div class="form-section">
              <div class="form-checkbox">
                <input
                    id="agreement"
                    v-model="form.agreement"
                    type="checkbox"
                    class="checkbox-input"
                    required
                />
                <label for="agreement" class="checkbox-label">
                  Souhlasím se <NuxtLink to="/obchodni-podminky" class="link">zpracováním osobních údajů</NuxtLink> a
                  <NuxtLink to="/obchodni-podminky" class="link">obchodními podmínkami</NuxtLink> *
                </label>
              </div>
            </div>

            <!-- Кнопки -->
            <div class="form-actions">
              <NuxtLink to="/doprava-a-platba" class="back-btn">
                ← zpět
              </NuxtLink>
              <button type="submit" class="submit-btn" :disabled="submitting">
                {{ submitting ? 'Odesílám...' : 'Pokračovat k rekapitulaci →' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Правая колонка: Souhrn objednávky -->
        <div class="delivery-right">
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
const submitting = ref(false)

// ============================================================
// 📌 ДАННЫЕ
// ============================================================

// Данные из предыдущих шагов (для примера)
const selectedShipping = ref('ppl')
const selectedPayment = ref('bank-transfer')

const shippingOptions = [
  { id: 'ppl', name: 'PPL', price: 165, free: 2500 },
  { id: 'ppl-parcelshop', name: 'PPL ParcelShop', price: 140, free: 2500 },
  { id: 'our-car', name: 'NAŠE AUTO - Kralupy nad Vltavou + Okolí do 60 km', price: 120, free: 1500 }
]

const paymentOptions = [
  { id: 'dobirka', name: 'Platba dobírkou', price: '35,09 Kč', price_value: 35.09 },
  { id: 'bank-transfer', name: 'Bankovním převodem', price: 'ZDARMA', price_value: 0 },
  { id: 'qr-payment', name: 'Okamžitá platba QR kódem', price: 'ZDARMA', price_value: 0 }
]

// ============================================================
// 📌 ФОРМА
// ============================================================

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  postcode: '',
  country: 'CZ',
  note: '',
  agreement: false
})

// ============================================================
// 📌 ГЕТТЕРЫ
// ============================================================

const cartItems = computed(() => {
  return cartStore.items.filter(item => item.type === 'cart')
})

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

const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0,00'
  }
  const num = parseFloat(price)
  if (isNaN(num)) return '0,00'
  return num.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleImageError = (e) => {
  e.target.src = '/images/no-image.png'
}

// ============================================================
// 📌 ОТПРАВКА ФОРМЫ
// ============================================================

const submitForm = async () => {
  if (!form.value.agreement) {
    alert('Pro pokračování musíte souhlasit se zpracováním osobních údajů.')
    return
  }

  submitting.value = true

  try {
    // Сохраняем данные в localStorage или store
    localStorage.setItem('deliveryData', JSON.stringify(form.value))

    console.log('📦 Dodací údaje:', form.value)

    // Переход на страницу rekapitulace
    navigateTo('/rekapitulace')

  } catch (error) {
    console.error('❌ Chyba při odesílání:', error)
  } finally {
    submitting.value = false
  }
}

// ============================================================
// 📌 ЗАГРУЗКА СОХРАНЕННЫХ ДАННЫХ
// ============================================================

onMounted(() => {
  cartStore.fetchCart()

  // Загружаем сохраненные данные
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('deliveryData')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        form.value = { ...form.value, ...data }
      } catch (e) {}
    }
  }
})

// ============================================================
// 📌 SEO
// ============================================================

useHead({
  title: 'Dodací údaje | New Idea',
  meta: [
    {
      name: 'description',
      content: 'Vyplňte dodací údaje pro vaši objednávku v internetovém obchodě New Idea.'
    }
  ]
})
</script>

<style scoped>
.delivery-page {
  max-width: 1270px;
  margin: 0 auto;
  padding: 20px 15px 60px;
}

.delivery-container {
  background: white;
  border-radius: 12px;
  padding: 24px 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.delivery-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.delivery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* ============================================================
   ЛЕВАЯ КОЛОНКА: ФОРМА
   ============================================================ */

.delivery-left {
  display: flex;
  flex-direction: column;
}

.delivery-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.form-input,
.form-textarea {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: border-color 0.2s;
  outline: none;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* ============================================================
   CHECKBOX
   ============================================================ */

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkbox-input {
  margin-top: 2px;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  cursor: pointer;
}

.checkbox-label {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.checkbox-label .link {
  color: #007bff;
  text-decoration: none;
}

.checkbox-label .link:hover {
  text-decoration: underline;
}

/* ============================================================
   КНОПКИ
   ============================================================ */

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  gap: 16px;
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

.submit-btn {
  padding: 12px 32px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* ============================================================
   ПРАВАЯ КОЛОНКА: SOUHRN
   ============================================================ */

.delivery-right {
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
   АДАПТИВНОСТЬ
   ============================================================ */

@media (max-width: 992px) {
  .delivery-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .order-summary {
    height: auto;
  }
}

@media (max-width: 768px) {
  .delivery-page {
    padding: 16px 10px 40px;
  }

  .delivery-container {
    padding: 16px;
  }

  .delivery-title {
    font-size: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-btn {
    width: 100%;
    text-align: center;
  }

  .back-btn {
    text-align: center;
    width: 100%;
  }

  .summary-item {
    flex-wrap: wrap;
  }

  .summary-item .item-price {
    padding-left: 52px;
  }
}

@media (max-width: 480px) {
  .delivery-container {
    padding: 12px;
  }

  .delivery-title {
    font-size: 18px;
  }

  .form-input,
  .form-textarea {
    font-size: 13px;
    padding: 8px 12px;
  }

  .summary-item-image {
    width: 32px;
    height: 32px;
  }

  .summary-item .item-name {
    font-size: 13px;
  }
}
</style>