<template>
  <div class="for-business-page">
    <div class="for-business-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="for-business-sidebar">
        <CategoryMenu />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="for-business-content">
        <Breadcrumbs />
        <div class="for-business-header">
          <h1 class="for-business-title">Dodavatel gastro obalů a drogerie pro firmy a instituce</h1>
        </div>

        <!-- Вступление -->
        <div class="intro-block">
          <p class="intro-text">
            Jsme dodavatel gastro obalů a profesionální drogerie pro restaurace, bistra, rozvoz jídla, školní jídelny i další stravovací provozy.
          </p>
          <p class="intro-subtext">
            Nabízíme spolehlivé zásobování obalovým materiálem i hygienickými prostředky pro každodenní provoz.
          </p>
        </div>

        <!-- Co dodáváme -->
        <div class="products-section">
          <h2>📦 Co dodáváme</h2>
          <div class="products-grid">
            <div class="product-item">🥡 obaly na hranolky</div>
            <div class="product-item">🍔 burger boxy a menu boxy</div>
            <div class="product-item">🍕 krabice na pizzu</div>
            <div class="product-item">🥤 kelímky a víčka</div>
            <div class="product-item">🛍️ papírové tašky a sáčky</div>
            <div class="product-item">🧼 čisticí prostředky a dezinfekce</div>
          </div>
        </div>

        <!-- Proč spolupracovat s námi -->
        <div class="benefits-section">
          <h2>💡 Proč spolupracovat s námi</h2>
          <div class="benefits-grid">
            <div class="benefit-item">
              <span class="benefit-icon">⚡</span>
              <span>rychlé dodání</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">📦</span>
              <span>široký sortiment skladem</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">💰</span>
              <span>výhodné ceny pro firmy</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">🤝</span>
              <span>individuální přístup</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">🔄</span>
              <span>spolehlivé zásobování</span>
            </div>
          </div>
        </div>

        <!-- Výzva k akci -->
        <div class="cta-section">
          <h2>Hledáte spolehlivého dodavatele pro váš provoz?</h2>
          <p>Staňte se naším registrovaným zákazníkem a získejte výhodné ceny.</p>

          <!-- Ссылка на страницу регистрации -->
          <NuxtLink to="/register" class="btn-register">
            Zaregistrovat se nyní →
          </NuxtLink>
        </div>

        <!-- Блок с информацией о преимуществах регистрации -->
        <div class="info-box">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-icon">✅</span>
              <div>
                <h4>Snadná registrace</h4>
                <p>Vyplňte jednoduchý formulář a staňte se naším zákazníkem</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">💳</span>
              <div>
                <h4>Fakturace</h4>
                <p>Možnost platby na fakturu pro registrované firmy</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📊</span>
              <div>
                <h4>Velkoobchodní ceny</h4>
                <p>Speciální cenové nabídky pro registrované odběratele</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from "~/components/common/Breadcrumbs.vue";

// Мета-информация для страницы
useHead({
  title: 'Pro firmy a instituce | New Idea',
  meta: [
    { name: 'description', content: 'Dodavatel gastro obalů a profesionální drogerie pro firmy a instituce. Obaly na jídlo, kelímky, boxy, sáčky a čisticí prostředky.' }
  ]
})
</script>

<style scoped>
.for-business-page {
  padding: 20px 0;
}

.for-business-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

/* ===== Левая колонка ===== */
.for-business-sidebar {
  min-width: 220px;
}

/* ===== Правая колонка ===== */
.for-business-header {
  margin-bottom: 24px;
}

.for-business-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

/* ===== Вступление ===== */
.intro-block {
  background-color: #f8fafc;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 32px;
}

.intro-text {
  font-size: 1.05rem;
  color: #1e293b;
  margin-bottom: 12px;
  font-weight: 500;
}

.intro-subtext {
  font-size: 0.95rem;
  color: #4b5563;
  margin: 0;
}

/* ===== Co dodáváme ===== */
.products-section {
  margin-bottom: 32px;
}

.products-section h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.product-item {
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.product-item:hover {
  background-color: #f1f5f9;
  border-color: #e11d48;
}

/* ===== Proč spolupracovat s námi ===== */
.benefits-section {
  margin-bottom: 32px;
}

.benefits-section h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.benefit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s;
}

.benefit-item:hover {
  background-color: #f1f5f9;
  transform: translateY(-2px);
}

.benefit-icon {
  font-size: 1.8rem;
}

.benefit-item span:last-child {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1e293b;
}

/* ===== CTA с кнопкой регистрации ===== */
.cta-section {
  background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
  color: white;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 24px;
  text-align: center;
}

.cta-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.cta-section p {
  font-size: 1rem;
  margin: 0 0 20px 0;
  opacity: 0.95;
}

.btn-register {
  display: inline-block;
  padding: 14px 40px;
  background-color: white;
  color: #e11d48;
  border: none;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-register:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  background-color: #f8fafc;
  text-decoration: none;
  color: #be123c;
}

/* ===== Информационные блоки ===== */
.info-box {
  margin-top: 8px;
  padding: 24px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.info-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-item h4 {
  margin: 0 0 6px 0;
  font-size: 1rem;
  color: #1e293b;
}

.info-item p {
  margin: 0;
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.4;
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .for-business-grid {
    grid-template-columns: 1fr;
  }

  .for-business-sidebar {
    min-width: auto;
  }

  .for-business-title {
    font-size: 1.6rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .benefits-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .info-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

@media (max-width: 576px) {
  .for-business-title {
    font-size: 1.3rem;
  }

  .intro-block {
    padding: 16px;
  }

  .intro-text {
    font-size: 0.95rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .benefits-grid {
    grid-template-columns: 1fr 1fr;
  }

  .benefit-item {
    padding: 12px 8px;
  }

  .cta-section {
    padding: 24px 16px;
  }

  .cta-section h2 {
    font-size: 1.1rem;
  }

  .btn-register {
    padding: 12px 30px;
    font-size: 0.95rem;
    width: 100%;
  }
}
</style>