<template>
  <div class="home-page">
    <div class="home-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="home-sidebar">
        <CategoryMenu />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="home-content">
        <HeroCarousel />

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

        <!-- Секция "Z naší nabídky" с товарами -->
        <FeaturedProducts />
      </section>
    </div>
  </div>
</template>

<script setup>
// Компоненты импортируются автоматически
import HeroCarousel from "~/components/home/HeroCarousel.vue";
import FeaturedProducts from "~/components/home/FeaturedProducts.vue";
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
.home-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== Преимущества ===== */
.home-features {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
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
}

@media (max-width: 576px) {
  .home-features {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>