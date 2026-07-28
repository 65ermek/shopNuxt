<!-- layouts/AppFooter.vue -->
<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Левая часть: Информация -->
        <div class="footer-info">
          <p class="footer-copy">
            &copy; {{ new Date().getFullYear() }} New Idea. Všechna práva vyhrazena.
          </p>
          <p class="footer-text">
            Dodavatel gastro obalů a profesionální drogerie
          </p>
        </div>

        <!-- Центр: Ссылки -->
        <div class="footer-links">
          <NuxtLink to="/obchodni-podminky" class="footer-link">
            Obchodní podmínky
          </NuxtLink>
          <NuxtLink to="/ochrana-osobnich-udaju" class="footer-link">
            Ochrana osobních údajů
          </NuxtLink>
          <NuxtLink to="/kontakt" class="footer-link">
            Kontakt
          </NuxtLink>
        </div>

        <!-- Правая часть: Виджет курсов валют -->
        <div class="footer-widget">
          <CurrencyWidget />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import CurrencyWidget from '~/components/CurrencyWidget.vue'
</script>

<style scoped>
.app-footer {
  background: #1e293b;
  color: #e2e8f0;
  padding: 24px 0;
  margin-top: 40px;
}

.footer-container {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 30px;
  align-items: center;
}

.footer-info {
  text-align: left;
}

.footer-copy {
  font-size: 14px;
  margin: 0 0 4px 0;
}

.footer-text {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-link {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

.footer-widget {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }

  .footer-info {
    text-align: center;
  }

  .footer-widget {
    justify-content: center;
  }

  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .app-footer {
    padding: 16px 0;
  }

  .footer-content {
    gap: 16px;
  }

  .footer-links {
    flex-direction: column;
    gap: 8px;
  }
}
</style>