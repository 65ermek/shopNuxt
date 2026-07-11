<template>
  <div class="forgot-password-page">
    <div class="forgot-password-grid">
      <aside class="forgot-password-sidebar">
        <CategoryMenu />
      </aside>

      <section class="forgot-password-content">
        <Breadcrumbs />

        <h1 class="forgot-password-title">🔑 Zapomenuté heslo</h1>

        <div class="forgot-password-container">
          <div class="forgot-password-info">
            <p class="info-text">
              Zadejte svou e-mailovou adresu a pošleme vám odkaz pro obnovení hesla.
            </p>
          </div>

          <div class="forgot-password-form">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input
                    v-model="email"
                    type="email"
                    class="form-input"
                    required
                    placeholder="vas@email.cz"
                />
              </div>

              <div class="form-success" v-if="successMessage">
                {{ successMessage }}
              </div>

              <div class="form-error" v-if="errorMessage">
                {{ errorMessage }}
              </div>

              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? 'Odesílám...' : 'Odeslat odkaz' }}
              </button>
            </form>

            <div class="form-links">
              <p>
                <NuxtLink to="/login" class="link">← Zpět na přihlášení</NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumbs from "~/components/common/Breadcrumbs.vue"

const router = useRouter()
const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async (): Promise<void> => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !email.value.includes('@')) {
    errorMessage.value = 'Zadejte prosím platný email'
    return
  }

  loading.value = true

  try {
    // Здесь будет запрос к API для восстановления пароля
    // const response = await $fetch('https://obchod.tanatar.cz/api/password/email', {
    //   method: 'POST',
    //   body: { email: email.value }
    // })

    // Имитация успешного ответа
    await new Promise(resolve => setTimeout(resolve, 1000))

    successMessage.value = 'Odkaz pro obnovení hesla byl odeslán na váš email.'
    email.value = ''

  } catch (error) {
    console.error('❌ Chyba při odesílání:', error)
    errorMessage.value = 'Nepodařilo se odeslat odkaz. Zkuste to prosím znovu.'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Zapomenuté heslo | New Idea',
  meta: [
    {
      name: 'description',
      content: 'Obnovte své heslo k účtu v internetovém obchodě New Idea.'
    }
  ]
})
</script>

<style scoped>
.forgot-password-page {
  padding: 20px 0;
}

.forgot-password-grid {
  display: grid;
  grid-template-columns: 25% 75%;
  gap: 30px;
}

.forgot-password-sidebar {
  min-width: 220px;
}

.forgot-password-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.forgot-password-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.forgot-password-container {
  background: white;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  max-width: 500px;
}

.forgot-password-info {
  margin-bottom: 24px;
}

.info-text {
  color: #4b5563;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.forgot-password-form {
  /* пусто */
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: border-color 0.2s;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #46a3fa;
  box-shadow: 0 0 0 3px rgba(70, 163, 250, 0.1);
}

.form-success {
  padding: 10px 14px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
}

.form-error {
  padding: 10px 14px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #46a3fa;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #2c7fd4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(70, 163, 250, 0.3);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.form-links {
  margin-top: 16px;
  text-align: center;
}

.form-links .link {
  color: #46a3fa;
  text-decoration: none;
  font-weight: 500;
}

.form-links .link:hover {
  text-decoration: underline;
}

@media (max-width: 992px) {
  .forgot-password-grid {
    grid-template-columns: 1fr;
  }
  .forgot-password-sidebar {
    min-width: auto;
  }
  .forgot-password-title {
    font-size: 22px;
  }
}

@media (max-width: 768px) {
  .forgot-password-container {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .forgot-password-title {
    font-size: 18px;
  }
  .forgot-password-container {
    padding: 12px;
  }
  .form-input {
    font-size: 13px;
    padding: 8px 12px;
  }
  .submit-btn {
    font-size: 14px;
    padding: 12px;
  }
}
</style>