<template>
  <div class="cart-page">
    <CheckoutStepper :current-step="0" />

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
      <!-- Шапка таблицы -->
      <div class="cart-header">
        <span class="cart-header-product">Produkt</span>
        <span class="cart-header-quantity">Množství</span>
        <span class="cart-header-price">Cena za jednotku</span>
        <span class="cart-header-total">Celkem</span>
        <span class="cart-header-remove"></span>
      </div>

      <!-- Список товаров -->
      <div class="cart-items">
        <div
            v-for="item in cartItems"
            :key="item?.id || Math.random()"
            class="cart-item"
        >
          <!-- Продукт -->
          <div class="cart-item-product">
            <div class="cart-item-image">
              <img
                  :src="getProductImage(item)"
                  :alt="getProductName(item)"
                  loading="lazy"
                  @error="handleImageError"
              />
            </div>
            <div class="cart-item-info">
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
            <div class="price-with-vat">{{ formatPrice(getProductPrice(item)) }} Kč</div>
            <div class="price-without-vat">{{ formatPrice(getProductPrice(item) / 1.21) }} Kč bez DPH</div>
          </div>

          <!-- Итого за позицию -->
          <div class="cart-item-total">
            <div class="total-with-vat">{{ formatPrice(getProductPrice(item) * (item.quantity || 1)) }} Kč</div>
            <div class="total-without-vat">{{ formatPrice((getProductPrice(item) * (item.quantity || 1)) / 1.21) }} Kč</div>
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
        <div class="summary-left">
          <div class="summary-row">
            <span>Celkem bez DPH:</span>
            <span>{{ formatPrice(cartTotalPriceWithoutVat) }} Kč</span>
          </div>
          <div class="summary-row summary-total">
            <span>Celkem včetně DPH:</span>
            <span>{{ formatPrice(cartTotalPrice) }} Kč</span>
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
            ← zpět do obchodu
          </NuxtLink>
          <NuxtLink to="/checkout" class="checkout-btn">
            Pokračovat v objednávce
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import ConfirmModal from "~/components/common/ConfirmModal.vue";

const cartStore = useCartStore()
const isRemoving = ref(false)
// ✅ Состояния модалки
const showModal = ref(false)
const modalItem = ref(null)
const modalItemName = ref('')
const cartItems = computed(() => cartStore.items)

// ✅ Отслеживаем изменения cartItems (для диагностики)
watch(cartItems, (newItems) => {
  if (newItems && newItems.length > 0) {
    console.log('📦 Данные корзины (обновлены):', newItems)
    console.log('🔍 Первый товар:', newItems[0])
  }
}, { immediate: true, deep: true })

const cartTotalPrice = computed(() => {
  if (!cartItems.value || !Array.isArray(cartItems.value)) return 0
  return cartItems.value.reduce((sum, item) => {
    const price = getProductPrice(item)
    const quantity = item?.quantity || 1
    return sum + (price * quantity)
  }, 0)
})

const cartTotalPriceWithoutVat = computed(() => {
  return cartTotalPrice.value / 1.21
})
// ✅ Открыть модалку подтверждения
const openRemoveModal = (item) => {
  modalItem.value = item
  modalItemName.value = getProductName(item) || 'tuto položku'
  showModal.value = true
}

// ✅ Закрыть модалку
const closeModal = () => {
  showModal.value = false
  modalItem.value = null
  modalItemName.value = ''
}

// ✅ Подтверждение удаления
const confirmRemove = async () => {
  if (!modalItem.value?.id || isRemoving.value) return

  isRemoving.value = true
  try {
    const currentType = modalItem.value.type || 'cart'
    await cartStore.removeItemWithMove(modalItem.value.id, currentType)
    closeModal()
  } catch (error) {
    console.error('Chyba při odstraňování položky:', error)
  } finally {
    isRemoving.value = false
  }
}
// ✅ Получение названия товара
const getProductName = (item) => {
  if (!item) return 'Neznámý produkt'
  if (item.name) return item.name
  if (item.product && item.product.name) return item.product.name
  if (item.product_name) return item.product_name
  return 'Neznámý produkt'
}

// ✅ Получение slug товара
const getProductSlug = (item) => {
  if (!item) return '#'
  if (item.slug) return item.slug
  if (item.product && item.product.slug) return item.product.slug
  return '#'
}

// ✅ Получение цены
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

const updateQuantity = (cartItemId, quantity) => {
  if (!cartItemId) return
  if (quantity <= 0) {
    cartStore.removeItem(cartItemId)
  } else {
    cartStore.updateQuantity(cartItemId, quantity)
  }
}

const removeItem = async (cartItemId) => {
  if (!cartItemId || isRemoving.value) return

  isRemoving.value = true
  try {
    await cartStore.removeItem(cartItemId)
  } catch (error) {
    console.error('Chyba při odstraňování položky:', error)
  } finally {
    isRemoving.value = false
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
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.cart-empty-btn:hover {
  background-color: #0056b3;
}

/* ===== ШАПКА ТАБЛИЦЫ ===== */
.cart-header {
  display: grid;
  grid-template-columns: 3fr 1fr 1.2fr 1fr 40px;
  gap: 16px;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 16px;
  align-items: center;
}

.cart-header-product {
  grid-column: 1 / 2;
}

.cart-header-quantity {
  grid-column: 2 / 3;
  text-align: center;
}

.cart-header-price {
  grid-column: 3 / 4;
  text-align: right;
}

.cart-header-total {
  grid-column: 4 / 5;
  text-align: right;
}

.cart-header-remove {
  grid-column: 5 / 6;
}

/* ===== ТОВАРЫ ===== */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: grid;
  grid-template-columns: 3fr 1fr 1.2fr 1fr 40px;
  gap: 16px;
  align-items: center;
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: box-shadow 0.2s;
}

.cart-item:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

/* ===== ПРОДУКТ ===== */
.cart-item-product {
  display: flex;
  align-items: center;
  gap: 16px;
  grid-column: 1 / 2;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: #f8f9fa;
  flex-shrink: 0;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
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
}

.cart-item-name:hover {
  color: #007bff;
}

/* ===== КОЛИЧЕСТВО ===== */
.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  grid-column: 2 / 3;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
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
  border-color: #007bff;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  font-size: 15px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

/* ===== ЦЕНЫ ===== */
.cart-item-price {
  grid-column: 3 / 4;
  text-align: right;
}

.price-with-vat {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.price-without-vat {
  font-size: 12px;
  color: #94a3b8;
}

.cart-item-total {
  grid-column: 4 / 5;
  text-align: right;
}

.total-with-vat {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.total-without-vat {
  font-size: 12px;
  color: #94a3b8;
}

/* ===== КНОПКА УДАЛЕНИЯ ===== */
.cart-item-remove {
  grid-column: 5 / 6;
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
  padding: 0;
  justify-self: center;
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
  padding: 20px 24px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.summary-left {
  display: flex;
  gap: 24px;
  align-items: baseline;
  flex-wrap: wrap;
}

.summary-row {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #4b5563;
}

.summary-total {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.summary-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.continue-shopping {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.continue-shopping:hover {
  color: #1e293b;
}

.checkout-btn {
  display: inline-block;
  padding: 12px 32px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.checkout-btn:hover {
  background-color: #0056b3;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 992px) {
  .cart-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
    position: relative;
  }

  .cart-item-product {
    grid-column: 1 / 2;
    padding-right: 40px;
  }

  .cart-item-quantity {
    grid-column: 1 / 2;
    justify-content: flex-start;
  }

  .cart-item-price {
    grid-column: 1 / 2;
    text-align: left;
    display: flex;
    gap: 16px;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .cart-item-total {
    grid-column: 1 / 2;
    text-align: left;
    display: flex;
    gap: 16px;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .cart-item-remove {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 28px;
    height: 28px;
    font-size: 14px;
    grid-column: auto;
    justify-self: auto;
  }

  .cart-summary {
    flex-direction: column;
    align-items: stretch;
    padding: 16px 20px;
  }

  .summary-left {
    justify-content: space-between;
  }

  .summary-actions {
    flex-direction: column;
    width: 100%;
  }

  .checkout-btn {
    width: 100%;
    text-align: center;
  }

  .continue-shopping {
    text-align: center;
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
    width: 50px;
    height: 50px;
  }

  .cart-item-name {
    font-size: 13px;
  }

  .qty-btn {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  .summary-left {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .summary-total {
    font-size: 16px;
  }

  .cart-item-product {
    padding-right: 32px;
  }

  .cart-item-remove {
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
}
</style>