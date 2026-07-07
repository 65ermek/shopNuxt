<template>
  <div class="wishlist-page">
    <div class="wishlist-grid">
      <aside class="wishlist-sidebar">
        <CategoryMenu />
      </aside>

      <section class="wishlist-content">
        <Breadcrumbs />
        <h1 class="wishlist-title">❤️ Oblíbené položky</h1>
        <p class="wishlist-subtitle" v-if="wishlistStore.count > 0">
          Máte {{ wishlistStore.count }} {{ wishlistStore.count === 1 ? 'položku' : 'položek' }} v oblíbených
        </p>

        <div v-if="cartStore.loading" class="wishlist-loading">
          <div class="loading-spinner"></div>
          <p>Načítání oblíbených položek...</p>
        </div>

        <div v-else-if="wishlistStore.count === 0" class="wishlist-empty">
          <div class="empty-icon">💔</div>
          <h2>Vaše seznam oblíbených je prázdný</h2>
          <p>Prohlédněte si naši nabídku a přidejte něco do oblíbených.</p>
          <NuxtLink to="/" class="empty-btn">Pokračovat v nákupu</NuxtLink>
        </div>

        <div v-else class="wishlist-items">
          <div
              v-for="item in wishlistStore.items"
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

    <ConfirmModal
        :is-visible="showModal"
        :item-name="modalItemName"
        @confirm="confirmRemove"
        @cancel="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useWishlistStore } from '~/stores/wishlistStore'
import ConfirmModal from '~/components/common/ConfirmModal.vue'
import Breadcrumbs from "~/components/common/Breadcrumbs.vue";

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const isAdding = ref(false)
const isRemoving = ref(false)

const showModal = ref(false)
const modalItem = ref(null)
const modalItemName = ref('')

// Получение данных из item
const getProduct = (item) => item.product || item

const getProductName = (item) => {
  const product = getProduct(item)
  return product?.name || 'Neznámý produkt'
}

const getProductSlug = (item) => {
  const product = getProduct(item)
  return product?.slug || '#'
}

const getProductPrice = (item) => {
  const product = getProduct(item)
  const price = product?.price
  return price !== undefined && price !== null ? parseFloat(price) : 0
}

const getProductOldPrice = (item) => {
  const product = getProduct(item)
  const price = product?.old_price
  return price !== undefined && price !== null ? parseFloat(price) : null
}

const getProductImage = (item) => {
  const product = getProduct(item)
  const image = product?.image
  if (image) {
    if (image.startsWith('http')) return image
    return `https://obchod.tanatar.cz/${image}`
  }
  return '/assets/images/no-image.png'  // ← исправлено
}
const handleImageError = (e) => {
  e.target.src = '/assets/images/no-image.png'  // ← исправлено
}
const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) return '0,00'
  return price.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
const addToCart = async (item) => {
  if (isAdding.value) return
  const product = getProduct(item)
  isAdding.value = true
  try {
    await cartStore.addItem(product, 1, 'cart')
    console.log('✅ Produkt přidán do košíku:', getProductName(item))
  } catch (error) {
    console.error('Chyba při přidávání do košíku:', error)
  } finally {
    isAdding.value = false
  }
}

const removeFromWishlist = (item) => {
  modalItem.value = item
  modalItemName.value = getProductName(item) || 'tuto položku'
  showModal.value = true
}

const confirmRemove = async () => {
  if (!modalItem.value || isRemoving.value) return
  isRemoving.value = true
  try {
    await wishlistStore.removeFromWishlist(modalItem.value.product_id)
    closeModal()
  } catch (error) {
    console.error('Chyba při odstraňování položky:', error)
  } finally {
    isRemoving.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  modalItem.value = null
  modalItemName.value = ''
}

onMounted(async () => {
  await cartStore.fetchCart()
  console.log('🛒 Корзина:', cartStore.cartItems)
  console.log('❤️ Избранное:', wishlistStore.items)
})
</script>

<style scoped>
.wishlist-page {
  padding: 20px 0;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

.wishlist-sidebar {
  min-width: 220px;
}

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