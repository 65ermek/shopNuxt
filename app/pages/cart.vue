<!-- pages/cart/index.vue -->
<template>
  <div class="cart-page">
    <CheckoutStepper :current-step="1" />

    <h1 class="cart-page-title">Nákupní košík</h1>

    <!-- Пустая корзина -->
    <div v-if="!cartItems || cartItems.length === 0" class="cart-empty">
      <div class="cart-empty-icon">🛒</div>
      <h2>Váš košík je prázdný</h2>
      <p>Prohlédněte si naši nabídku a přidejte něco do košíku.</p>
      <NuxtLink to="/" class="cart-empty-btn">Pokračovat v nákupu</NuxtLink>
    </div>

    <!-- Корзина с товарами -->
    <div v-else class="cart-content">
      <!-- Список товаров -->
      <div class="cart-items">
        <div
            v-for="item in cartItems"
            :key="item?.id || Math.random()"
            class="cart-item"
        >
          <div class="cart-item-main">
            <!-- Информация о товаре -->
            <div class="cart-item-info">
              <div class="cart-item-image">
                <img
                    :src="getProductImage(item)"
                    :alt="getProductName(item)"
                    loading="lazy"
                    @error="handleImageError"
                />
              </div>
              <div class="cart-item-details">
                <NuxtLink :to="`/produkt/${getProductSlug(item)}`" class="cart-item-name">
                  {{ getProductName(item) }}
                </NuxtLink>
              </div>
            </div>

            <!-- Количество -->
            <div class="cart-item-quantity">
              <button
                  class="qty-btn"
                  @click="updateQuantity(item.id, (item.quantity || 1) - 1)"
                  :disabled="(item.quantity || 1) <= 1"
              >
                −
              </button>
              <span class="qty-value">{{ item.quantity || 1 }}</span>
              <button
                  class="qty-btn"
                  @click="updateQuantity(item.id, (item.quantity || 1) + 1)"
              >
                +
              </button>
            </div>

            <!-- Цена за единицу -->
            <div class="cart-item-price">
              <div class="price-value">{{ formatPrice(getProductPrice(item)) }} Kč / ks</div>
            </div>

            <!-- Итого за позицию -->
            <div class="cart-item-total">
              <div class="total-value">{{ formatPrice(getProductPrice(item) * (item.quantity || 1)) }} Kč</div>
            </div>
          </div>

          <!-- Кнопка удаления -->
          <button
              class="cart-item-remove"
              @click="openRemoveModal(item)"
              :disabled="isRemoving"
              aria-label="Odebrat z košíku"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Итоговая панель -->
      <div class="cart-summary">
        <!-- Блок с итоговой ценой -->
        <div class="summary-price-block">
          <div class="summary-price-row">
            <span class="summary-price-label">Celková cena:</span>
            <span class="summary-price-value">{{ formatPrice(cartTotalPrice) }} Kč</span>
          </div>
        </div>

        <ConfirmModal
            :is-visible="showModal"
            :item-name="modalItemName"
            @confirm="confirmRemove"
            @cancel="closeModal"
        />

        <div class="summary-actions">
          <NuxtLink to="/" class="continue-shopping">
            ← Zpět do obchodu
          </NuxtLink>
          <NuxtLink to="/doprava-a-platba" class="checkout-btn">
            Pokračovat v objednávce
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'checkout' })
import { computed, onMounted, ref } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import ConfirmModal from "~/components/common/ConfirmModal.vue"
import CheckoutStepper from '~/components/CheckoutStepper.vue'

const cartStore = useCartStore()
const isRemoving = ref(false)

// Состояния модалки
const showModal = ref(false)
const modalItem = ref(null)
const modalItemName = ref('')

const cartItems = computed(() => {
  return cartStore.items.filter(item => item.type === 'cart')
})

// Общая сумма
const cartTotalPrice = computed(() => {
  if (!cartItems.value || !Array.isArray(cartItems.value)) return 0
  return cartItems.value.reduce((sum, item) => {
    const price = getProductPrice(item)
    const quantity = item?.quantity || 1
    return sum + (price * quantity)
  }, 0)
})

// Открыть модалку подтверждения
const openRemoveModal = (item) => {
  modalItem.value = item
  modalItemName.value = getProductName(item) || 'tuto položku'
  showModal.value = true
}

// Закрыть модалку
const closeModal = () => {
  showModal.value = false
  modalItem.value = null
  modalItemName.value = ''
}

// Подтверждение удаления
const confirmRemove = async () => {
  if (!modalItem.value?.id || isRemoving.value) return

  isRemoving.value = true
  try {
    await cartStore.removeItem(modalItem.value.id)
    closeModal()
  } catch (error) {
    console.error('Chyba při odstraňování položky:', error)
  } finally {
    isRemoving.value = false
  }
}

// Получение названия товара
const getProductName = (item) => {
  if (!item) return 'Neznámý produkt'
  if (item.name) return item.name
  if (item.product && item.product.name) return item.product.name
  if (item.product_name) return item.product_name
  return 'Neznámý produkt'
}

// Получение slug товара
const getProductSlug = (item) => {
  if (!item) return '#'
  if (item.slug) return item.slug
  if (item.product && item.product.slug) return item.product.slug
  return '#'
}

// Получение цены
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
  if (item.product_price !== undefined && item.product_price !== null) {
    const num = parseFloat(item.product_price)
    return isNaN(num) ? 0 : num
  }
  return 0
}

// Получение изображения
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

// Обновление количества
const updateQuantity = (cartItemId, quantity) => {
  if (!cartItemId) return
  if (quantity <= 0) {
    cartStore.removeItem(cartItemId)
  } else {
    cartStore.updateQuantity(cartItemId, quantity)
  }
}

onMounted(() => {
  cartStore.fetchCart()
})
</script>

<style scoped>
/* ===== ОБЩИЕ СТИЛИ ===== */
.cart-page {
  max-width: 1270px;
  margin: 0 auto;
  padding: 20px 15px 60px;
}

.cart-page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

/* ===== ПУСТАЯ КОРЗИНА ===== */
.cart-empty {
  text-align: center;
  padding: 60px 20px;
}

.cart-empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.cart-empty h2 {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 12px;
}

.cart-empty p {
  color: #6b7280;
  margin-bottom: 24px;
}

.cart-empty-btn {
  display: inline-block;
  padding: 12px 32px;
  background-color: #e11d48;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.cart-empty-btn:hover {
  background-color: #be123c;
}

/* ===== ТОВАРЫ ===== */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.cart-item {
  display: flex;
  align-items: stretch;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 20px;
  transition: background-color 0.2s;
  position: relative;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  background-color: #fafafa;
}

.cart-item-main {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 20px;
}

/* ===== ИНФОРМАЦИЯ О ТОВАРЕ ===== */
.cart-item-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 2;
  min-width: 0;
}

.cart-item-image {
  width: 70px;
  height: 70px;
  border-radius: 6px;
  overflow: hidden;
  background: #f8f9fa;
  flex-shrink: 0;
  border: 1px solid #f1f5f9;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
  min-width: 0;
}

.cart-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  text-decoration: none;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.cart-item-name:hover {
  color: #007bff;
}

/* ===== КОЛИЧЕСТВО ===== */
.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0.8;
  justify-content: center;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #e11d48;
  color: #e11d48;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  font-size: 15px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

/* ===== ЦЕНЫ ===== */
.cart-item-price {
  flex: 1.2;
  text-align: right;
}

.price-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.cart-item-total {
  flex: 1;
  text-align: right;
  padding-left: 10px;
}

.total-value {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

/* ===== КНОПКА УДАЛЕНИЯ ===== */
.cart-item-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 12px;
}

.cart-item-remove:hover:not(:disabled) {
  background-color: #fee2e2;
  color: #dc3545;
}

.cart-item-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== ИТОГОВАЯ ПАНЕЛЬ ===== */
.cart-summary {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Блок с итоговой ценой - светло-серый фон */
.summary-price-block {
  background: #f3f4f6;
  padding: 16px 24px;
  border-radius: 8px;
}
.summary-price-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

.summary-price-label {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.summary-price-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.summary-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.continue-shopping {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
  padding: 8px 12px;
}

.continue-shopping:hover {
  color: #1e293b;
}

.checkout-btn {
  display: inline-block;
  padding: 12px 32px;
  background-color: #6b7280;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.checkout-btn:hover {
  background-color: #007bff;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 992px) {
  .cart-item {
    padding: 16px;
  }

  .cart-item-main {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .cart-item-info {
    flex: 1;
  }

  .cart-item-quantity {
    flex: 1;
    justify-content: flex-start;
  }

  .cart-item-price {
    flex: 1;
    text-align: left;
    display: flex;
    gap: 16px;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .cart-item-total {
    flex: 1;
    text-align: left;
    display: flex;
    gap: 16px;
    align-items: baseline;
    flex-wrap: wrap;
    padding-left: 0;
  }

  .cart-item-remove {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .cart-summary {
    gap: 12px;
  }

  .summary-price-block {
    padding: 14px 20px;
  }

  .summary-price-label {
    font-size: 15px;
  }

  .summary-price-value {
    font-size: 18px;
  }

  .summary-actions {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }

  .checkout-btn {
    width: 100%;
    text-align: center;
  }

  .continue-shopping {
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 576px) {
  .cart-page {
    padding: 16px 10px 40px;
  }

  .cart-page-title {
    font-size: 20px;
  }

  .cart-item {
    padding: 12px;
  }

  .cart-item-image {
    width: 55px;
    height: 55px;
  }

  .cart-item-name {
    font-size: 13px;
  }

  .qty-btn {
    width: 26px;
    height: 26px;
    font-size: 14px;
  }

  .price-value {
    font-size: 13px;
  }

  .total-value {
    font-size: 14px;
  }

  .summary-price-block {
    padding: 12px 16px;
  }

  .summary-price-label {
    font-size: 14px;
  }

  .summary-price-value {
    font-size: 16px;
  }
}
</style>