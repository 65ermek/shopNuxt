<template>
  <NuxtLink :to="`/produkt/${product.slug}`" class="product-card">
    <div class="product-image">
      <img
          :src="product.image ? `https://obchod.tanatar.cz/${product.image}` : '/images/no-image.png'"
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
          :disabled="isAdding"
      >
        {{ isAdding ? 'Přidávám...' : 'Do košíku' }}
      </button>
    </div>
  </NuxtLink>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '~/stores/cartStore'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const cartStore = useCartStore()
const isAdding = ref(false)

const formatPrice = (value) => {
  if (!value) return '0,00'
  const cleanValue = typeof value === 'string' ? value.replace(',', '.') : value
  const number = parseFloat(cleanValue)
  if (isNaN(number)) return '0,00'
  return number.toFixed(2).replace('.', ',')
}

const addToCart = async () => {
  if (isAdding.value) return

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

const handleImageError = (e) => {
  e.target.src = '/images/no-image.png'
}
</script>

<style scoped>
.product-card {
  display: block;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* ===== IMAGE ===== */
.product-image {
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: #f8f9fa;
  overflow: hidden;
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

/* ===== BADGES ===== */
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

/* ===== INFO ===== */
.product-info {
  padding: 15px 16px 18px;
  text-align: center;
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
}

/* ===== BUTTON ===== */
.product-add-btn {
  padding: 10px 24px;
  background: #46a3fa;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  width: 100%;
  max-width: 180px;
}

.product-add-btn:hover {
  background: #2c7fd4;
  transform: scale(1.02);
}

.product-add-btn:active {
  transform: scale(0.98);
}

.product-add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* ===== RESPONSIVE ===== */
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
    max-width: 100%;
  }
}
</style>