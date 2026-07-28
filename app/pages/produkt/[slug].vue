<template>
  <div class="product-page">
    <div class="product-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="product-sidebar">
        <CategoryMenu :active-slug="categorySlug" />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="product-content">
        <!-- Хлебные крошки -->
        <div class="breadcrumbs-wrapper">
          <NuxtLink to="/" class="breadcrumb-link">Domů</NuxtLink>
          <span class="breadcrumb-separator">›</span>
          <NuxtLink
              v-if="product?.category?.slug"
              :to="`/kategorie/${product.category.slug}`"
              class="breadcrumb-link"
          >
            {{ product.category.name }}
          </NuxtLink>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">{{ product?.name || 'Produkt' }}</span>
        </div>

        <div v-if="loading" class="product-loading">
          <div class="loader">Načítání...</div>
        </div>

        <div v-else-if="!product" class="product-not-found">
          <h2>Produkt nebyl nalezen</h2>
          <NuxtLink to="/" class="back-link">Zpět na hlavní stránku</NuxtLink>
        </div>

        <div v-else class="product-detail">
          <!-- Основной блок: фото + информация -->
          <div class="product-main">
            <!-- Левая часть: Галерея -->
            <div class="product-gallery">
              <div class="gallery-main" @click="openSlider">
                <img
                    :src="mainImage"
                    :alt="product.name"
                    class="gallery-main-img"
                    @error="handleImageError"
                />
                <div class="gallery-zoom-icon">🔍</div>
              </div>
              <div class="gallery-thumbs" v-if="productImages && productImages.length > 1">
                <button
                    v-for="(img, index) in productImages"
                    :key="img.id || index"
                    class="thumb-btn"
                    :class="{ active: currentImageIndex === index }"
                    @click="currentImageIndex = index"
                >
                  <img
                      :src="getImageUrl(img.path)"
                      :alt="product.name"
                      loading="lazy"
                      @error="handleThumbError"
                  />
                </button>
              </div>
            </div>
            <!-- ✅ Слайдер -->
            <SlickSlider
                :is-visible="isSliderOpen"
                :images="allProductImages"
                :initial-index="currentImageIndex"
                @close="closeSlider"
            />
            <!-- Правая часть: Информация -->
            <div class="product-info">
              <h1 class="product-title">{{ product.name }}</h1>

              <!-- Рейтинг -->
              <div class="product-rating">
                <div class="stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(product.average_rating || 0) }">
                    ★
                  </span>
                </div>
                <span class="rating-value">{{ product.average_rating || 0 }}</span>
                <span class="reviews-count">({{ product.reviews_count || 0 }} hodnocení)</span>
              </div>

              <!-- Описание (3 строки) -->
              <div class="product-description">
                <p class="description-short">{{ shortDescription }}</p>
                <button
                    v-if="hasMoreDescription"
                    class="description-toggle"
                    @click="goToDescriptionTab"
                >
                  Zobrazit celý popis →
                </button>
              </div>

              <!-- Статус наличия -->
              <div class="product-stock">
                <div class="stock-status" :class="stockClass">
                  <span class="stock-icon">{{ stockIcon }}</span>
                  <span class="stock-text">{{ stockText }}</span>
                </div>
                <div class="delivery-info">
                  <span class="delivery-icon">📦</span>
                  <span class="delivery-text">{{ deliveryText }}</span>
                </div>
              </div>

              <!-- Цена и кнопки -->
              <div class="product-actions">
                <div class="price-block">
                  <span class="current-price">{{ formatPrice(product.price) }} Kč</span>
                  <span v-if="product.old_price" class="old-price">
                    {{ formatPrice(product.old_price) }} Kč
                  </span>
                  <span v-if="product.discount" class="discount-badge">
                    -{{ productDiscount }}%
                  </span>
                </div>

                <div class="action-buttons">
                  <button
                      class="btn-add-to-cart"
                      @click="addToCart"
                      :disabled="isAdding || !product.in_stock"
                  >
                    {{ isAdding ? 'Přidávám...' : (product.in_stock ? '🛒 Do košíku' : 'Nedostupné') }}
                  </button>
                  <button
                      class="btn-favorite"
                      :class="{ active: isFavorite }"
                      @click="toggleFavorite"
                  >
                    <span class="heart-icon">{{ isFavorite ? '❤️' : '🤍' }}</span>
                    {{ isFavorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených' }}
                  </button>
                </div>

                <!-- Быстрая покупка -->
                <button
                    v-if="product.in_stock"
                    class="btn-buy-now"
                    @click="buyNow"
                >
                  Koupit teď
                </button>
              </div>
            </div>
          </div>

          <!-- Дополнительная информация -->
          <div class="product-tabs">
            <div class="tabs-header">
              <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  class="tab-btn"
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
            <div class="tabs-content">
              <!-- Parametry -->
              <div v-if="activeTab === 'params'" class="tab-panel">
                <table class="params-table" v-if="productParams.length">
                  <tr v-for="param in productParams" :key="param.key">
                    <td class="param-key">{{ param.key }}</td>
                    <td class="param-value">{{ param.value }}</td>
                  </tr>
                </table>
                <p v-else class="no-params">Žádné parametry nejsou k dispozici.</p>
              </div>

              <!-- Popis -->
              <div v-if="activeTab === 'description'" class="tab-panel">
                <div class="full-description" v-html="product.description || 'Popis není k dispozici.'"></div>
              </div>

              <!-- Hodnocení -->
              <div v-if="activeTab === 'reviews'" class="tab-panel">
                <div v-if="product.reviews && product.reviews.length">
                  <div v-for="review in product.reviews" :key="review.id" class="review-item">
                    <div class="review-header">
                      <span class="review-author">{{ review.author || 'Anonymní' }}</span>
                      <span class="review-rating">
                        <span v-for="i in 5" :key="i" class="star small" :class="{ filled: i <= review.rating }">★</span>
                      </span>
                      <span class="review-date">{{ formatDate(review.created_at) }}</span>
                    </div>
                    <p class="review-text">{{ review.text }}</p>
                  </div>
                </div>
                <p v-else class="no-reviews">Zatím žádné hodnocení. Buďte první!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ✅ Попап добавления в корзину -->
    <AddToCartPopup
        v-model:visible="showPopup"
        :product-name="product?.name || ''"
        :product-image="product?.image || ''"
        :product-price="Number(product?.price || 0)"
        :product-price-without-vat="Number(product?.price || 0) / 1.21"
        :quantity="1"
        unit="ks"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '~/stores/cartStore'
import { useWishlistStore } from '~/stores/wishlistStore'
import { useToastStore } from '~/stores/toastStore'
import SlickSlider from "~/components/common/slickSlider.vue";
import AddToCartPopup from '~/components/AddToCartPopup.vue'
import { formatPrice } from '~/utils/formatPrice'

// ============================================================
// 📌 ТИПЫ
// ============================================================

interface ProductImage {
  id: number
  product_id: number
  path: string
  is_main: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

interface ProductCategory {
  id: number
  name: string
  slug: string
  image?: string | null
  parent_id?: number | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

interface ProductTag {
  id: number
  name: string
  slug: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  pivot?: {
    product_id: number
    tag_id: number
  }
}

interface ProductReview {
  id: number
  author?: string
  rating: number
  text: string
  created_at?: string
}

interface Product {
  id: number
  name: string
  slug: string
  category_id: number
  brand_id: number | null
  description: string
  short_description: string
  price: string
  old_price: string | null
  in_stock: number
  quantity: number
  sku: string
  image: string
  is_featured: number
  status: string
  views_count: number
  average_rating: number
  reviews_count: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  category: ProductCategory
  brand: null
  tags: ProductTag[]
  images: ProductImage[]
  discount?: number | null
  reviews?: ProductReview[]
}

// ============================================================
// 📌 ЛОГИКА
// ============================================================

const route = useRoute()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const toastStore = useToastStore()

const API_BASE_URL = 'https://obchod.tanatar.cz'

// Состояния
const product = ref<Product | null>(null)
const loading = ref(true)
const currentImageIndex = ref(0)
const activeTab = ref('params')
const isAdding = ref(false)
const showPopup = ref(false) // ✅ Добавляем состояние для попапа

// Категория для подсветки
const categorySlug = computed(() => product.value?.category?.slug || '')

// Избранное
const isFavorite = computed(() => {
  if (!product.value) return false
  return wishlistStore.isFavorite(product.value.id)
})

// Переключение на таб "Popis"
const goToDescriptionTab = (): void => {
  activeTab.value = 'description'
  setTimeout(() => {
    const tabsElement = document.querySelector('.product-tabs')
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

// ✅ Вычисляем скидку
const productDiscount = computed(() => {
  if (!product.value) return null
  const oldPrice = parseFloat(String(product.value.old_price))
  const price = parseFloat(String(product.value.price))
  if (oldPrice > price) {
    return Math.round(((oldPrice - price) / oldPrice) * 100)
  }
  return null
})

// Изображения
const productImages = computed<ProductImage[]>(() => {
  return product.value?.images || []
})

// Основное изображение
const mainImage = computed(() => {
  if (!product.value) return '/images/no-image.png'

  if (productImages.value.length > 0 && currentImageIndex.value < productImages.value.length) {
    const img = productImages.value[currentImageIndex.value] as ProductImage
    return getImageUrl(img.path)
  }

  if (product.value.image) {
    return getImageUrl(product.value.image)
  }

  return '/images/no-image.png'
})

const getImageUrl = (path: string): string => {
  if (!path) return '/images/no-image.png'
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}/${path}`
}

// Описание
const shortDescription = computed(() => {
  if (!product.value?.description) return ''
  const desc = product.value.description.replace(/<[^>]*>/g, '').replace(/\r\n/g, ' ').replace(/\n/g, ' ')
  if (desc.length <= 150) return desc
  return desc.substring(0, 150) + '...'
})

const hasMoreDescription = computed(() => {
  if (!product.value?.description) return false
  const desc = product.value.description.replace(/<[^>]*>/g, '').replace(/\r\n/g, ' ').replace(/\n/g, ' ')
  return desc.length > 150
})

// Наличие
const stockText = computed(() => {
  if (!product.value) return ''
  const qty = product.value.quantity || 0
  if (qty > 10) return 'Skladem > 10 ks'
  if (qty > 0) return `Skladem ${qty} ks`
  return 'Není skladem'
})

const stockClass = computed(() => {
  const qty = product.value?.quantity || 0
  return qty > 0 ? 'in-stock' : 'out-of-stock'
})

const stockIcon = computed(() => {
  const qty = product.value?.quantity || 0
  return qty > 0 ? '✅' : '❌'
})

const deliveryText = computed(() => {
  if (!product.value) return ''
  const days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle']
  const dayIndex = new Date().getDay()
  const workDayIndex = dayIndex === 0 ? 6 : dayIndex - 1
  const day = days[workDayIndex] || 'Čtvrtek'
  const date = new Date()
  date.setDate(date.getDate() + 3)
  const dayStr = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })
  return `${day} ${dayStr}. v AlzaBoxu P11 - Chodov - Türkova 13`
})

// Параметры товара
const productParams = computed(() => {
  if (!product.value) return []
  const params: { key: string; value: string }[] = []

  if (product.value.sku) params.push({ key: 'Kód produktu', value: product.value.sku })
  if (product.value.category?.name) params.push({ key: 'Kategorie', value: product.value.category.name })
  if (product.value.quantity !== undefined) params.push({ key: 'Skladem', value: String(product.value.quantity) })

  return params
})

// Табы
const tabs = [
  { key: 'params', label: 'Parametry' },
  { key: 'description', label: 'Popis' },
  { key: 'reviews', label: 'Hodnocení' }
]

const formatDate = (date?: string): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('cs-CZ')
}

// Загрузка товара
const fetchProduct = async (): Promise<void> => {
  loading.value = true
  try {
    const slug = route.params.slug
    if (!slug) {
      loading.value = false
      return
    }

    const response = await $fetch<Product[]>(`${API_BASE_URL}/api/products`)

    let products: Product[] = []
    if (Array.isArray(response)) {
      products = response
    }

    const found = products.find((p: Product) => p.slug === slug)
    if (found) {
      const discountValue = found.old_price
          ? Math.round(((parseFloat(found.old_price) - parseFloat(found.price)) / parseFloat(found.old_price)) * 100)
          : null
      product.value = {
        ...found,
        discount: discountValue
      }
    }
  } catch (error) {
    console.error('❌ Chyba při načítání produktu:', error)
  } finally {
    loading.value = false
  }
}

// ✅ Добавление в корзину с попапом
const addToCart = async (): Promise<void> => {
  if (isAdding.value || !product.value?.in_stock) return

  isAdding.value = true
  try {
    const productData = {
      id: product.value.id,
      name: product.value.name,
      price: Number(product.value.price),
      image: product.value.image || null,
      slug: product.value.slug,
    }

    await cartStore.addItem(productData, 1, 'cart')

    // ✅ Показываем попап
    showPopup.value = true

  } catch (error) {
    console.error('❌ Chyba při přidávání do košíku:', error)
    toastStore.error(
        'Chyba',
        'Nepodařilo se přidat produkt do košíku'
    )
  } finally {
    isAdding.value = false
  }
}

const buyNow = (): void => {
  if (!product.value) return
  cartStore.addItem(product.value, 1, 'cart')
  navigateTo('/cart')
}

const toggleFavorite = async (): Promise<void> => {
  if (!product.value) return
  try {
    await wishlistStore.toggleWishlist(product.value)
  } catch (error) {
    console.error('❌ Oшибка при работе с избранным:', error)
  }
}

const handleImageError = (e: Event): void => {
  const target = e.target as HTMLImageElement
  target.src = '/images/no-image.png'
}

const handleThumbError = (e: Event): void => {
  const target = e.target as HTMLImageElement
  target.src = '/images/no-image.png'
}

// Слайдер
const isSliderOpen = ref(false)

const allProductImages = computed(() => {
  if (!product.value) return []

  const images: (string | { path: string })[] = []

  if (product.value.image) {
    images.push(product.value.image)
  }

  if (product.value.images && Array.isArray(product.value.images)) {
    product.value.images.forEach(img => {
      images.push(img)
    })
  }

  return images
})

const openSlider = (): void => {
  isSliderOpen.value = true
}

const closeSlider = (): void => {
  isSliderOpen.value = false
}

// Инициализация
onMounted(() => {
  fetchProduct()
})

// SEO
useHead(() => ({
  title: product.value?.name ? `${product.value.name} | New Idea` : 'Produkt | New Idea',
  meta: [
    {
      name: 'description',
      content: product.value?.short_description || product.value?.description?.substring(0, 160) || ''
    }
  ]
}))
</script>

<style scoped>
/* Хлебные крошки */
.breadcrumbs-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  padding: 8px 0;
  flex-wrap: wrap;
}

.breadcrumb-link {
  color: #46a3fa;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #2c7fd4;
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #9ca3af;
}

.breadcrumb-current {
  color: #1e293b;
  font-weight: 500;
}

.product-page {
  padding: 20px 0;
}

.product-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

.product-sidebar {
  min-width: 220px;
}

.product-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-loading {
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

.product-not-found {
  text-align: center;
  padding: 60px 0;
}

.back-link {
  color: #46a3fa;
  text-decoration: none;
}

/* Основной блок */
.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

/* Галерея */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gallery-main {
  width: 100%;
  padding-top: 100%;
  position: relative;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.gallery-main-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.gallery-zoom-icon {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 18px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.gallery-main:hover .gallery-zoom-icon {
  opacity: 1;
}

.gallery-thumbs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.thumb-btn {
  width: 64px;
  height: 64px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: white;
  transition: border-color 0.2s;
}

.thumb-btn.active {
  border-color: #46a3fa;
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Информация о товаре */
.product-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 18px;
  color: #d1d5db;
}

.star.filled {
  color: #f59e0b;
}

.star.small {
  font-size: 14px;
}

.rating-value {
  font-weight: 600;
  color: #1e293b;
}

.reviews-count {
  color: #6b7280;
  font-size: 14px;
}

/* Описание */
.product-description {
  margin-bottom: 16px;
}

.description-short {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 8px 0;
}

.description-toggle {
  background: none;
  border: none;
  color: #46a3fa;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
}

/* Наличие и доставка */
.product-stock {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stock-status.in-stock .stock-text {
  color: #22c55e;
  font-weight: 600;
}

.stock-status.out-of-stock .stock-text {
  color: #ef4444;
  font-weight: 600;
}

.delivery-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-size: 14px;
}

/* Цена и кнопки */
.price-block {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 28px;
  font-weight: 700;
  color: #46a3fa;
}

.old-price {
  font-size: 18px;
  color: #94a3b8;
  text-decoration: line-through;
}

.discount-badge {
  background: #dc3545;
  color: white;
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.btn-add-to-cart {
  flex: 1;
  padding: 14px 24px;
  background: #46a3fa;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-to-cart:hover:not(:disabled) {
  background: #2c7fd4;
  transform: scale(1.02);
}

.btn-add-to-cart:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.btn-favorite {
  padding: 14px 20px;
  background: white;
  color: #1e293b;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-favorite:hover {
  border-color: #e11d48;
  color: #e11d48;
}

.btn-favorite.active {
  border-color: #e11d48;
  color: #e11d48;
  background: #fef2f2;
}

.btn-buy-now {
  width: 100%;
  padding: 12px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-buy-now:hover {
  background: #16a34a;
}

/* Табы */
.product-tabs {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.tabs-header {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: #1e293b;
}

.tab-btn.active {
  color: #46a3fa;
  border-bottom-color: #46a3fa;
}

.tab-panel {
  padding: 8px 0;
}

/* Параметры */
.params-table {
  width: 100%;
  border-collapse: collapse;
}

.params-table tr {
  border-bottom: 1px solid #f1f5f9;
}

.params-table td {
  padding: 10px 0;
}

.param-key {
  color: #6b7280;
  font-weight: 500;
  width: 40%;
}

.param-value {
  color: #1e293b;
}

.no-params {
  color: #6b7280;
}

/* Отзывы */
.review-item {
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.review-author {
  font-weight: 600;
  color: #1e293b;
}

.review-date {
  color: #94a3b8;
  font-size: 13px;
}

.review-text {
  color: #4b5563;
  margin: 0;
}

.no-reviews {
  color: #6b7280;
}

/* Адаптивность */
@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  .product-sidebar {
    min-width: auto;
  }
  .product-main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-title {
    font-size: 20px;
  }
  .action-buttons {
    flex-direction: column;
  }
  .btn-favorite {
    width: 100%;
    justify-content: center;
  }
  .tabs-header {
    overflow-x: auto;
  }
  .tab-btn {
    padding: 10px 16px;
    font-size: 13px;
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .product-main {
    padding: 16px;
  }
  .current-price {
    font-size: 22px;
  }
  .price-block {
    flex-wrap: wrap;
  }
}
</style>