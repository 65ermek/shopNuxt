<template>
  <div class="cart-popup" :class="{ show: isVisible }">
    <!-- Пустая корзина -->
    <template v-if="!cartItems || cartItems.length === 0">
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p class="cart-empty-text">Nákupní košík je prázdný</p>
        <p class="cart-empty-contact">Potřebujete poradit? Neváhejte nás kontaktovat.</p>
        <a href="/kontakt" class="cart-empty-btn">Kontaktovat</a>
      </div>
    </template>

    <!-- Корзина с товарами -->
    <template v-else>
      <div class="cart-popup-title">V nákupním košíku máte:</div>
      <div class="cart-popup-items">
        <div v-for="item in cartItems" :key="item?.id || Math.random()" class="cart-popup-item">
          <div class="cart-item-image">
            <img
                :src="getProductImage(item)"
                :alt="getProductName(item)"
                loading="lazy"
                @error="handleImageError"
            />
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">{{ getProductName(item) }}</div>
            <div class="cart-item-price">{{ formatPrice(getProductPrice(item)) }} Kč/{{ item?.unit || 'ks' }}</div>
          </div>
          <button
              class="cart-item-remove"
              @click.stop="removeItem(item.id)"
              aria-label="Odebrat z košíku"
              :disabled="isRemoving"
          >
            ✕
          </button>
        </div>
      </div>
      <div class="cart-popup-total">
        <div class="cart-total-row">
          <span>Celková cena bez DPH:</span>
          <span>{{ formatPrice(cartTotalPriceWithoutVat) }} Kč</span>
        </div>
        <div class="cart-total-row total">
          <span>Celková cena:</span>
          <span>{{ formatPrice(cartTotalPrice) }} Kč</span>
        </div>
      </div>
      <a href="/cart" class="cart-popup-btn">Přejít do košíku</a>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCartStore } from '~/stores/cartStore'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  cartItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'item-removed'])

const cartStore = useCartStore()
const isRemoving = ref(false)

// ✅ Получение названия товара
const getProductName = (item) => {
  if (!item) return 'Neznámý produkt'
  if (item.name) return item.name
  if (item.product && item.product.name) return item.product.name
  if (item.product_name) return item.product_name
  return 'Neznámý produkt'
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

// ✅ Форматирование цены
const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0,00'
  }
  const num = parseFloat(price)
  if (isNaN(num)) return '0,00'
  return num.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ✅ Обработчик ошибки изображения
const handleImageError = (e) => {
  e.target.src = '/images/no-image.png'
}

// ✅ Удаление товара
const removeItem = async (cartItemId) => {
  if (!cartItemId || isRemoving.value) return

  isRemoving.value = true
  try {
    await cartStore.removeItem(cartItemId)
    emit('item-removed')
  } catch (error) {
    console.error('Chyba při odstraňování položky:', error)
  } finally {
    isRemoving.value = false
  }
}

// ✅ Вычисляемые свойства
const cartTotalPrice = computed(() => {
  if (!props.cartItems || !Array.isArray(props.cartItems)) return 0
  return props.cartItems.reduce((sum, item) => {
    const price = getProductPrice(item)
    const quantity = item?.quantity || 1
    return sum + (price * quantity)
  }, 0)
})

const cartTotalPriceWithoutVat = computed(() => {
  return cartTotalPrice.value / 1.21
})
</script>

<style scoped>
.cart-popup {
  position: absolute;
  top: 100%;
  right: 0;
  width: 340px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.15);
  margin-top: 10px;
  padding: 15px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  text-align: left;
}

.cart-popup.show {
  opacity: 1;
  visibility: visible;
}

.cart-popup::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}

/* ===== ПУСТАЯ КОРЗИНА ===== */
.cart-empty {
  text-align: center;
}

.cart-empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.cart-empty-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.cart-empty-contact {
  font-size: 12px;
  color: #999;
  margin-bottom: 15px;
}

.cart-empty-btn {
  display: inline-block;
  padding: 8px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 12px;
  transition: background-color 0.3s;
}

.cart-empty-btn:hover {
  background-color: #0056b3;
}

/* ===== КОРЗИНА С ТОВАРАМИ ===== */
.cart-popup-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.cart-popup-items {
  max-height: 280px;
  overflow-y: auto;
  margin-bottom: 12px;
}

.cart-popup-items::-webkit-scrollbar {
  width: 4px;
}

.cart-popup-items::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 4px;
}

/* ===== ТОВАР В КОРЗИНЕ ===== */
.cart-popup-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.cart-popup-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.cart-item-image {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  background: #f8f9fa;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-name {
  font-size: 12px;
  color: #333;
  margin-bottom: 2px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cart-item-price {
  font-size: 11px;
  color: #666;
}

/* ===== КНОПКА УДАЛЕНИЯ ===== */
.cart-item-remove {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.cart-item-remove:hover:not(:disabled) {
  background-color: #fee2e2;
  color: #dc3545;
}

.cart-item-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== ИТОГО ===== */
.cart-popup-total {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 12px;
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.cart-total-row.total {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 0;
  padding-top: 5px;
  border-top: 1px solid #eee;
}

.cart-popup-btn {
  display: block;
  text-align: center;
  padding: 10px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.cart-popup-btn:hover {
  background-color: #0056b3;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 1200px) {
  .cart-popup {
    width: 300px;
    right: -50px;
  }
}

@media (max-width: 768px) {
  .cart-popup {
    width: 280px;
    right: -20px;
    padding: 12px;
  }

  .cart-item-image {
    width: 40px;
    height: 40px;
  }

  .cart-item-remove {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  .cart-item-name {
    font-size: 11px;
  }
}
</style>