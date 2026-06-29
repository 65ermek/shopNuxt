<template>
  <div class="featured-products">
    <div v-if="pending" class="products-grid">
      <div v-for="n in 4" :key="n" class="product-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>

    <div v-else-if="products.length" class="products-grid">
      <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
      />
    </div>

    <p v-else class="no-products">Žádné produkty k zobrazení.</p>
  </div>
</template>

<script setup>
import ProductCard from '../products/ProductCard.vue'

// Получаем товары с API
const { data: products, pending } = await useFetch('https://obchod.tanatar.cz/api/products')
console.log('Products data:', products.value)
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
  color: #e11d48;
  text-decoration: none;
  font-weight: 500;
}

.show-all-link:hover {
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
}
</style>