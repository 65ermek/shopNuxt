<template>
  <div class="wishlist-page">
    <div class="wishlist-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="wishlist-sidebar">
        <CategoryMenu />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="wishlist-content">
        <h1 class="wishlist-title">❤️ Oblíbené položky</h1>
        <p class="wishlist-subtitle" v-if="favoriteItems.length > 0">
          Máte {{ favoriteItems.length }} {{ favoriteItems.length === 1 ? 'položku' : 'položek' }} v oblíbených
        </p>

        <!-- Состояние загрузки -->
        <div v-if="isLoading" class="wishlist-loading">
          <div class="loading-spinner"></div>
          <p>Načítání oblíbených položek...</p>
        </div>

        <!-- Пустое избранное -->
        <div v-else-if="favoriteItems.length === 0" class="wishlist-empty">
          <div class="empty-icon">💔</div>
          <h2>Vaše seznam oblíbených je prázdný</h2>
          <p>Prohlédněte si naši nabídku a přidejte něco do oblíbených.</p>
          <NuxtLink to="/" class="empty-btn">Pokračovat v nákupu</NuxtLink>
        </div>

        <!-- Список избранных товаров -->
        <div v-else class="wishlist-items">
          <div
              v-for="item in favoriteItems"
              :key="item.id"
              class="wishlist-item"
          >
            <div class="wishlist-item-image">
              <img
                  :src="getProductImage(item)"
                  :alt="getProductName(item)"
                  loading="lazy"
                  @error="handleImageError"
              />
            </div>

            <div class="wishlist-item-info">
              <NuxtLink :to="`/produkt/${getProductSlug(item)}`" class="wishlist-item-name">
                {{ getProductName(item) }}
              </NuxtLink>
              <div class="wishlist-item-price">
                <span class="current-price">{{ formatPrice(getProductPrice(item)) }} Kč</span>
                <span v-if="getProductOldPrice(item)" class="old-price">
                  {{ formatPrice(getProductOldPrice(item)) }} Kč
                </span>
              </div>
            </div>

            <div class="wishlist-item-actions">
              <button
                  class="wishlist-btn-add"
                  @click="addToCart(item)"
                  :disabled="isAdding"
              >
                {{ isAdding ? 'Přidávám...' : '🛒 Do košíku' }}
              </button>
              <button
                  class="wishlist-btn-remove"
                  @click="removeFromWishlist(item)"
                  :disabled="isRemoving"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <ConfirmModal
        :is-visible="showModal"
        :item-name="modalItemName"
        @confirm="confirmRemove"
        @cancel="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import ConfirmModal from '~/components/common/ConfirmModal.vue'

const cartStore = useCartStore()
const isLoading = ref(true)
const isAdding = ref(false)
const isRemoving = ref(false)

// Состояния модалки
const showModal = ref(false)
const modalItem = ref(null)
const modalItemName = ref('')

// Получаем только избранные товары
const favoriteItems = computed(() => {
  return cartStore.items.filter(item => item.type === 'favorite')
})

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
  return 0
}

// ✅ Получение старой цены
const getProductOldPrice = (item) => {
  if (!item) return null
  if (item.old_price !== undefined && item.old_price !== null) {
    const num = parseFloat(item.old_price)
    return isNaN(num) ? null : num
  }
  if (item.product && typeof item.product === 'object' && item.product.old_price !== undefined && item.product.old_price !== null) {
    const num = parseFloat(item.product.old_price)
    return isNaN(num) ? null : num
  }
  return null
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

// ✅ Добавление в корзину
const addToCart = async (item) => {
  if (isAdding.value) return

  const product = item.product || item
  isAdding.value = true
  try {
    await cartStore.addItem(product, 1, 'cart')
    // Не удаляем из избранного (остается и там, и там)
  } catch (error) {
    console.error('Chyba při přidávání do košíku:', error)
  } finally {
    isAdding.value = false
  }
}

// ✅ Открыть модалку подтверждения удаления
const removeFromWishlist = (item) => {
  modalItem.value = item
  modalItemName.value = getProductName(item) || 'tuto položku'
  showModal.value = true
}

// ✅ Подтверждение удаления из избранного
const confirmRemove = async () => {
  if (!modalItem.value?.id || isRemoving.value) return

  isRemoving.value = true
  try {
    // Удаляем из избранного (меняем тип на history или удаляем)
    await cartStore.removeItemWithMove(modalItem.value.id, 'favorite')
    closeModal()
  } catch (error) {
    console.error('Chyba při odstraňování položky:', error)
  } finally {
    isRemoving.value = false
  }
}

// ✅ Закрыть модалку
const closeModal = () => {
  showModal.value = false
  modalItem.value = null
  modalItemName.value = ''
}

// ✅ Загрузка данных
onMounted(async () => {
  isLoading.value = true
  await cartStore.fetchCart()
  isLoading.value = false
})
</script>

<style scoped>
/* ===== ОБЩИЕ СТИЛИ ===== */
.wishlist-page {
  padding: 20px 0;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

/* ===== ЛЕВАЯ КОЛОНКА ===== */
.wishlist-sidebar {
  min-width: 220px;
}

/* ===== ПРАВАЯ КОЛОНКА ===== */
.wishlist-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wishlist-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.wishlist-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* ===== ЗАГРУЗКА ===== */
.wishlist-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.wishlist-loading p {
  color: #64748b;
  font-size: 14px;
}

/* ===== ПУСТОЕ ИЗБРАННОЕ ===== */
.wishlist-empty {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.wishlist-empty h2 {
  font-size: 24px;
  color: #1e293b;
  margin-bottom: 12px;
}

.wishlist-empty p {
  color: #64748b;
  margin-bottom: 24px;
}

.empty-btn {
  display: inline-block;
  padding: 12px 32px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.empty-btn:hover {
  background-color: #0056b3;
}

/* ===== СПИСОК ТОВАРОВ ===== */
.wishlist-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wishlist-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  transition: box-shadow 0.2s;
}

.wishlist-item:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.wishlist-item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  flex-shrink: 0;
}

.wishlist-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wishlist-item-info {
  flex: 1;
  min-width: 0;
}

.wishlist-item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  transition: color 0.2s;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wishlist-item-name:hover {
  color: #007bff;
}

.wishlist-item-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.old-price {
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
}

/* ===== ДЕЙСТВИЯ С ТОВАРОМ ===== */
.wishlist-item-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.wishlist-btn-add {
  padding: 8px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.wishlist-btn-add:hover:not(:disabled) {
  background-color: #0056b3;
}

.wishlist-btn-add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.wishlist-btn-remove {
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
}

.wishlist-btn-remove:hover:not(:disabled) {
  background-color: #fee2e2;
  color: #dc3545;
}

.wishlist-btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 992px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
  }

  .wishlist-sidebar {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .wishlist-item {
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;
  }

  .wishlist-item-image {
    width: 60px;
    height: 60px;
  }

  .wishlist-item-name {
    font-size: 14px;
  }

  .current-price {
    font-size: 16px;
  }

  .wishlist-item-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .wishlist-title {
    font-size: 22px;
  }

  .wishlist-item {
    flex-direction: column;
    align-items: stretch;
  }

  .wishlist-item-image {
    width: 100%;
    height: 120px;
  }

  .wishlist-item-actions {
    justify-content: stretch;
  }

  .wishlist-btn-add {
    flex: 1;
    text-align: center;
  }
}
</style>