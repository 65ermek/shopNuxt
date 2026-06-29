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
          <p>Nechte nám na sebe kontakt a připravíme vám nabídku na míru.</p>
        </div>

        <!-- Форма регистрации -->
        <div class="registration-form">
          <h3>Registrace nového zákazníka</h3>

          <form @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Název firmy *</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="form.companyName"
                    required
                    placeholder="Zadejte název firmy"
                />
              </div>
              <div class="form-group">
                <label class="form-label">IČO *</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="form.ico"
                    required
                    placeholder="Zadejte IČO"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Jméno *</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="form.name"
                    required
                    placeholder="Zadejte jméno a příjmení"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Telefon *</label>
                <input
                    type="tel"
                    class="form-control"
                    v-model="form.phone"
                    required
                    placeholder="Zadejte telefonní číslo"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">E-mail *</label>
                <input
                    type="email"
                    class="form-control"
                    v-model="form.email"
                    required
                    placeholder="Zadejte e-mailovou adresu"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Město *</label>
                <input
                    type="text"
                    class="form-control"
                    v-model="form.city"
                    required
                    placeholder="Zadejte město"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Zpráva (volitelné)</label>
              <textarea
                  class="form-control"
                  v-model="form.message"
                  rows="3"
                  placeholder="Vaše poznámka nebo dotaz..."
              ></textarea>
            </div>

            <div class="form-group captcha-group">
              <label class="form-label">Opište text z obrázku *</label>
              <div class="captcha-wrapper">
                <div class="captcha-image">
                  <span class="captcha-placeholder">🔒 CAPTCHA</span>
                  <button type="button" class="captcha-reload" @click="refreshCaptcha">
                    🔄
                  </button>
                </div>
                <input
                    type="text"
                    class="form-control"
                    v-model="form.captcha"
                    required
                    placeholder="Opište text z obrázku"
                />
              </div>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.consent" required />
                <span>Souhlasím se zpracováním osobních údajů.</span>
              </label>
            </div>

            <button type="submit" class="btn-submit" :disabled="isLoading">
              {{ isLoading ? 'Odesílání...' : 'Odeslat poptávku' }}
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Breadcrumbs from "~/components/common/Breadcrumbs.vue";

// Мета-информация для страницы
useHead({
  title: 'Pro firmy a instituce | New Idea',
  meta: [
    { name: 'description', content: 'Dodavatel gastro obalů a profesionální drogerie pro firmy a instituce. Obaly na jídlo, kelímky, boxy, sáčky a čisticí prostředky.' }
  ]
})

// Форма
const form = reactive({
  companyName: '',
  ico: '',
  name: '',
  phone: '',
  email: '',
  city: '',
  message: '',
  captcha: '',
  consent: false
})

const isLoading = ref(false)

// Обработка отправки формы
const handleSubmit = async () => {
  if (!form.consent) {
    alert('Pro odeslání formuláře je nutné souhlasit se zpracováním osobních údajů.')
    return
  }

  isLoading.value = true

  try {
    // Здесь будет ваш API-запрос
    console.log('Form data:', form)

    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1500))

    alert('✅ Vaše poptávka byla úspěšně odeslána. Budeme vás kontaktovat.')

    // Очистка формы
    Object.keys(form).forEach(key => {
      if (key !== 'consent') {
        form[key] = ''
      }
    })
    form.consent = false
    refreshCaptcha()

  } catch (error) {
    console.error('Chyba při odesílání:', error)
    alert('❌ Při odesílání došlo k chybě. Zkuste to prosím znovu.')
  } finally {
    isLoading.value = false
  }
}

// Обновление CAPTCHA
const refreshCaptcha = () => {
  // Здесь будет логика обновления CAPTCHA
  console.log('CAPTCHA obnovena')
}
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

/* ===== CTA ===== */
.cta-section {
  background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
  color: white;
  padding: 24px 32px;
  border-radius: 12px;
  margin-bottom: 32px;
  text-align: center;
}

.cta-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.cta-section p {
  font-size: 1rem;
  margin: 0;
  opacity: 0.95;
}

/* ===== Форма регистрации ===== */
.registration-form {
  background-color: #f8fafc;
  padding: 28px 32px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.registration-form h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  text-align: center;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  background: white;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #e11d48;
  box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
}

.form-control::placeholder {
  color: #9ca3af;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

/* ===== CAPTCHA ===== */
.captcha-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.captcha-image {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #e5e7eb;
  border-radius: 8px;
  min-height: 50px;
}

.captcha-placeholder {
  font-size: 1rem;
  color: #4b5563;
  font-weight: 500;
}

.captcha-reload {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.captcha-reload:hover {
  background-color: rgba(0,0,0,0.05);
}

/* ===== Checkbox ===== */
.checkbox-group {
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #1e293b;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-top: 1px;
  cursor: pointer;
  flex-shrink: 0;
}

/* ===== Кнопка отправки ===== */
.btn-submit {
  width: 100%;
  padding: 14px;
  background-color: #e11d48;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.btn-submit:hover:not(:disabled) {
  background-color: #be123c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
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

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
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
    padding: 20px 16px;
  }

  .cta-section h2 {
    font-size: 1.1rem;
  }

  .registration-form {
    padding: 20px 16px;
  }

  .registration-form h3 {
    font-size: 1rem;
  }

  .form-control {
    font-size: 0.88rem;
    padding: 8px 12px;
  }

  .checkbox-label {
    font-size: 0.85rem;
  }

  .btn-submit {
    padding: 12px;
    font-size: 0.95rem;
  }
}
</style>