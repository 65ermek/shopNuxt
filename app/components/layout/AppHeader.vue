<template>
  <header class="navbar-custom">
    <div class="navbar-inner">
      <!-- Логотип -->
      <NuxtLink class="navbar-brand" to="/">
        <span class="logo-icon">📦</span>
        <div class="logo-text">
          <span class="logo-title">VPR</span>
          <span class="logo-subtitle">GASTRO OBALY</span>
        </div>
      </NuxtLink>

      <!-- Поиск -->
      <div class="navbar-search">
        <input
            type="text"
            class="search-input"
            placeholder="Hledat produkty..."
        />
        <button class="search-btn">🔍</button>
      </div>

      <!-- Справа: Инфо + Корзина -->
      <div class="navbar-right">
        <div class="navbar-help">
          <span class="help-icon">💡</span>
          <div class="help-text">
            <span class="help-label">Nevíte si rady?</span>
            <span class="help-phone">Zavolejte.</span>
          </div>
        </div>

        <div class="navbar-cart">
          <span class="cart-price">1 ks<br/>za 110,72 Kč</span>
          <NuxtLink to="/cart" class="cart-btn">
            <span class="cart-icon">🛒</span>
            <span class="cart-badge">0</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar-custom {
  background-color: #ffffff;
  border-bottom: 2px solid #e5e7eb;
  padding: 12px 0;
}

.navbar-inner {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

/* ===== Логотип ===== */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 2rem;
  line-height: 1;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.logo-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== Поиск ===== */
.navbar-search {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 420px;
  min-width: 200px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.navbar-search:focus-within {
  border-color: #1e293b;
}

.search-input {
  flex: 1;
  padding: 8px 14px;
  border: none;
  outline: none;
  font-size: 0.9rem;
  background-color: transparent;
}

.search-btn {
  background-color: #1e293b;
  color: #ffffff;
  border: none;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #e11d48;
}

/* ===== Правая часть ===== */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.navbar-help {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f9fafb;
  padding: 6px 12px;
  border-radius: 8px;
}

.help-icon {
  font-size: 1.2rem;
}

.help-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.help-label {
  font-size: 0.65rem;
  color: #6b7280;
}

.help-phone {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}

/* ===== Корзина ===== */
.navbar-cart {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-price {
  font-size: 0.7rem;
  color: #4b5563;
  text-align: right;
  line-height: 1.2;
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  background-color: #1e293b;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
  position: relative;
}

.cart-btn:hover {
  background-color: #e11d48;
  color: #ffffff;
}

.cart-icon {
  font-size: 1.2rem;
}

.cart-badge {
  background-color: #e11d48;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 999px;
  min-width: 20px;
  text-align: center;
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .navbar-inner {
    flex-wrap: wrap;
  }

  .navbar-search {
    order: 3;
    flex-basis: 100%;
    max-width: 100%;
  }

  .navbar-right {
    gap: 12px;
  }

  .navbar-help {
    display: none;
  }
}

@media (max-width: 576px) {
  .navbar-brand .logo-title {
    font-size: 1.2rem;
  }

  .navbar-brand .logo-subtitle {
    font-size: 0.6rem;
  }

  .cart-price {
    display: none;
  }
}
</style>