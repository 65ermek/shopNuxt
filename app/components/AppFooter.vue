<template>
  <footer class="footer-custom">
    <div class="footer-inner">
      <!-- Верхняя часть подвала (основная информация) -->
      <div class="footer-top">
        <!-- Колонка 1: Логотип и описание -->
        <div class="footer-col footer-col-brand">
          <div class="footer-logo">
            <span class="logo-icon">📦</span>
            <div class="logo-text">
              <span class="logo-title">VPR</span>
              <span class="logo-subtitle">GASTRO OBALY</span>
            </div>
          </div>
          <p class="footer-description">
            Velkoobchod s gastro obaly a jednorázovým nádobím pro vaši firmu.
          </p>
        </div>

        <!-- Колонка 2: Ссылки -->
        <div class="footer-col">
          <h5 class="footer-heading">Informace</h5>
          <ul class="footer-links">
            <li><NuxtLink to="/jak-objednat">Jak objednat</NuxtLink></li>
            <li><NuxtLink to="/pro-firmy">Pro firmy a instituce</NuxtLink></li>
            <li><NuxtLink to="/obchodni-podminky">Obchodní podmínky</NuxtLink></li>
            <li><NuxtLink to="/reklamace">Reklamace a vrácení</NuxtLink></li>
          </ul>
        </div>

        <!-- Колонка 3: Kontakt -->
        <div class="footer-col">
          <h5 class="footer-heading">Kontakt</h5>
          <ul class="footer-contact">
            <li>
              <span class="contact-icon">📞</span>
              <a href="tel:+420725138598">+420 725 138 598</a>
            </li>
            <li>
              <span class="contact-icon">✉️</span>
              <a href="mailto:info@vesporrozvoz.cz">info@vesporrozvoz.cz</a>
            </li>
            <li>
              <span class="contact-icon">🏢</span>
              <span>IČ: 21024120</span>
            </li>
            <li>
              <span class="contact-icon">📋</span>
              <span>DIČ: CZ21024120</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Нижняя часть подвала (копирайт) -->
      <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <span class="copyright">
            &copy; 2026 VPR GASTRO OBALY. Všechna práva vyhrazena.
          </span>
          <span class="footer-credit">
            Vytvořeno na <a href="#" class="credit-link">Eshop-rychle.cz</a>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ===== Общие стили ===== */
.footer-custom {
  background-color: #f5f5f5;
  color: #e5e7eb;
  margin-top: auto;
}

.footer-inner {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
}

/* ===== Верхняя часть ===== */
.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr;
  gap: 40px;
  padding: 48px 0 32px 0;
}

.footer-col-brand {
  max-width: 320px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.logo-icon {
  font-size: 2.2rem;
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
  color: #ffffff;
  letter-spacing: -0.5px;
}

.logo-subtitle {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-description {
  font-size: 0.9rem;
  color: #9ca3af;
  line-height: 1.6;
  margin: 0;
}

/* ===== Колонки со ссылками ===== */
.footer-heading {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: #ffffff;
}

/* ===== Контакты ===== */
.footer-contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-contact li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #9ca3af;
}

.contact-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.footer-contact a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-contact a:hover {
  color: #ffffff;
}

/* ===== Нижняя часть (копирайт) ===== */
.footer-bottom {
  padding: 16px 0;
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.8rem;
  color: #6b7280;
}

.copyright {
  color: #6b7280;
}

.footer-credit {
  color: #6b7280;
}

.credit-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.credit-link:hover {
  color: #ffffff;
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .footer-col-brand {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 32px 0 24px 0;
  }

  .footer-bottom-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>