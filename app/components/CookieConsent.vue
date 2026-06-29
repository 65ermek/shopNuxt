<template>
  <div v-if="showBanner" class="cookie-consent">
    <div class="cookie-container">
      <!-- Левая колонка: Основная информация -->
      <div class="cookie-main">
        <div class="cookie-header">
          <span class="cookie-icon">🍪</span>
          <h3 class="cookie-title">Zkuste naše cookies</h3>
        </div>

        <p class="cookie-description">
          My, společnost VPR GASTRO OBALY, IČO 21024120 používáme soubory cookies a další
          údaje k zajištění funkčnosti webu a s Vaším souhlasem i mj. k personalizaci
          reklamy a obsahu našich webových stránek.
        </p>

        <button @click="toggleDetails" class="cookie-toggle-details">
          {{ showDetails ? 'Méně informací' : 'Více informací' }}
        </button>

        <!-- Кнопки действий -->
        <div class="cookie-actions">
          <button @click="acceptAll" class="cookie-btn cookie-btn-primary">
            Rozumím
          </button>
          <button @click="openSettings" class="cookie-btn cookie-btn-secondary">
            Nastavení
          </button>
          <button @click="rejectAll" class="cookie-btn cookie-btn-outline">
            Odmítnout vše
          </button>
        </div>
      </div>

      <!-- Правая колонка: Детальные настройки -->
      <div v-if="showDetails" class="cookie-details">
        <p class="cookie-details-intro">Na našem webu používáme:</p>

        <div class="cookie-categories">
          <!-- Технические -->
          <div class="cookie-category cookie-category-essential">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Technické cookies</h4>
                <p>Nezbytné pro fungování webu.</p>
              </div>
              <span class="cookie-badge-essential">Vždy aktivní</span>
            </div>
          </div>

          <!-- Функциональные -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Funkční cookies</h4>
                <p>Zapamatování preferencí.</p>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" v-model="preferences.functional">
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <!-- Социальные сети -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Cookies sociálních sítí</h4>
                <p>Propojení s profily na sociálních sítích.</p>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" v-model="preferences.social">
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <!-- Персонализация -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Personalizace obsahu</h4>
                <p>Přizpůsobení obsahu a reklam.</p>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" v-model="preferences.personalization">
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <!-- Неперсонализированная реклама -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Nepersonalizovaná reklama</h4>
                <p>Obecná reklama na produkty.</p>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" v-model="preferences.nonpersonalized_ads">
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <!-- Персонализированная реклама -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Personalizovaná reklama</h4>
                <p>Reklama na míru podle chování.</p>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" v-model="preferences.personalized_ads">
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <!-- Измерение аудитории -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Měření publika</h4>
                <p>Optimalizace webu.</p>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" v-model="preferences.audience_measurement">
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <!-- Третьи стороны -->
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h4>Cookies třetích stran</h4>
                <p>Cookies partnerů (např. Google).</p>
              </div>
              <label class="cookie-switch">
                <input type="checkbox" v-model="preferences.third_party">
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Юридическая информация (кратко) -->
        <div class="cookie-footer-info">
          <p class="cookie-legal">
            Udělením souhlasu se zpracováním cookies budou na Váš přístroj nainstalovány
            výše uvedené cookies. Technické cookies instalujeme vždy.
            <NuxtLink to="/cookies" class="cookie-legal-link">Více informací</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const showBanner = ref(false)
const showDetails = ref(false)

const preferences = reactive({
  functional: false,
  social: false,
  personalization: false,
  nonpersonalized_ads: false,
  personalized_ads: false,
  audience_measurement: false,
  third_party: false
})

onMounted(() => {
  const consent = localStorage.getItem('cookieConsent')
  if (!consent) {
    showBanner.value = true
  }
})

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

const acceptAll = () => {
  Object.keys(preferences).forEach(key => {
    preferences[key] = true
  })
  saveConsent('all')
  showBanner.value = false
}

const openSettings = () => {
  showDetails.value = true
}

const rejectAll = () => {
  Object.keys(preferences).forEach(key => {
    preferences[key] = false
  })
  saveConsent('essential')
  showBanner.value = false
}

const saveConsent = (type) => {
  localStorage.setItem('cookieConsent', type)
  localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
}
</script>

<style scoped>
/* ===== Общие стили ===== */
.cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  color: #1e293b;
  padding: 20px 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  border-top: 4px solid #e11d48;
  max-height: 90vh;
  overflow-y: auto;
}

.cookie-container {
  max-width: 1270px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

/* ===== Левая колонка ===== */
.cookie-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cookie-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cookie-icon {
  font-size: 2rem;
}

.cookie-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.cookie-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #334155;
  margin: 0;
}

.cookie-toggle-details {
  background: none;
  border: none;
  color: #e11d48;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  font-size: 0.9rem;
  transition: color 0.2s;
  text-align: left;
}

.cookie-toggle-details:hover {
  color: #be123c;
  text-decoration: underline;
}

/* ===== Кнопки действий ===== */
.cookie-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.cookie-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cookie-btn-primary {
  background-color: #e11d48;
  color: #ffffff;
}

.cookie-btn-primary:hover {
  background-color: #be123c;
  transform: scale(1.02);
}

.cookie-btn-secondary {
  background-color: #f1f5f9;
  color: #1e293b;
  border: 1px solid #e5e7eb;
}

.cookie-btn-secondary:hover {
  background-color: #e5e7eb;
}

.cookie-btn-outline {
  background-color: transparent;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.cookie-btn-outline:hover {
  background-color: #f1f5f9;
}

/* ===== Правая колонка (детали) ===== */
.cookie-details {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

.cookie-details::-webkit-scrollbar {
  width: 4px;
}

.cookie-details::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.cookie-details-intro {
  font-weight: 600;
  font-size: 1rem;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.cookie-categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cookie-category {
  background-color: #f8fafc;
  border-radius: 6px;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
}

.cookie-category-essential {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.cookie-category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cookie-category-info {
  flex: 1;
  min-width: 0;
}

.cookie-category-info h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 2px 0;
}

.cookie-category-info p {
  font-size: 0.75rem;
  color: #475569;
  margin: 0;
  line-height: 1.3;
}

.cookie-badge-essential {
  background-color: #cbd5e1;
  color: #1e293b;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 20px;
  white-space: nowrap;
  align-self: center;
}

/* ===== Toggle Switch ===== */
.cookie-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  align-self: center;
}

.cookie-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.cookie-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 22px;
}

.cookie-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.cookie-switch input:checked + .cookie-slider {
  background-color: #e11d48;
}

.cookie-switch input:checked + .cookie-slider:before {
  transform: translateX(18px);
}

/* ===== Юридическая информация ===== */
.cookie-footer-info {
  background-color: #f8fafc;
  padding: 12px 14px;
  border-radius: 6px;
  margin-top: 12px;
}

.cookie-legal {
  font-size: 0.75rem;
  color: #475569;
  line-height: 1.4;
  margin: 0;
}

.cookie-legal-link {
  color: #e11d48;
  text-decoration: underline;
  font-weight: 500;
}

.cookie-legal-link:hover {
  color: #be123c;
}

/* ===== Адаптивность для планшетов ===== */
@media (max-width: 992px) {
  .cookie-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .cookie-details {
    max-height: 40vh;
    border-top: 1px solid #e5e7eb;
    padding-top: 16px;
  }
}

/* ===== Адаптивность для телефонов ===== */
@media (max-width: 576px) {
  .cookie-consent {
    padding: 12px 16px;
  }

  .cookie-title {
    font-size: 1rem;
  }

  .cookie-description {
    font-size: 0.8rem;
  }

  .cookie-actions {
    flex-direction: column;
  }

  .cookie-btn {
    width: 100%;
    text-align: center;
    padding: 8px 16px;
    font-size: 0.8rem;
  }

  .cookie-category-header {
    flex-wrap: wrap;
  }

  .cookie-badge-essential {
    font-size: 0.6rem;
  }
}
</style>