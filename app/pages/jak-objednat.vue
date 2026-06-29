<template>
  <div class="how-to-order-page">
    <div class="how-to-order-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="how-to-order-sidebar">
        <CategoryMenu />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="how-to-order-content">
        <Breadcrumbs />
        <div class="how-to-order-header">
          <h1 class="how-to-order-title">Jak objednat</h1>
        </div>

        <!-- Вступление -->
        <div class="intro-block">
          <p class="intro-text">
            Objednávku vytvoříte jednoduše přímo na e-shopu vložením zboží do košíku.
          </p>

          <div class="quick-order">
            <p><strong>👉 Objednávat můžete také rychle přes:</strong></p>
            <div class="contact-items">
              <div class="contact-item">
                <span class="contact-icon">📞</span>
                <span><strong>Telefon:</strong> +420 732 199 285</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">💬</span>
                <span><strong>WhatsApp:</strong> +420 732 199 285</span>
              </div>
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span><strong>E-mail:</strong> newidea.spol@seznam.cz</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Doprava naším autem -->
        <div class="delivery-section">
          <h2>🚗 Doprava naším autem</h2>
          <p class="delivery-areas">
            Praha a okoli
          </p>

          <div class="delivery-info">
            <p>
              <strong>Dopravu do 60 km od Prahy zajišťujeme naším vozem za 120 Kč s DPH.</strong>
            </p>
            <p class="free-delivery">
              Při objednávce nad 1 500 Kč bez DPH je u této varianty <strong>DOPRAVA ZDARMA</strong>.
            </p>
          </div>

          <div class="benefits">
            <div class="benefit-item">✔ rychlé doručení</div>
            <div class="benefit-item">✔ osobní předání zboží</div>
            <div class="benefit-item">✔ možnost domluvy času dodání</div>
          </div>
        </div>

        <!-- Doprava PPL -->
        <div class="delivery-section">
          <h2>📦 Doprava PPL</h2>

          <div class="delivery-info">
            <p>
              <strong>140 Kč s DPH</strong> doručení na výdejní místo
            </p>
            <p>
              <strong>165 Kč s DPH</strong> doručení na adresu
            </p>
            <p class="free-delivery">
              Při objednávce nad 2 500 Kč bez DPH je doprava <strong>ZDARMA</strong> (1 balík).
            </p>
            <p class="note">
              Při překročení rozměrů (50 × 50 × 100 cm) nebo hmotnosti (31,5 kg) účtujeme každý další balík 165 Kč s DPH.<br>
              O všem vás předem informujeme.
            </p>
          </div>
        </div>

        <!-- Individuální poptávka -->
        <div class="custom-request">
          <h2>📋 Individuální poptávka</h2>

          <p class="request-text">
            Nenašli jste na e-shopu, co hledáte?
          </p>

          <div class="request-info">
            <p>
              <strong>👉 Napište nám a připravíme vám nabídku na míru.</strong><br>
              Zajistíme obaly přímo od dodavatelů dle vašich potřeb.
            </p>
          </div>

          <div class="contact-cta">
            <p>Kontaktujte nás přes <strong>WhatsApp</strong> nebo <strong>formulář</strong>.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Компонент CategoryMenu импортируется автоматически

// Мета-информация для страницы
import Breadcrumbs from "~/components/common/Breadcrumbs.vue";

useHead({
  title: 'Jak objednat | New Idea',
  meta: [
    { name: 'description', content: 'Návod k objednání zboží v e-shopu New Idea. Doprava naším autem, PPL a individuální poptávka.' }
  ]
})
</script>

<style scoped>
.how-to-order-page {
  padding: 20px 0;
}

.how-to-order-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

/* ===== Левая колонка ===== */
.how-to-order-sidebar {
  min-width: 220px;
}

/* ===== Правая колонка ===== */
.how-to-order-header {
  margin-bottom: 24px;
}

.how-to-order-title {
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
  margin-bottom: 16px;
  font-weight: 500;
}

.quick-order p {
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #1e293b;
}

.contact-icon {
  font-size: 1.2rem;
  min-width: 28px;
}

/* ===== Секции доставки ===== */
.delivery-section {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 2px solid #e5e7eb;
}

.delivery-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.delivery-section h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.delivery-areas {
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 16px;
  font-weight: 500;
}

.delivery-info p {
  font-size: 0.95rem;
  color: #1e293b;
  margin-bottom: 10px;
  line-height: 1.6;
}

.free-delivery {
  font-size: 1rem;
  color: #e11d48;
  font-weight: 500;
  padding: 10px 16px;
  background-color: #fef2f2;
  border-radius: 6px;
  margin: 12px 0;
}

.free-delivery strong {
  color: #e11d48;
}

.note {
  color: #6b7280 !important;
  font-size: 0.9rem !important;
  padding: 12px 16px;
  background-color: #f3f4f6;
  border-radius: 6px;
  margin-top: 12px;
}

/* ===== Преимущества ===== */
.benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin-top: 16px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.benefit-item {
  font-size: 0.95rem;
  color: #1e293b;
}

/* ===== Индивидуальная попытка ===== */
.custom-request {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 28px 32px;
  border-radius: 12px;
  margin-top: 8px;
}

.custom-request h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.request-text {
  font-size: 1.05rem;
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 500;
}

.request-info p {
  font-size: 0.95rem;
  color: #1e293b;
  line-height: 1.8;
  margin-bottom: 16px;
}

.contact-cta {
  padding: 16px 20px;
  background-color: white;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e11d48;
}

.contact-cta p {
  font-size: 1rem;
  color: #1e293b;
  margin: 0;
}

.contact-cta strong {
  color: #e11d48;
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .how-to-order-grid {
    grid-template-columns: 1fr;
  }

  .how-to-order-sidebar {
    min-width: auto;
  }

  .how-to-order-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 576px) {
  .how-to-order-title {
    font-size: 1.3rem;
  }

  .intro-block {
    padding: 16px;
  }

  .intro-text {
    font-size: 0.95rem;
  }

  .contact-item {
    font-size: 0.88rem;
  }

  .delivery-section {
    padding-bottom: 24px;
  }

  .delivery-section h2 {
    font-size: 1.1rem;
  }

  .benefits {
    flex-direction: column;
    gap: 6px;
    padding: 12px 16px;
  }

  .custom-request {
    padding: 20px 16px;
  }

  .request-text {
    font-size: 0.95rem;
  }

  .request-info p {
    font-size: 0.88rem;
  }

  .contact-cta {
    padding: 12px 16px;
  }

  .contact-cta p {
    font-size: 0.9rem;
  }
}
</style>