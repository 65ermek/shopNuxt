<template>
  <header class="app-header">
    <!-- Основная панель -->
    <div class="header-main">
      <div class="header-main-inner">
        <!-- Логотип -->
        <NuxtLink class="header-logo" to="/">
          <div class="logo-text">
            <span class="logo-title">e</span>
            <span class="logo-highlight">obchod</span>
          </div>
        </NuxtLink>

        <!-- Поиск -->
        <div class="header-search">
          <input
              type="text"
              class="search-input"
              placeholder="Hledat produkty..."
              v-model="searchQuery"
              @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>

        <!-- Правая часть: телефон + избранное + корзина -->
        <div class="header-right">
          <!-- Телефон -->
          <div class="header-phone">
            <div class="phone-content">
              <div class="phone-label">Nevíte si rady? Zavolejte.</div>
              <a href="tel:+420732199285" class="phone-number">+420 732 199 285</a>
              <div class="phone-hours">(Po-Pá, 8-16 hod.)</div>
            </div>
          </div>

          <!-- Избранное (oblibene) -->
          <NuxtLink to="/oblibene" class="wishlist-btn">
            <span class="wishlist-icon">♥</span>
            <span class="wishlist-badge">{{ wishlistCount }}</span>
          </NuxtLink>

          <!-- Корзина с попапом (ОДИН КОНТЕЙНЕР) -->
          <div
              class="header-cart-wrapper"
              @mouseenter="showCartPopup = true"
              @mouseleave="showCartPopup = false"
          >
            <!-- Кнопка корзины -->
            <NuxtLink to="/cart" class="header-cart">
              <span class="cart-icon">🛒</span>
              <span class="cart-badge">{{ cartTotalItems }}</span>
            </NuxtLink>

            <!-- Попап -->
            <CartPopup
                :is-visible="showCartPopup"
                :cart-items="cartItems"
                @close="showCartPopup = false"
                @item-removed="handleItemRemoved"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import CartPopup from '~/components/common/CartPopup.vue'

const cartStore = useCartStore()
const searchQuery = ref('')
const showCartPopup = ref(false)

// ✅ Данные корзины из стора (только type='cart')
const cartItems = computed(() => {
  return cartStore.items.filter(item => item.type === 'cart')
})

// ✅ Общее количество товаров в корзине
const cartTotalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
})

// ✅ Количество избранных товаров
const wishlistCount = computed(() => {
  return cartStore.items.filter(item => item.type === 'favorite').length
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

// ✅ Обновление попапа после удаления товара
const handleItemRemoved = () => {
  // Попап автоматически обновится через реактивность
  // Дополнительно можно показать уведомление
  console.log('✅ Položka byla odstraněna z košíku')
}

onMounted(() => {
  cartStore.fetchCart()
})
</script>

<style scoped>
/* ===== ОБЩИЕ СТИЛИ ===== */
.app-header {
  background: #ffffff;
}

/* ===== ОСНОВНАЯ ПАНЕЛЬ ===== */
.header-main {
  background: #ffffff;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.header-main-inner {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

/* ===== ЛОГОТИП ===== */
.header-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  gap: 0;
}

.logo-text {
  display: flex;
  align-items: baseline;
  font-size: 1.8rem;
  font-weight: 700;
}

.logo-title {
  color: #1a1a1a;
  font-weight: 700;
}

.logo-highlight {
  color: #007bff;
  font-weight: 700;
}

/* ===== ПОИСК ===== */
.header-search {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 420px;
  min-width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background: #ffffff;
}

.header-search:focus-within {
  border-color: #007bff;
}

.search-input {
  flex: 1;
  padding: 8px 14px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: #1a1a1a;
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  background: #ffffff;
  border: none;
  padding: 8px 14px;
  cursor: pointer;
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
}

.search-btn:hover {
  background-color: #007bff;
  color: #ffffff;
}

/* ===== ПРАВАЯ ЧАСТЬ ===== */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

/* ===== ТЕЛЕФОН ===== */
.header-phone {
  display: flex;
  align-items: center;
}

.phone-content {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  text-align: left;
}

.phone-label {
  font-size: 11px;
  color: #999;
  margin-bottom: 1px;
}

.phone-number {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  transition: color 0.2s;
}

.phone-number:hover {
  color: #007bff;
}

.phone-hours {
  font-size: 11px;
  color: #999;
}

/* ===== ИЗБРАННОЕ (WISHLIST) ===== */
.wishlist-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  padding: 8px 14px;
  border: 1px solid #007bff;
  border-radius: 4px;
  background: #ffffff;
  color: #1a1a1a;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.wishlist-icon {
  color: #007bff;
  font-size: 1.1rem;
  line-height: 1;
  transition: color 0.2s ease;
}

.wishlist-badge {
  background-color: #007bff;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
  min-width: 18px;
  text-align: center;
  transition: all 0.2s ease;
}

.wishlist-btn:hover {
  background: #007bff;
  border-color: #007bff;
}

.wishlist-btn:hover .wishlist-icon {
  color: #ffffff;
}

.wishlist-btn:hover .wishlist-badge {
  background-color: #ffffff;
  color: #007bff;
}

/* ===== КОРЗИНА ===== */
.header-cart-wrapper {
  position: relative;
  display: inline-block;
}

.header-cart {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  border: 1px solid #007bff;
  background-color: #ffffff;
  color: #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
}

.cart-icon {
  font-size: 1.2rem;
  transition: color 0.2s ease;
}

.cart-badge {
  background-color: #007bff;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 999px;
  min-width: 20px;
  text-align: center;
  transition: all 0.2s ease;
}

.header-cart:hover {
  background-color: #007bff;
  color: #ffffff;
}

.header-cart:hover .cart-icon {
  color: #ffffff;
}

.header-cart:hover .cart-badge {
  background-color: #ffffff;
  color: #007bff;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 992px) {
  .header-search {
    max-width: 300px;
  }

  .header-main-inner {
    gap: 12px;
  }

  .wishlist-btn {
    padding: 6px 10px;
  }

  .wishlist-badge {
    font-size: 10px;
    min-width: 16px;
    padding: 1px 5px;
  }
}

@media (max-width: 768px) {
  .header-main-inner {
    flex-wrap: wrap;
    justify-content: center;
  }

  .header-logo {
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 1.4rem;
  }

  .header-search {
    order: 3;
    flex-basis: 100%;
    max-width: 100%;
    min-width: auto;
  }

  .header-right {
    gap: 12px;
  }

  .phone-content .phone-label {
    font-size: 10px;
  }

  .phone-content .phone-number {
    font-size: 13px;
  }

  .phone-content .phone-hours {
    display: none;
  }

  .wishlist-btn {
    padding: 6px 10px;
  }

  .wishlist-icon {
    font-size: 1rem;
  }

  .wishlist-badge {
    font-size: 9px;
    min-width: 14px;
    padding: 1px 4px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.1rem;
  }

  .header-cart {
    padding: 6px 12px;
  }

  .cart-icon {
    font-size: 1rem;
  }

  .cart-badge {
    font-size: 10px;
    min-width: 16px;
    padding: 1px 5px;
  }

  .search-input {
    padding: 6px 10px;
    font-size: 13px;
  }

  .search-btn {
    padding: 6px 10px;
  }

  .header-phone {
    display: none;
  }

  .wishlist-btn {
    padding: 6px 8px;
    border: none;
  }

  .wishlist-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    font-size: 9px;
    min-width: 16px;
    padding: 1px 5px;
  }
}
</style>