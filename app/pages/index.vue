<template>
  <div class="home-page">
    <div class="home-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="home-sidebar">
        <CategoryMenu />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="home-content">
        <h1 class="home-title">Dobře naložené! 🛒</h1>
        <p class="home-subtitle">Vítejte na hlavní stránce vašeho internetového obchodu.</p>

        <!-- Блок с преимуществами -->
        <div class="home-features">
          <div class="feature-item">
            <span class="feature-icon">🚚</span>
            <div>
              <h4>DOPRAVA ZDARMA</h4>
              <p>OD 1500 KČ</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📦</span>
            <div>
              <h4>VLASTNÍ ROZVOZ</h4>
              <p>PO OKOLÍ</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">⚡</span>
            <div>
              <h4>RYCHLÉ DODÁNÍ</h4>
              <p>DO 24 HODIN</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💰</span>
            <div>
              <h4>VÝHODNÉ CENY</h4>
              <p>PRO FIRMY</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">✅</span>
            <div>
              <h4>SKLADEM</h4>
              <p>IHNED</p>
            </div>
          </div>
        </div>

        <!-- Секция "Z naší nabídky" -->
        <div class="home-products">
          <div class="products-header">
            <h2>Z naší nabídky</h2>
            <NuxtLink to="/catalog" class="show-all-link">Zobrazit vše →</NuxtLink>
          </div>
          <div class="products-grid">
            <!-- Здесь будут карточки товаров -->
            <div class="product-placeholder">Товар 1</div>
            <div class="product-placeholder">Товар 2</div>
            <div class="product-placeholder">Товар 3</div>
            <div class="product-placeholder">Товар 4</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Компонент CategoryMenu импортируется автоматически
</script>

<style scoped>
.home-page {
  padding: 20px 0;
}

.home-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

/* ===== Левая колонка ===== */
.home-sidebar {
  min-width: 220px;
}

/* ===== Правая колонка ===== */
.home-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.home-subtitle {
  font-size: 1.1rem;
  color: #4b5563;
  margin: 0 0 24px 0;
}

/* ===== Преимущества ===== */
.home-features {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-icon {
  font-size: 1.6rem;
}

.feature-item h4 {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.feature-item p {
  font-size: 0.7rem;
  color: #4b5563;
  margin: 0;
}

/* ===== Секция товаров ===== */
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
  gap: 16px;
}

.product-placeholder {
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .home-grid {
    grid-template-columns: 1fr;
  }

  .home-sidebar {
    min-width: auto;
  }

  .home-features {
    grid-template-columns: repeat(3, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .home-features {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>