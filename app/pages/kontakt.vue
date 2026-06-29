<template>
  <div class="contact-page">
    <div class="contact-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="contact-sidebar">
        <CategoryMenu />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="contact-content">
        <Breadcrumbs />
        <div class="contact-header">
          <h1 class="contact-title">Kontakt</h1>
        </div>

        <!-- Информация о компании -->
        <div class="company-info-block">
          <h2 class="company-name">New Idea, spol. s r.o.</h2>
        </div>

        <!-- Osobní odběr -->
        <div class="contact-section pickup-section">
          <div class="section-icon">📍</div>
          <div class="section-content">
            <h3>Osobní odběr</h3>
            <p>Po předešlé domluvě je možné zboží vyzvednout osobně na adrese:</p>
            <p class="address"><strong>Zagarolská 163, 27751 Nelahozeves</strong></p>
          </div>
        </div>

        <!-- E-mail -->
        <div class="contact-section email-section">
          <div class="section-icon">📧</div>
          <div class="section-content">
            <h3>Máte dotaz ohledně sortimentu, potřebujete jiné obaly?</h3>
            <p>Napište nám!</p>
            <a href="mailto:newidea.spol@seznam.cz" class="contact-link">
              <strong>newidea.spol@seznam.cz</strong>
            </a>
          </div>
        </div>

        <!-- Telefon -->
        <div class="contact-section phone-section">
          <div class="section-icon">📞</div>
          <div class="section-content">
            <h3>Nebo rovnou zavolejte:</h3>
            <a href="tel:+420732199285" class="contact-link phone-link">
              <strong>+420 732 199 285</strong>
            </a>
          </div>
        </div>

        <!-- Otevírací doba / Další informace -->
        <div class="info-block">
          <div class="info-item">
            <span class="info-icon">🕐</span>
            <div>
              <h4>Provozní doba</h4>
              <p>Po–Pá: 8:00 – 17:00</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">💬</span>
            <div>
              <h4>WhatsApp</h4>
              <a href="https://wa.me/420732199285" class="contact-link">
                +420 732 199 285
              </a>
            </div>
          </div>
        </div>

        <!-- Google mapa -->
        <div class="map-section">
          <h4>📍 Kde nás najdete</h4>
          <div class="map-wrapper">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.123456789012!2d14.2678!3d50.1234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDA3JzI0LjAiTiAxNMKwMTYnMDQuMCJF!5e0!3m2!1scs!2scz!4v1234567890"
                width="100%"
                height="250"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <p class="map-note">
              <a href="https://maps.google.com/maps?q=Zagarolsk%C3%A1+163,+27751+Nelahozeves" target="_blank" rel="noopener noreferrer">
                📍 Otevřít v Google Maps
              </a>
            </p>
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
  title: 'Kontakt | New Idea',
  meta: [
    { name: 'description', content: 'Kontaktní informace New Idea, spol. s r.o. Osobní odběr Zagarolská 163, Nelahozeves. Telefon, e-mail, WhatsApp.' }
  ]
})
</script>

<style scoped>
.contact-page {
  padding: 20px 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

/* ===== Левая колонка ===== */
.contact-sidebar {
  min-width: 220px;
}

/* ===== Правая колонка ===== */
.contact-header {
  margin-bottom: 24px;
}

.contact-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

/* ===== Информация о компании ===== */
.company-info-block {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 20px 28px;
  border-radius: 12px;
  margin-bottom: 32px;
}

.company-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

/* ===== Контактные секции ===== */
.contact-section {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px 28px;
  background-color: #f8fafc;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.2s;
  border-left: 4px solid transparent;
}

.contact-section:hover {
  background-color: #f1f5f9;
}

.pickup-section {
  border-left-color: #e11d48;
}

.email-section {
  border-left-color: #3b82f6;
}

.phone-section {
  border-left-color: #22c55e;
}

.section-icon {
  font-size: 2rem;
  line-height: 1;
  min-width: 48px;
  padding-top: 2px;
}

.section-content h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.section-content p {
  font-size: 0.95rem;
  color: #4b5563;
  margin: 0 0 4px 0;
}

.section-content .address {
  font-size: 1rem;
  color: #1e293b;
  margin-top: 4px;
}

.contact-link {
  color: #e11d48;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.2s;
  display: inline-block;
}

.contact-link:hover {
  color: #be123c;
  text-decoration: underline;
}

.phone-link {
  font-size: 1.3rem;
  color: #22c55e;
}

.phone-link:hover {
  color: #16a34a;
}

/* ===== Информационный блок ===== */
.info-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 24px 0 32px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background-color: #f8fafc;
  border-radius: 10px;
}

.info-icon {
  font-size: 1.6rem;
}

.info-item h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 2px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  font-size: 0.95rem;
  color: #1e293b;
  margin: 0;
  font-weight: 500;
}

.info-item .contact-link {
  font-size: 0.95rem;
  font-weight: 500;
}

/* ===== Карта ===== */
.map-section {
  margin-top: 8px;
}

.map-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.map-wrapper {
  background-color: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.map-wrapper iframe {
  display: block;
}

.map-note {
  padding: 12px 16px;
  margin: 0;
  text-align: center;
  background-color: white;
}

.map-note a {
  color: #e11d48;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.map-note a:hover {
  color: #be123c;
  text-decoration: underline;
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .contact-sidebar {
    min-width: auto;
  }

  .contact-title {
    font-size: 1.6rem;
  }

  .info-block {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .contact-title {
    font-size: 1.3rem;
  }

  .company-name {
    font-size: 1.1rem;
  }

  .contact-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 18px 20px;
  }

  .section-icon {
    font-size: 1.6rem;
  }

  .section-content h3 {
    font-size: 0.95rem;
  }

  .section-content p {
    font-size: 0.88rem;
  }

  .contact-link {
    font-size: 1rem;
  }

  .phone-link {
    font-size: 1.1rem;
  }

  .info-item {
    padding: 14px 16px;
  }

  .info-item h4 {
    font-size: 0.75rem;
  }

  .info-item p,
  .info-item .contact-link {
    font-size: 0.88rem;
  }

  .map-wrapper iframe {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .company-info-block {
    padding: 16px 20px;
  }

  .contact-section {
    padding: 14px 16px;
  }

  .section-icon {
    font-size: 1.4rem;
  }
}
</style>