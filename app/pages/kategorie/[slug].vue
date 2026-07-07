<template>
  <div class="category-page">
    <div class="category-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="category-sidebar">
        <CategoryMenu />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="category-content">
        <Breadcrumbs />

        <div class="category-header">
          <h1 class="category-title">{{ category?.name || 'Kategorie' }}</h1>
          <p v-if="category?.description" class="category-description">
            {{ category.description }}
          </p>
        </div>

        <!-- Табы сортировки -->
        <div class="category-controls">
          <div class="products-count">
            <span>{{ filteredProducts.length }} produktů</span>
          </div>

          <!-- Табы сортировки -->
          <div class="sort-tabs">
            <button
                v-for="option in sortOptions"
                :key="option.value"
                class="sort-tab"
                :class="{ active: sortOption === option.value }"
                @click="sortOption = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <!-- Mřížka produktů -->
        <div v-if="loading" class="loading-state">
          <div class="loader">Načítání...</div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <p>V této kategorii zatím nejsou žádné produkty.</p>
        </div>

        <div v-else class="products-grid">
          <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
          />
        </div>

        <!-- Stránkování -->
        <div v-if="totalPages > 1" class="pagination">
          <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
          >
            ←
          </button>

          <div class="pagination-pages">
            <button
                v-for="page in visiblePages"
                :key="page"
                class="pagination-btn"
                :class="{ active: page === currentPage }"
                @click="changePage(page)"
                v-if="page !== '...'"
            >
              {{ page }}
            </button>
            <span v-else class="pagination-dots">...</span>
          </div>

          <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
          >
            →
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// Импортируем компоненты
import Breadcrumbs from "~/components/common/Breadcrumbs.vue"
import ProductCard from "~/components/products/ProductCard.vue"

const route = useRoute()

// Реактивные переменные
const category = ref(null)
const allProducts = ref([])
const loading = ref(true)
const sortOption = ref('popular')
const currentPage = ref(1)
const itemsPerPage = 12
const totalPages = ref(1)

// Базовый URL для API
const API_BASE_URL = 'https://obchod.tanatar.cz'

// Опции сортировки для табов
const sortOptions = [
  { value: 'popular', label: 'Nejprodávanější' },
  { value: 'price-asc', label: 'Cena ↑' },
  { value: 'price-desc', label: 'Cena ↓' },
  { value: 'name', label: 'Název' },
  { value: 'new', label: 'Novinky' }
]

// Функция для получения данных
const fetchCategoryData = async () => {
  loading.value = true
  try {
    const slug = route.params.slug

    if (!slug) {
      loading.value = false
      return
    }

    console.log('🔍 Hledám kategorii:', slug)

    // Получаем все категории
    const categoriesResponse = await $fetch(`${API_BASE_URL}/api/categories`)
    console.log('📦 Všechny kategorie:', categoriesResponse)

    // Находим категорию по slug
    const foundCategory = categoriesResponse.find(cat => cat.slug === slug)

    if (!foundCategory) {
      console.warn('⚠️ Kategorie nenalezena:', slug)
      category.value = null
      allProducts.value = []
      totalPages.value = 1
      loading.value = false
      return
    }

    category.value = foundCategory
    console.log('✅ Nalezena kategorie:', foundCategory.name)

    // Получаем ВСЕ продукты из API
    const productsResponse = await $fetch(`${API_BASE_URL}/api/products`)
    console.log(`📦 Všechny produkty:`, productsResponse.length)

    // Фильтруем продукты по category_id
    let filtered = []
    if (Array.isArray(productsResponse)) {
      filtered = productsResponse.filter(p => p.category_id === foundCategory.id)
    } else if (productsResponse?.data && Array.isArray(productsResponse.data)) {
      filtered = productsResponse.data.filter(p => p.category_id === foundCategory.id)
    }

    console.log(`📦 Produkty v kategorii ${foundCategory.name}:`, filtered.length)

    // Нормализуем данные товаров
    allProducts.value = filtered.map(product => ({
      ...product,
      image: product.image
          ? `${API_BASE_URL}/${product.image}`
          : null,
      discount: product.old_price && product.old_price > product.price
          ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
          : null,
      in_stock: product.in_stock === 1 || product.in_stock === true,
      is_new: new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }))

    // Обновляем пагинацию
    totalPages.value = Math.ceil(allProducts.value.length / itemsPerPage)
    if (currentPage.value > totalPages.value) {
      currentPage.value = 1
    }

  } catch (error) {
    console.error('❌ Chyba při načítání:', error)
    category.value = null
    allProducts.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// Фильтрованные и отсортированные товары
const filteredProducts = computed(() => {
  let sorted = [...allProducts.value]

  switch (sortOption.value) {
    case 'popular':
      // Сортировка по популярности (по убыванию views_count или average_rating)
      sorted.sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      break
    case 'price-asc':
      sorted.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0))
      break
    case 'price-desc':
      sorted.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0))
      break
    case 'name':
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'new':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
  }

  return sorted
})

// Пагинация
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Страницы для пагинации
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Следим за изменением slug
watch(() => route.params.slug, () => {
  fetchCategoryData()
  currentPage.value = 1
})

// Инициализация
onMounted(() => {
  fetchCategoryData()
})

// SEO
useHead({
  title: computed(() => `${category.value?.name || 'Kategorie'} | New Idea`),
  meta: [
    {
      name: 'description',
      content: computed(() => `${category.value?.name || 'Kategorie produktů'} v internetovém obchodě New Idea`)
    }
  ]
})
</script>

<style scoped>
.category-page {
  padding: 20px 0;
}

.category-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

.category-sidebar {
  min-width: 220px;
}

.category-header {
  margin-bottom: 24px;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.category-description {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.category-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin-bottom: 20px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 12px;
}

.products-count {
  font-size: 0.95rem;
  color: #64748b;
}

/* ===== Табы сортировки ===== */
.sort-tabs {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
}

.sort-tab {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sort-tab:hover {
  color: #1e293b;
  background: rgba(255, 255, 255, 0.5);
}

.sort-tab.active {
  background: white;
  color: #46a3fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sort-tab:active {
  transform: scale(0.95);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.loading-state {
  text-align: center;
  padding: 60px 0;
}

.loader {
  display: inline-block;
  padding: 12px 24px;
  background: #f1f5f9;
  border-radius: 8px;
  color: #64748b;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #64748b;
  font-size: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px 0 10px;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.pagination-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #1e293b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #46a3fa;
  color: #46a3fa;
}

.pagination-btn.active {
  background: #46a3fa;
  border-color: #46a3fa;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-dots {
  padding: 0 4px;
  color: #64748b;
}

.pagination-pages {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .category-grid {
    grid-template-columns: 1fr;
  }

  .category-sidebar {
    min-width: auto;
  }

  .category-title {
    font-size: 1.6rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .category-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .sort-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    justify-content: flex-start;
  }

  .sort-tab {
    flex-shrink: 0;
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 576px) {
  .category-title {
    font-size: 1.3rem;
  }

  .category-description {
    font-size: 0.9rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }

  .pagination-btn {
    min-width: 34px;
    height: 34px;
    font-size: 0.8rem;
    padding: 0 8px;
  }

  .products-count {
    font-size: 0.85rem;
  }
}
</style>