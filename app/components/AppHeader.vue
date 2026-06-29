<template>
  <header class="header-custom">
    <div class="header-inner">
      <!-- Левый блок: Логотип + слоган -->
      <div class="header-left">
        <NuxtLink class="logo-link" to="/">
          <span class="logo-icon">📦</span>
          <div class="logo-text">
            <span class="logo-title">VPR</span>
            <span class="logo-subtitle">GASTRO OBALY</span>
          </div>
        </NuxtLink>
        <div class="logo-tagline d-none d-lg-block">
          <span class="tagline-icon">🚚</span>
          <span>Rozvážíme pravidelně ve vašem okolí</span>
        </div>
      </div>

      <!-- Центральная навигация (скрывается на мобильных) -->
      <ul class="nav-links d-none d-lg-flex">
        <li><NuxtLink to="/catalog">Katalog</NuxtLink></li>
        <li><NuxtLink to="/about">O nás</NuxtLink></li>
        <li><NuxtLink to="/contact">Kontakt</NuxtLink></li>
      </ul>

      <!-- Правый блок: Доставка + Корзина -->
      <div class="header-right">
        <div class="delivery-info d-none d-xl-block">
          <span class="delivery-icon">📦</span>
          <div class="delivery-text">
            <span class="delivery-label">Doprava od 120 Kč</span>
            <span class="delivery-free">ZDARMA od 1 500 Kč</span>
          </div>
        </div>

        <NuxtLink to="/cart" class="cart-btn">
          <span class="cart-icon">🛒</span>
          <span class="cart-badge">0</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ===== Общие стили ===== */
.header-custom {
  background-color: #f7f7f7;
  border-bottom: 2px solid #e5e7eb;
  padding: 12px 0;
}

.header-inner {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 20px;
}

/* ===== Левый блок (логотип) ===== */
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
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

.logo-tagline {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

.tagline-icon {
  font-size: 1rem;
}

/* ===== Навигация ===== */
.nav-links {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
}

.nav-links a {
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #e11d48;
  transition: width 0.2s;
}

.nav-links a:hover {
  color: #e11d48;
}

.nav-links a:hover::after {
  width: 100%;
}

/* ===== Правый блок (доставка + корзина) ===== */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.delivery-info {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f9fafb;
  padding: 6px 14px;
  border-radius: 8px;
}

.delivery-icon {
  font-size: 1.2rem;
}

.delivery-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.delivery-label {
  font-size: 0.7rem;
  color: #6b7280;
}

.delivery-free {
  font-size: 0.85rem;
  font-weight: 700;
  color: #16a34a;
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  background-color: #1f2937;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.cart-btn:hover {
  background-color: #111827;
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
</style>