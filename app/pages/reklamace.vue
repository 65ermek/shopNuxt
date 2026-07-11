<template>
  <div class="reklamace-page">
    <div class="reklamace-grid">
      <!-- Левая колонка: Категории (25%) -->
      <aside class="reklamace-sidebar">
        <CategoryMenu />
      </aside>

      <!-- Правая колонка: Основной контент (75%) -->
      <section class="reklamace-content">
        <Breadcrumbs />

        <div class="reklamace-header">
          <h1 class="reklamace-title">🔄 Výměna a vrácení zboží</h1>
        </div>

        <!-- Sekce 1: Výměna zboží -->
        <div class="reklamace-section">
          <div class="section-icon">🔄</div>
          <div class="section-content">
            <h2>Výměna zboží</h2>
            <p>
              V případě, že kupující po obdržení zboží zjistí, že mu nevyhovuje velikost či barva,
              má možnost do <strong>14 dnů od dodání</strong> požádat prodávajícího o výměnu zboží.
            </p>
            <div class="info-box">
              <h4>📋 Podmínky výměny:</h4>
              <ul>
                <li>Zboží musí být v <strong>originálním balení</strong></li>
                <li>Zboží musí být <strong>nepoužívané</strong></li>
                <li>Kupujícímu bude vydáno <strong>nové zboží</strong></li>
              </ul>
            </div>
            <div class="warning-box">
              <h4>⚠️ Upozornění:</h4>
              <p>
                Kupující <strong>nemá právo</strong> na výměnu zboží či vrácení peněz, pokud zboží bude:
              </p>
              <ul>
                <li>Používané</li>
                <li>Znečištěné</li>
                <li>Jakkoliv poškozené nesprávným uskladněním, použitím nebo ošetřením</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Sekce 2: Vrácení zboží -->
        <div class="reklamace-section">
          <div class="section-icon">↩️</div>
          <div class="section-content">
            <h2>Vrácení zboží do 14 dnů</h2>
            <p>
              Při nákupu zboží přes e-shop má zákazník podle občanského zákoníku právo
              zakoupené zboží <strong>bez udání důvodu do 14 dnů vrátit</strong> (odstoupit od smlouvy).
            </p>
            <div class="info-box">
              <h4>📦 Postup při vrácení:</h4>
              <ul>
                <li><strong>Doprava zpět</strong> je na náklady zákazníka</li>
                <li>Obchodník vrátí peníze za <strong>nepoškozené zboží</strong></li>
                <li>Vrácení probíhá formou <strong>bankovního převodu</strong> na účet klienta</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Sekce 3: Reklamace -->
        <div class="reklamace-section">
          <div class="section-icon">🔧</div>
          <div class="section-content">
            <h2>Reklamace</h2>
            <p>
              V případě vadného zboží má kupující právo na reklamaci, která bude posuzována
              dle potřeby na základě občanského případně obchodního zákoníku.
            </p>
            <div class="info-box">
              <h4>⏱️ Lhůta pro reklamaci:</h4>
              <ul>
                <li>Reklamace bude vyřízena v <strong>zákonem stanovené lhůtě</strong></li>
                <li>Nejpozději však do <strong>30 dnů</strong> od doručení zboží</li>
                <li>O vyřízení reklamace bude kupující informován <strong>písemně e-mailem</strong></li>
              </ul>
            </div>
            <div class="info-box">
              <h4>📌 Důležité:</h4>
              <ul>
                <li>Náklady na dopravu hradí <strong>kupující</strong></li>
                <li>Zboží musí být doručeno <strong>bez dalšího možného poškození</strong></li>
                <li>V případě uznání reklamace budou vráceny peníze <strong>bankovním převodem</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Sekce 4: Odkazy -->
        <div class="reklamace-section links-section">
          <div class="section-icon">📄</div>
          <div class="section-content">
            <h2>Dokumenty ke stažení</h2>
            <div class="links-grid">
              <a
                  href="/documents/Formular_pro_vraceni_zbozi.pdf"
                  class="download-link"
                  download
              >
                <span class="link-icon">📥</span>
                Formulář pro vrácení zboží ke stažení ZDE
                <span class="link-arrow">→</span>
              </a>
              <a
                  href="/documents/Formular_pro_reklamaci_zbozi.pdf"
                  class="download-link"
                  download
              >
                <span class="link-icon">📥</span>
                Formulář pro reklamaci zboží ke stažení ZDE
                <span class="link-arrow">→</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Odkaz na obchodní podmínky -->
        <div class="terms-link">
          <NuxtLink to="/obchodni-podminky" class="terms-link-btn">
            📖 Více v Obchodních podmínkách →
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from "~/components/common/Breadcrumbs.vue";

useHead({
  title: 'Výměna a vrácení zboží | New Idea',
  meta: [
    {
      name: 'description',
      content: 'Informace o výměně, vrácení a reklamaci zboží v internetovém obchodě New Idea. Podmínky, lhůty a formuláře ke stažení.'
    }
  ]
})
</script>

<style scoped>
.reklamace-page {
  padding: 20px 0;
}

.reklamace-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

/* ===== Левая колонка ===== */
.reklamace-sidebar {
  min-width: 220px;
}

/* ===== Правая колонка ===== */
.reklamace-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reklamace-header {
  margin-bottom: 8px;
}

.reklamace-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* ===== Секции ===== */
.reklamace-section {
  display: flex;
  gap: 20px;
  padding: 24px 28px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #46a3fa;
  transition: all 0.2s;
}

.reklamace-section:hover {
  background: #f1f5f9;
}

.section-icon {
  font-size: 2rem;
  line-height: 1;
  min-width: 48px;
  padding-top: 4px;
}

.section-content {
  flex: 1;
}

.section-content h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.section-content p {
  font-size: 0.95rem;
  color: #4b5563;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.section-content p strong {
  color: #1e293b;
}

/* ===== Info box ===== */
.info-box {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
}

.info-box h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.info-box ul li {
  font-size: 0.92rem;
  color: #4b5563;
  padding: 4px 0;
  position: relative;
  padding-left: 20px;
}

.info-box ul li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #46a3fa;
  font-weight: 700;
}

.info-box ul li strong {
  color: #1e293b;
}

/* ===== Warning box ===== */
.warning-box {
  background: #fef2f2;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.warning-box h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 8px 0;
}

.warning-box p {
  font-size: 0.92rem;
  color: #4b5563;
  margin: 0 0 8px 0;
}

.warning-box ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.warning-box ul li {
  font-size: 0.92rem;
  color: #4b5563;
  padding: 4px 0;
  position: relative;
  padding-left: 20px;
}

.warning-box ul li::before {
  content: '⚠️';
  position: absolute;
  left: 0;
}

.warning-box ul li strong {
  color: #1e293b;
}

/* ===== Ссылки для скачивания ===== */
.links-section {
  border-left-color: #22c55e;
}

.links-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
}

.download-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1e293b;
  text-decoration: none;
  transition: all 0.2s;
  font-weight: 500;
}

.download-link:hover {
  background: #f1f5f9;
  border-color: #46a3fa;
  transform: translateX(4px);
}

.download-link .link-icon {
  font-size: 1.2rem;
}

.download-link .link-arrow {
  margin-left: auto;
  color: #94a3b8;
  transition: all 0.2s;
}

.download-link:hover .link-arrow {
  color: #46a3fa;
  transform: translateX(4px);
}

/* ===== Odkaz na obchodní podmínky ===== */
.terms-link {
  margin-top: 8px;
  text-align: center;
}

.terms-link-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #1e293b;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.terms-link-btn:hover {
  background: #46a3fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(70, 163, 250, 0.3);
}

/* ===== Адаптивность ===== */
@media (max-width: 992px) {
  .reklamace-grid {
    grid-template-columns: 1fr;
  }

  .reklamace-sidebar {
    min-width: auto;
  }

  .reklamace-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .reklamace-section {
    flex-direction: column;
    gap: 12px;
    padding: 18px 20px;
  }

  .section-icon {
    font-size: 1.6rem;
  }

  .section-content h2 {
    font-size: 1.05rem;
  }

  .info-box {
    padding: 12px 16px;
  }

  .warning-box {
    padding: 12px 16px;
  }

  .download-link {
    font-size: 0.9rem;
    padding: 10px 14px;
    flex-wrap: wrap;
  }

  .terms-link-btn {
    padding: 10px 24px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .reklamace-title {
    font-size: 1.3rem;
  }

  .reklamace-section {
    padding: 14px 16px;
  }

  .section-content p {
    font-size: 0.88rem;
  }

  .info-box ul li {
    font-size: 0.85rem;
  }

  .warning-box ul li {
    font-size: 0.85rem;
  }

  .download-link {
    font-size: 0.82rem;
    padding: 8px 12px;
  }
}
</style>