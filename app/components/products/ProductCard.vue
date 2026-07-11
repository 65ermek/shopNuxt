<template>
  <div class="product-card-wrapper">
    <NuxtLink :to="`/produkt/${product.slug}`" class="product-card">
      <div class="product-image">
        <img
            :src="productImage"
            :alt="product.name"
            loading="lazy"
            @error="handleImageError"
        />
        <span v-if="product.discount" class="product-badge discount">
          -{{ product.discount }}%
        </span>
        <span v-if="product.is_new" class="product-badge new">
          Novinka
        </span>

        <!-- Кнопка "Избранное" -->
        <button
            class="favorite-btn"
            :class="{ active: isFavorite }"
            @click="handleFavoriteClick"
            :aria-label="isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'"
            :title="isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="heart-icon"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="favorite-tooltip">
            {{ isFavorite ? 'Odebrat' : 'Přidat' }}
          </span>
        </button>
      </div>

      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>

        <div class="product-price-wrapper">
          <p v-if="product.old_price" class="product-price old-price">
            {{ formatPrice(product.old_price) }} Kč
          </p>
          <p class="product-price current-price">
            {{ formatPrice(product.price) }} Kč
          </p>
        </div>

        <p v-if="product.unit" class="product-unit">{{ product.unit }}</p>

        <button
            class="product-add-btn"
            @click.prevent="addToCart"
            :disabled="isAdding || !product.in_stock"
        >
          {{ isAdding ? 'Přidávám...' : (product.in_stock ? 'Do košíku' : 'Nedostupné') }}
        </button>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useWishlistStore } from '~/stores/wishlistStore'
import { formatPrice } from '~/utils/formatPrice'

import noImage from '~/assets/images/no-image.png'

interface Product {
  id: number
  name: string
  slug: string
  price: string | number
  old_price?: string | number | null
  image?: string | null
  unit?: string
  in_stock?: boolean | number
  discount?: number | null
  is_new?: boolean
  category_id?: number
  created_at?: string
  [key: string]: unknown
}

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const isAdding = ref<boolean>(false)

// Проверяем, есть ли товар в избранном
const isFavorite = computed<boolean>(() => {
  return wishlistStore.isFavorite(props.product.id)
})

// Вычисляем путь к изображению
const productImage = computed<string>(() => {
  if (props.product.image) {
    if (props.product.image.startsWith('http')) {
      return props.product.image
    }
    return `https://obchod.tanatar.cz/${props.product.image}`
  }
  return noImage
})

// Добавление в корзину
const addToCart = async (event: Event): Promise<void> => {
  event?.preventDefault()
  event?.stopPropagation()

  if (isAdding.value || !props.product.in_stock) return

  isAdding.value = true
  try {
    await cartStore.addItem(props.product, 1, 'cart')
    console.log('✅ Produkt přidán do košíku:', props.product.name)
  } catch (error) {
    console.error('Chyba při přidávání do košíku:', error)
  } finally {
    isAdding.value = false
  }
}

// Обработчик клика по сердечку
const handleFavoriteClick = async (event: Event): Promise<void> => {
  event.preventDefault()
  event.stopPropagation()

  try {
    await wishlistStore.toggleWishlist(props.product)
  } catch (error) {
    console.error('❌ Oшибка при работе с избранным:', error)
  }
}

const handleImageError = (e: Event): void => {
  const target = e.target as HTMLImageElement
  target.src = noImage
}
</script>

<style scoped>
/* ... ваши стили из предыдущей версии ... */
.product-card-wrapper {
  height: 100%;
  display: flex;
}

.product-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  width: 100%;
  height: 100%;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: #f8f9fa;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  z-index: 2;
}

.product-badge.discount {
  background: #dc3545;
}

.product-badge.new {
  background: #28a745;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.favorite-btn:active {
  transform: scale(0.9);
}

.favorite-btn .heart-icon {
  width: 20px;
  height: 20px;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.favorite-btn.active .heart-icon {
  color: #e11d48;
  fill: #e11d48;
}

.favorite-btn:hover .heart-icon {
  color: #e11d48;
}

.favorite-btn.active:hover .heart-icon {
  color: #be123c;
  fill: #be123c;
}

.favorite-tooltip {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #1e293b;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.favorite-btn:hover .favorite-tooltip {
  opacity: 1;
}

.product-info {
  padding: 15px 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
  min-height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.product-price-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  min-height: 28px;
}

.product-price {
  margin: 0;
  font-weight: 700;
}

.product-price.current-price {
  font-size: 20px;
  color: #46a3fa;
}

.product-price.old-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
}

.product-unit {
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
  min-height: 20px;
}

.product-add-btn {
  padding: 10px 24px;
  background: #46a3fa;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: auto;
  max-width: 100%;
  min-height: 44px;
}

.product-add-btn:hover:not(:disabled) {
  background: #2c7fd4;
  transform: scale(1.02);
}

.product-add-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.product-add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .product-name {
    font-size: 14px;
    min-height: 36px;
  }
  .product-price.current-price {
    font-size: 18px;
  }
  .product-add-btn {
    font-size: 13px;
    padding: 8px 16px;
    min-height: 40px;
  }
  .favorite-btn {
    width: 32px;
    height: 32px;
  }
  .favorite-btn .heart-icon {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .product-info {
    padding: 12px 12px 14px;
  }
  .product-name {
    font-size: 13px;
    min-height: 32px;
  }
  .product-price.current-price {
    font-size: 16px;
  }
  .product-add-btn {
    font-size: 12px;
    padding: 6px 12px;
    min-height: 36px;
  }
  .favorite-btn {
    width: 28px;
    height: 28px;
    top: 8px;
    right: 8px;
  }
  .favorite-btn .heart-icon {
    width: 16px;
    height: 16px;
  }
}
</style>