<template>
  <div class="featured-products">
    <div class="products-header">
      <h2>⭐ Doporučujeme</h2>
      <NuxtLink to="/produkty" class="show-all-link">
        Zobrazit vše →
      </NuxtLink>
    </div>

    <div v-if="pending" class="products-grid">
      <div v-for="n in 4" :key="n" class="product-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>

    <div v-else-if="featuredProducts.length" class="products-grid">
      <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
      />
    </div>

    <p v-else class="no-products">Žádné produkty k zobrazení.</p>
  </div>
</template>

<script setup>
import {  computed } from 'vue'
import ProductCard from '../products/ProductCard.vue'


// Получаем товары с API
const { data: products, pending } = await useFetch('https://obchod.tanatar.cz/api/products')

// Фильтруем только избранные товары (is_featured = 1)
const featuredProducts = computed(() => {
  if (!products.value) return []

  let items = []
  if (Array.isArray(products.value)) {
    items = products.value
  } else if (products.value?.data && Array.isArray(products.value.data)) {
    items = products.value.data
  }

  // Фильтруем избранные и добавляем полный URL для изображений
  return items
      .filter(p => p.is_featured === 1)
      .map(product => ({
        ...product,
        image: product.image
            ? `https://obchod.tanatar.cz/${product.image}`
            : null,
        discount: product.old_price && product.old_price > product.price
            ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
            : null,
        in_stock: product.in_stock === 1 || product.in_stock === true,
        is_new: new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }))
})

console.log('Featured products:', featuredProducts.value?.length || 0)
</script>

<style scoped>
.featured-products {
  margin-top: 20px;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.products-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.show-all-link {
  color: #46a3fa;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.show-all-link:hover {
  color: #2c7fd4;
  text-decoration: underline;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* ===== Skeleton ===== */
.product-skeleton {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 0;
}

.skeleton-image {
  width: 100%;
  padding-top: 75%;
  background: #f1f5f9;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-text {
  height: 14px;
  background: #f1f5f9;
  margin: 12px 16px 8px;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-text.short {
  width: 60%;
}

.no-products {
  text-align: center;
  color: #94a3b8;
  padding: 40px 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .products-header h2 {
    font-size: 1.2rem;
  }
}
</style>