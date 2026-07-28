<template>
  <div class="delivery-page">
    <CheckoutStepper :current-step="3" />

    <div class="auth-invite-content">
      <div class="auth-invite-text">
        <h3 class="auth-invite-title">Už jste u nás nakupovali?</h3>
        <NuxtLink to="/login">Přihlásit se</NuxtLink>
      </div>
    </div>

    <div class="delivery-container">
      <div class="delivery-grid">
        <!-- Левая колонка -->
        <div class="delivery-left">
          <form @submit.prevent="submitForm" class="delivery-form">
            <!-- Osobní údaje -->
            <div class="form-section">
              <h2 class="section-title">Osobní údaje</h2>
              <ClientOnly>
                <div v-if="isUserLoggedIn" class="auth-user-info">
                  <div class="info-row"><span class="info-label">E-mail:</span><span class="info-value">{{ customerData.email || 'Neznámé' }}</span></div>
                  <div class="info-row"><span class="info-label">Jméno:</span><span class="info-value">{{ customerData.name || 'Neznámé' }}</span></div>
                  <div class="info-row"><span class="info-label">Telefon:</span><span class="info-value">{{ customerData.phone || 'Neznámé' }}</span></div>
                  <div class="info-note"><NuxtLink to="/profil" class="link">profilu</NuxtLink>.</div>
                </div>
                <div v-else class="guest-fields">
                  <div class="form-group">
                    <label class="form-label" :class="{ error: formErrors.email }">Váš e-mail (login) *</label>
                    <input
                        v-model="form.email"
                        type="email"
                        class="form-input"
                        :class="{ error: formErrors.email }"
                        required
                        placeholder="jan.novak@email.cz"
                        @focus="clearError('email')"
                    />
                    <span class="error-message" :class="{ show: formErrors.email }">Prosím, vyplňte e-mail</span>
                  </div>
                  <div class="form-row-two-columns">
                    <div class="form-group">
                      <label class="form-label" :class="{ error: formErrors.name }">Jméno a příjmení *</label>
                      <input
                          v-model="form.name"
                          type="text"
                          class="form-input"
                          :class="{ error: formErrors.name }"
                          required
                          placeholder="Jan Novák"
                          @focus="clearError('name')"
                      />
                      <span class="error-message" :class="{ show: formErrors.name }">Prosím, vyplňte jméno</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label" :class="{ error: formErrors.phone }">Telefon *</label>
                      <input
                          v-model="form.phone"
                          type="tel"
                          class="form-input"
                          :class="{ error: formErrors.phone }"
                          required
                          placeholder="+420 123 456 789"
                          @focus="clearError('phone')"
                      />
                      <span class="error-message" :class="{ show: formErrors.phone }">Prosím, vyplňte telefon</span>
                    </div>
                  </div>
                </div>
                <template #fallback>
                  <div class="guest-fields">
                    <div class="form-group">
                      <label class="form-label">Váš e-mail (login) *</label>
                      <input type="email" class="form-input" placeholder="Načítání..." disabled />
                    </div>
                    <div class="form-row-two-columns">
                      <div class="form-group">
                        <label class="form-label">Jméno a příjmení *</label>
                        <input type="text" class="form-input" placeholder="Načítání..." disabled />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Telefon *</label>
                        <input type="tel" class="form-input" placeholder="Načítání..." disabled />
                      </div>
                    </div>
                  </div>
                </template>
              </ClientOnly>
            </div>

            <!-- Dodací adresa -->
            <ClientOnly>
              <div class="form-section">
                <h2 class="section-title">Dodací adresa</h2>
                <div class="delivery-address-fields">
                  <div class="form-group">
                    <label class="form-label" :class="{ error: formErrors.deliveryStreet }">Ulice a číslo popisné *</label>
                    <input
                        v-model="form.deliveryStreet"
                        type="text"
                        class="form-input"
                        :class="{ error: formErrors.deliveryStreet }"
                        required
                        :placeholder="getDeliveryStreetPlaceholder()"
                        @focus="clearError('deliveryStreet')"
                    />
                    <span class="error-message" :class="{ show: formErrors.deliveryStreet }">Prosím, vyplňte ulici</span>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" :class="{ error: formErrors.deliveryCity }">Město *</label>
                      <input
                          v-model="form.deliveryCity"
                          type="text"
                          class="form-input"
                          :class="{ error: formErrors.deliveryCity }"
                          required
                          :placeholder="getDeliveryCityPlaceholder()"
                          @focus="clearError('deliveryCity')"
                      />
                      <span class="error-message" :class="{ show: formErrors.deliveryCity }">Prosím, vyplňte město</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label" :class="{ error: formErrors.deliveryPostcode }">PSČ *</label>
                      <input
                          v-model="form.deliveryPostcode"
                          type="text"
                          class="form-input"
                          :class="{ error: formErrors.deliveryPostcode }"
                          required
                          :placeholder="getDeliveryPostcodePlaceholder()"
                          @focus="clearError('deliveryPostcode')"
                      />
                      <span class="error-message" :class="{ show: formErrors.deliveryPostcode }">Prosím, vyplňte PSČ</span>
                    </div>
                  </div>
                </div>
              </div>
            </ClientOnly>

            <!-- Firma -->
            <ClientOnly>
              <div class="form-section">
                <div class="form-checkbox">
                  <input id="isCompany" v-model="form.isCompany" type="checkbox" class="checkbox-input" />
                  <label for="isCompany" class="checkbox-label">Nakupuji na firmu nebo společnost</label>
                </div>

                <div v-if="form.isCompany" class="company-fields">
                  <div class="invoice-address-section">
                    <h3 class="subsection-title">Dodací a fakturační adresa</h3>
                    <div class="form-group">
                      <label class="form-label" :class="{ error: formErrors.invoiceStreet }">Ulice *</label>
                      <input
                          v-model="form.invoiceStreet"
                          type="text"
                          class="form-input"
                          :class="{ error: formErrors.invoiceStreet }"
                          required
                          placeholder="U záběhlického zámku 48/13"
                          @focus="clearError('invoiceStreet')"
                      />
                      <span class="error-message" :class="{ show: formErrors.invoiceStreet }">Prosím, vyplňte ulici</span>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label" :class="{ error: formErrors.invoiceCity }">Město *</label>
                        <input
                            v-model="form.invoiceCity"
                            type="text"
                            class="form-input"
                            :class="{ error: formErrors.invoiceCity }"
                            required
                            placeholder="Praha"
                            @focus="clearError('invoiceCity')"
                        />
                        <span class="error-message" :class="{ show: formErrors.invoiceCity }">Prosím, vyplňte město</span>
                      </div>
                      <div class="form-group">
                        <label class="form-label" :class="{ error: formErrors.invoicePostcode }">PSČ *</label>
                        <input
                            v-model="form.invoicePostcode"
                            type="text"
                            class="form-input"
                            :class="{ error: formErrors.invoicePostcode }"
                            required
                            placeholder="110 00"
                            @focus="clearError('invoicePostcode')"
                        />
                        <span class="error-message" :class="{ show: formErrors.invoicePostcode }">Prosím, vyplňte PSČ</span>
                      </div>
                    </div>
                  </div>

                  <h3 class="subsection-title">Nakupuji na firmu</h3>
                  <div class="form-group">
                    <label class="form-label" :class="{ error: formErrors.companyName }">Název firmy *</label>
                    <input
                        v-model="form.companyName"
                        type="text"
                        class="form-input"
                        :class="{ error: formErrors.companyName }"
                        required
                        placeholder="Název firmy"
                        @focus="clearError('companyName')"
                    />
                    <span class="error-message" :class="{ show: formErrors.companyName }">Prosím, vyplňte název firmy</span>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" :class="{ error: formErrors.ico }">IČO *</label>
                      <div class="ico-wrapper">
                        <input
                            v-model="form.ico"
                            type="text"
                            class="form-input"
                            :class="{ error: formErrors.ico }"
                            required
                            placeholder="12345678"
                            @focus="clearError('ico')"
                            @keydown.enter.prevent="importByIco"
                        />
                        <button type="button" class="ico-import-btn" @click="importByIco" :disabled="isImporting">
                          {{ isImporting ? 'Načítám...' : 'Import podle IČ' }}
                        </button>
                      </div>
                      <span class="error-message" :class="{ show: formErrors.ico }">Prosím, vyplňte IČO</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">DIČ</label>
                      <input v-model="form.dic" type="text" class="form-input" placeholder="CZ12345678" />
                    </div>
                  </div>
                </div>
              </div>
            </ClientOnly>

            <!-- Doručovací adresa je odlišná od fakturační adresy -->
            <ClientOnly>
              <div class="form-section">
                <div class="form-checkbox">
                  <input id="isDifferentDelivery" v-model="form.isDifferentDelivery" type="checkbox" class="checkbox-input" />
                  <label for="isDifferentDelivery" class="checkbox-label">Doručovací adresa je odlišná od fakturační adresy</label>
                </div>
                <div v-if="form.isDifferentDelivery" class="delivery-fields">
                  <div class="form-group">
                    <label class="form-label" :class="{ error: formErrors.deliveryName }">Jméno / název firmy *</label>
                    <input
                        v-model="form.deliveryName"
                        type="text"
                        class="form-input"
                        :class="{ error: formErrors.deliveryName }"
                        required
                        placeholder="Jan Novák / Firma s.r.o."
                        @focus="clearError('deliveryName')"
                    />
                    <span class="error-message" :class="{ show: formErrors.deliveryName }">Prosím, vyplňte jméno</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label" :class="{ error: formErrors.deliveryStreet2 }">Ulice *</label>
                    <input
                        v-model="form.deliveryStreet2"
                        type="text"
                        class="form-input"
                        :class="{ error: formErrors.deliveryStreet2 }"
                        required
                        placeholder="U záběhlického zámku 48/13"
                        @focus="clearError('deliveryStreet2')"
                    />
                    <span class="error-message" :class="{ show: formErrors.deliveryStreet2 }">Prosím, vyplňte ulici</span>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" :class="{ error: formErrors.deliveryCity2 }">Město *</label>
                      <input
                          v-model="form.deliveryCity2"
                          type="text"
                          class="form-input"
                          :class="{ error: formErrors.deliveryCity2 }"
                          required
                          placeholder="Praha"
                          @focus="clearError('deliveryCity2')"
                      />
                      <span class="error-message" :class="{ show: formErrors.deliveryCity2 }">Prosím, vyplňte město</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label" :class="{ error: formErrors.deliveryPostcode2 }">PSČ *</label>
                      <input
                          v-model="form.deliveryPostcode2"
                          type="text"
                          class="form-input"
                          :class="{ error: formErrors.deliveryPostcode2 }"
                          required
                          placeholder="110 00"
                          @focus="clearError('deliveryPostcode2')"
                      />
                      <span class="error-message" :class="{ show: formErrors.deliveryPostcode2 }">Prosím, vyplňte PSČ</span>
                    </div>
                  </div>
                </div>
              </div>
            </ClientOnly>

            <!-- Poznámka -->
            <div class="form-section">
              <div class="form-checkbox" @click="toggleNote">
                <input id="showNote" v-model="showNote" type="checkbox" class="checkbox-input" />
                <label for="showNote" class="checkbox-label">Zadat poznámku</label>
              </div>
              <div v-if="showNote" class="note-fields">
                <textarea v-model="form.note" class="form-textarea" rows="3" placeholder="Napište nám něco k objednávce..."></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Правая колонка -->
        <ClientOnly>
          <div class="delivery-right">
            <div class="order-summary">
              <h2 class="section-title">Souhrn objednávky</h2>

              <div class="summary-items">
                <div v-for="(item, index) in cartItems" :key="item.id" class="summary-item" :class="{ 'summary-item-border': index > 0 }">
                  <div class="summary-item-left">
                    <img :src="getProductImage(item)" :alt="getProductName(item)" class="summary-item-image" loading="lazy" @error="handleImageError" />
                    <span class="item-name">{{ item.quantity }}x {{ getProductName(item) }}</span>
                  </div>
                  <div class="summary-item-right">
                    <span class="item-price">{{ formatPrice(getProductPrice(item) * item.quantity) }} Kč</span>
                  </div>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-totals">
                <div class="summary-row summary-row-border">
                  <span class="summary-label">Cena zboží:</span>
                  <span class="summary-value">{{ formatPrice(cartTotalPrice) }} Kč</span>
                </div>

                <div v-if="selectedShipping" class="summary-row summary-row-border">
                  <span class="summary-label">Způsob dopravy:</span>
                  <span class="summary-value">{{ selectedShippingOption?.free && cartTotalPrice >= selectedShippingOption?.free ? 'ZDARMA' : formatPrice(shippingPrice) + ' Kč' }}</span>
                </div>

                <div v-if="selectedShipping && getShippingDetail()" class="summary-row summary-detail summary-row-border">
                  <span class="summary-value detail-value">{{ getShippingDetail() }}</span>
                </div>

                <div v-if="selectedPayment" class="summary-row summary-row-border">
                  <span class="summary-label">Způsob platby:</span>
                  <span class="summary-value">{{ selectedPaymentOption?.price || 'ZDARMA' }}</span>
                </div>

                <div v-if="selectedPayment && getPaymentDetail()" class="summary-row summary-detail summary-row-border">
                  <span class="summary-value detail-value">{{ getPaymentDetail() }}</span>
                </div>

                <div v-if="selectedShipping === 'zasilkovna' && displayParcelshop" class="summary-row summary-address summary-row-border">
                  <span class="summary-label">Adresa Zasilkovna:</span>
                  <span class="summary-value address-value">{{ displayParcelshop.name }}</span>
                </div>

                <div v-if="selectedShipping === 'balikovna' && displayBalikovna" class="summary-row summary-address summary-row-border">
                  <span class="summary-label">Adresa Balíkovna:</span>
                  <span class="summary-value address-value">{{ displayBalikovna.name }}</span>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-price-block">
                <div class="summary-price-row">
                  <span class="summary-price-label">Celková cena:</span>
                  <span class="summary-price-value">{{ formatPrice(finalTotalPrice) }} Kč</span>
                </div>
              </div>

              <div class="summary-actions">
                <NuxtLink to="/doprava-a-platba" class="continue-shopping">← zpět</NuxtLink>
                <button type="submit" class="checkout-btn" :disabled="submitting" @click="submitForm">
                  {{ submitting ? 'Odesílám...' : 'Pokračovat k rekapitulaci →' }}
                </button>
              </div>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'checkout',
  ssr: false
})

import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useAuthStore } from '~/stores/authStore'
import { useToastStore } from '~/stores/toastStore'
import CheckoutStepper from '~/components/CheckoutStepper.vue'
import { getCompanyData, isValidIco } from '~/utils/ares'

const cartStore = useCartStore()
const authStore = useAuthStore()
const toastStore = useToastStore()
const submitting = ref(false)
const isLoadingUser = ref(true)
const isImporting = ref(false)

const STORAGE_KEY = 'dodaci_udaje_form'
const showNote = ref(false)

// ============================================================
// 📌 ФЛАГИ ДЛЯ ПРЕДОТВРАЩЕНИЯ ЦИКЛОВ
// ============================================================
const isInternalUpdate = ref(false)
let isInitializing = true
let saveTimeout = null
let lastSavedFormHash = ''

// ============================================================
// 📌 LOCALSTORAGE
// ============================================================

const saveFormToStorage = (data) => {
  if (typeof window === 'undefined') return
  try {
    const formData = { ...data, _timestamp: Date.now() }
    const hash = JSON.stringify(formData)
    if (hash === lastSavedFormHash) return // Предотвращение лишних сохранений
    lastSavedFormHash = hash
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  } catch (e) {
    console.error('❌ Chyba při ukládání:', e)
  }
}

const loadFormFromStorage = () => {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    const data = JSON.parse(saved)
    if (data._timestamp && Date.now() - data._timestamp > 30 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return data
  } catch (e) {
    return null
  }
}

const saveBeforeUnload = () => {
  if (!isInternalUpdate.value) {
    saveFormToStorage(form.value)
  }
}

// ============================================================
// 📌 ВАЛИДАЦИЯ
// ============================================================

const formErrors = ref({})

const clearError = (field) => {
  if (formErrors.value[field]) {
    delete formErrors.value[field]
    // Используем nextTick для реактивности
    nextTick(() => {
      formErrors.value = { ...formErrors.value }
    })
  }
}

const validateForm = () => {
  const errors = {}

  // Обязательные поля
  if (!form.value.email?.trim()) errors.email = true
  if (!form.value.name?.trim()) errors.name = true
  if (!form.value.phone?.trim()) errors.phone = true
  if (!form.value.deliveryStreet?.trim()) errors.deliveryStreet = true
  if (!form.value.deliveryCity?.trim()) errors.deliveryCity = true
  if (!form.value.deliveryPostcode?.trim()) errors.deliveryPostcode = true

  // Проверка для NAŠE AUTO
  if (selectedShipping.value === 'our-car') {
    if (!form.value.deliveryStreet?.trim() ||
        !form.value.deliveryCity?.trim() ||
        !form.value.deliveryPostcode?.trim()) {
      toastStore.warning(
          'Chybí adresa',
          'Pro doručení NAŠE AUTO prosím vyplňte ulici, město a PSČ.'
      )
      return false
    }
  }

  // Проверка для компании
  if (form.value.isCompany) {
    if (!form.value.companyName?.trim()) errors.companyName = true
    if (!form.value.ico?.trim()) errors.ico = true
    if (!form.value.invoiceStreet?.trim()) errors.invoiceStreet = true
    if (!form.value.invoiceCity?.trim()) errors.invoiceCity = true
    if (!form.value.invoicePostcode?.trim()) errors.invoicePostcode = true
  }

  // Проверка для разной доставки
  if (form.value.isDifferentDelivery) {
    if (!form.value.deliveryName?.trim()) errors.deliveryName = true
    if (!form.value.deliveryStreet2?.trim()) errors.deliveryStreet2 = true
    if (!form.value.deliveryCity2?.trim()) errors.deliveryCity2 = true
    if (!form.value.deliveryPostcode2?.trim()) errors.deliveryPostcode2 = true
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// ============================================================
// 📌 ДАННЫЕ
// ============================================================

const selectedShipping = computed(() => authStore.shippingData.shippingMethod || null)
const selectedPayment = computed(() => authStore.shippingData.paymentMethod || null)

const displayParcelshop = ref(null)
const displayBalikovna = ref(null)
const pplParcelshopData = ref(null)

const shippingOptions = [
  { id: 'ppl', name: 'PPL - Kurýr', price: 110, free: 2500 },
  { id: 'ppl-parcelshop', name: 'PPL ParcelShop a Box', price: 80, free: 2500 },
  { id: 'zasilkovna', name: 'Zásilkovna', price: 79, free: 1500 },
  { id: 'balikovna', name: 'Balíkovna', price: 69, free: 1500 },
  { id: 'our-car', name: 'NAŠE AUTO - Praha + Okolí do 60 km', price: 50, free: 1500 }
]

const paymentOptions = [
  { id: 'dobirka', name: 'Platba dobírkou', price: '35 Kč', price_value: 35 },
  { id: 'bank-transfer', name: 'Bankovním převodem', price: 'ZDARMA', price_value: 0 },
  { id: 'qr-payment', name: 'Okamžitá platba QR kódem', price: 'ZDARMA', price_value: 0 }
]

const isUserLoggedIn = computed(() => authStore.isAuthenticated && !!authStore.customer)
const customerData = computed(() => authStore.customerData)
const selectedShippingName = computed(() => shippingOptions.find(o => o.id === selectedShipping.value)?.name || 'Neznámé')
const selectedPaymentName = computed(() => paymentOptions.find(o => o.id === selectedPayment.value)?.name || 'Neznámé')

// ============================================================
// 📌 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

const getShippingDetail = () => {
  if (!selectedShipping.value) return ''
  const map = {
    ppl: 'PPL',
    'ppl-parcelshop': 'PPL ParcelShop',
    zasilkovna: 'Zásilkovna',
    balikovna: 'Balíkovna',
    'our-car': 'NAŠE AUTO'
  }
  return map[selectedShipping.value] || ''
}

const getPaymentDetail = () => {
  if (!selectedPayment.value) return ''
  const map = {
    dobirka: 'Platba dobírkou',
    'bank-transfer': 'Bankovním převodem',
    'qr-payment': 'Okamžitá platba QR kódem'
  }
  return map[selectedPayment.value] || ''
}

const getDeliveryStreetPlaceholder = () => {
  if (selectedShipping.value === 'zasilkovna' && displayParcelshop.value)
    return displayParcelshop.value.address || displayParcelshop.value.name || 'Türkova 2399/13'
  if (selectedShipping.value === 'balikovna' && displayBalikovna.value)
    return displayBalikovna.value.address || displayBalikovna.value.name || 'Türkova 2399/13'
  return 'Např. Zámecká 1451'
}

const getDeliveryCityPlaceholder = () => {
  if (selectedShipping.value === 'zasilkovna' && displayParcelshop.value)
    return displayParcelshop.value.city || 'Praha 11'
  if (selectedShipping.value === 'balikovna' && displayBalikovna.value)
    return displayBalikovna.value.city || 'Praha 11'
  return 'Např. České Budějovice'
}

const getDeliveryPostcodePlaceholder = () => {
  if (selectedShipping.value === 'zasilkovna' && displayParcelshop.value)
    return displayParcelshop.value.postcode || '14900'
  if (selectedShipping.value === 'balikovna' && displayBalikovna.value)
    return displayBalikovna.value.postcode || '14900'
  return 'Např. 38273'
}

const extractCityFromAddress = (address) => {
  if (!address) return ''
  const match = address.match(/\b\d{5}\s+(.+)/)
  if (match) return match[1].trim()
  const cities = ['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'České Budějovice', 'Hradec Králové', 'Ústí nad Labem', 'Pardubice', 'Zlín']
  return cities.find(c => address.includes(c)) || ''
}

const extractPostcodeFromAddress = (address) => {
  if (!address) return ''
  const match = address.match(/\b(\d{5})\b/)
  return match ? match[1] : ''
}

// ============================================================
// 📌 ФОРМА
// ============================================================

const defaultForm = {
  email: '', password: '', confirmPassword: '', name: '', phone: '',
  invoiceStreet: '', invoiceCity: '', invoicePostcode: '', invoiceCountry: 'CZ',
  isCompany: false, companyName: '', ico: '', dic: '', isVatPayer: false,
  isDifferentDelivery: false, deliveryName: '', deliveryStreet: '', deliveryCity: '',
  deliveryPostcode: '', deliveryStreet2: '', deliveryCity2: '', deliveryPostcode2: '',
  deliveryCountry: 'CZ', deliveryPhone: '', deliveryEmail: '',
  note: '', _timestamp: null
}

const getInitialForm = () => {
  const authData = authStore.customerData
  const customer = authStore.customer

  if (isUserLoggedIn.value && customer) {
    return {
      ...defaultForm,
      email: customer.email || authData.email || '',
      name: customer.name || authData.name || '',
      phone: customer.phone || authData.phone || '',
      invoiceStreet: customer.street || authData.invoiceStreet || '',
      invoiceCity: customer.city || authData.invoiceCity || '',
      invoicePostcode: customer.postcode || authData.invoicePostcode || '',
      isCompany: authData.isCompany || false,
      isDifferentDelivery: authData.isDifferentDelivery || false,
      isVatPayer: authData.isVatPayer || false,
      ...authData
    }
  }

  const savedData = loadFormFromStorage()
  if (savedData) {
    const { _timestamp, ...rest } = savedData
    return { ...defaultForm, ...rest, email: rest.email || '', name: rest.name || '', phone: rest.phone || '' }
  }
  return { ...defaultForm }
}

const form = ref(getInitialForm())

// ============================================================
// 📌 СОХРАНЕНИЕ В STORE (БЕЗ ЦИКЛОВ)
// ============================================================

const saveFormToStore = () => {
  if (isInternalUpdate.value) return // Предотвращение циклов

  const data = { ...form.value }
  delete data.password
  delete data.confirmPassword
  delete data._timestamp

  // Проверяем, изменились ли данные перед сохранением
  const currentData = authStore.customerData
  const hasChanges = JSON.stringify(data) !== JSON.stringify(currentData)

  if (hasChanges) {
    isInternalUpdate.value = true
    authStore.setCustomerData(data)
    // Сбрасываем флаг после обновления
    setTimeout(() => {
      isInternalUpdate.value = false
    }, 100)
  }
}

// ============================================================
// 📌 ЗАГРУЗКА ДАННЫХ
// ============================================================

const loadDeliveryData = () => {
  const savedShipping = localStorage.getItem('shippingData')
  if (savedShipping) {
    try {
      const parsed = JSON.parse(savedShipping)
      if (parsed.shippingMethod && !authStore.shippingData.shippingMethod)
        authStore.shippingData.shippingMethod = parsed.shippingMethod
      if (parsed.paymentMethod && !authStore.shippingData.paymentMethod)
        authStore.shippingData.paymentMethod = parsed.paymentMethod
      if (parsed.parcelshop && !authStore.shippingData.parcelshop)
        authStore.shippingData.parcelshop = parsed.parcelshop
    } catch (e) {}
  }

  const shippingMethod = selectedShipping.value || authStore.shippingData.shippingMethod

  form.value.deliveryStreet = ''
  form.value.deliveryCity = ''
  form.value.deliveryPostcode = ''
  displayParcelshop.value = null
  displayBalikovna.value = null
  pplParcelshopData.value = null

  if (!shippingMethod) return

  if (shippingMethod === 'zasilkovna') {
    let shop = authStore.shippingData.parcelshop?.type === 'zasilkovna' ? authStore.shippingData.parcelshop : null
    if (!shop) {
      const saved = localStorage.getItem('selectedPacketaPoint')
      if (saved) try { shop = JSON.parse(saved); authStore.shippingData.parcelshop = shop } catch (e) {}
    }
    if (shop) {
      displayParcelshop.value = shop
      form.value.deliveryStreet = shop.address || shop.name || ''
      form.value.deliveryCity = shop.city || 'Praha 11'
      form.value.deliveryPostcode = shop.postcode || '14900'
    }
  } else if (shippingMethod === 'balikovna') {
    let shop = authStore.shippingData.parcelshop?.type === 'balikovna' ? authStore.shippingData.parcelshop : null
    if (!shop) {
      const saved = localStorage.getItem('selectedBalikovnaPoint')
      if (saved) try { shop = JSON.parse(saved); authStore.shippingData.parcelshop = shop } catch (e) {}
    }
    if (shop) {
      displayBalikovna.value = shop
      form.value.deliveryStreet = shop.address || shop.name || ''
      form.value.deliveryCity = shop.city || 'Praha 11'
      form.value.deliveryPostcode = shop.postcode || '14900'
    }
  }

  localStorage.setItem('shippingData', JSON.stringify({
    shippingMethod,
    paymentMethod: authStore.shippingData.paymentMethod,
    parcelshop: authStore.shippingData.parcelshop
  }))
}

const loadUserData = async () => {
  try {
    isLoadingUser.value = true
    let userEmail = cartStore.getUserEmail()
    if (!userEmail && cartStore.items?.length) {
      const firstItem = cartStore.items[0]
      if (firstItem.email) {
        userEmail = firstItem.email
        cartStore.saveUserEmail(userEmail)
      }
    }
    if (userEmail) {
      const isAuth = await authStore.checkAuthFromCart(userEmail)
      if (isAuth) {
        // Обновляем форму без триггера watch
        const newFormData = getInitialForm()
        Object.assign(form.value, newFormData)
      } else {
        form.value.email = userEmail
      }
    }
  } catch (error) {
    console.error('❌ Ошибка загрузки данных пользователя:', error)
  } finally {
    isLoadingUser.value = false
  }
}

// ============================================================
// 📌 WATCH (С ЗАЩИТОЙ ОТ ЦИКЛОВ)
// ============================================================

watch(form, () => {
  if (isInternalUpdate.value || isInitializing) return
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveFormToStore()
    saveFormToStorage(form.value)
  }, 500)
}, { deep: true })

watch(() => authStore.shippingData, (newVal) => {
  if (isInternalUpdate.value) return

  const serialized = JSON.stringify({
    shippingMethod: newVal.shippingMethod,
    paymentMethod: newVal.paymentMethod,
    parcelshop: newVal.parcelshop  })

  const currentSaved = localStorage.getItem('shippingData')
  if (currentSaved !== serialized) {
    localStorage.setItem('shippingData', serialized)
  }

  // Обновляем отображение если изменился parcelshop
  if (newVal.parcelshop) {
    const shop = newVal.parcelshop
    if (shop.type === 'zasilkovna') displayParcelshop.value = shop
    else if (shop.type === 'balikovna') displayBalikovna.value = shop
  }
}, { deep: true })

// Авто-заполнение города и PSČ из адреса (с защитой от циклов)
watch(() => form.value.invoiceStreet, (val) => {
  if (isInternalUpdate.value || isInitializing) return
  if (val) {
    if (!form.value.invoiceCity) {
      const city = extractCityFromAddress(val)
      if (city) form.value.invoiceCity = city
    }
    if (!form.value.invoicePostcode) {
      const postcode = extractPostcodeFromAddress(val)
      if (postcode) form.value.invoicePostcode = postcode
    }
  }
}, { debounce: 500 })

watch(() => form.value.deliveryStreet, (val) => {
  if (isInternalUpdate.value || isInitializing) return
  if (val && form.value.isDifferentDelivery) {
    if (!form.value.deliveryCity) {
      const city = extractCityFromAddress(val)
      if (city) form.value.deliveryCity = city
    }
    if (!form.value.deliveryPostcode) {
      const postcode = extractPostcodeFromAddress(val)
      if (postcode) form.value.deliveryPostcode = postcode
    }
  }
}, { debounce: 500 })

// ============================================================
// 📌 IMPORT PODLE IČO
// ============================================================

const importByIco = async () => {
  const ico = form.value.ico.replace(/\s/g, '')
  if (!isValidIco(ico)) {
    toastStore.warning('Neplatné IČO', 'Prosím, zadejte platné IČO (6-8 číslic)')
    return
  }
  try {
    isImporting.value = true
    const result = await getCompanyData(ico)
    if (!result.success) {
      const messages = {
        NETWORK_ERROR: 'Problém s připojením',
        NOT_FOUND: `Firma s IČO ${ico} nebyla nalezena`,
        INVALID_ICO: 'Neplatné IČO'
      }
      toastStore.error('Chyba importu', messages[result.errorCode] || result.error || 'Nepodařilo se načíst data')
      return
    }
    const data = result.data
    if (!data) {
      toastStore.error('Data nebyla nalezena', `Firma s IČO ${ico} nebyla nalezena`)
      return
    }

    // Обновляем форму с защитой от циклов
    isInternalUpdate.value = true
    if (data.companyName) form.value.companyName = data.companyName
    if (data.dic) form.value.dic = data.dic
    if (data.street) {
      form.value.invoiceStreet = data.street
      const city = extractCityFromAddress(data.street)
      if (city) form.value.invoiceCity = city
      const postcode = extractPostcodeFromAddress(data.street)
      if (postcode) form.value.invoicePostcode = postcode
    }
    if (data.city) form.value.invoiceCity = data.city
    if (data.postcode) form.value.invoicePostcode = data.postcode
    setTimeout(() => {
      isInternalUpdate.value = false
    }, 100)

    toastStore.success('✅ Data byla úspěšně naimportována!', `🏢 ${data.companyName}`, 5000)
    saveFormToStorage(form.value)
  } catch (error) {
    toastStore.error('Chyba importu', 'Nepodařilo se načíst data z ARES. Zkuste to prosím znovu.')
  } finally {
    isImporting.value = false
  }
}

// ============================================================
// 📌 ГЕТТЕРЫ
// ============================================================

const cartItems = computed(() => cartStore.cartItems || [])
const cartTotalPrice = computed(() => cartItems.value.reduce((sum, item) => sum + (getProductPrice(item) * (item.quantity || 1)), 0))
const selectedShippingOption = computed(() => shippingOptions.find(o => o.id === selectedShipping.value))
const selectedPaymentOption = computed(() => paymentOptions.find(o => o.id === selectedPayment.value))
const shippingPrice = computed(() => {
  if (!selectedShippingOption.value) return 0
  return (selectedShippingOption.value.free && cartTotalPrice.value >= selectedShippingOption.value.free) ? 0 : selectedShippingOption.value.price
})
const paymentPrice = computed(() => selectedPaymentOption.value?.price_value || 0)
const finalTotalPrice = computed(() => cartTotalPrice.value + shippingPrice.value + paymentPrice.value)

// ============================================================
// 📌 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ТОВАРОВ
// ============================================================

const getProductName = (item) => item?.name || item?.product?.name || 'Neznámý produkt'
const getProductPrice = (item) => {
  if (!item) return 0
  const price = item.price ?? item?.product?.price ?? 0
  return parseFloat(price) || 0
}
const getProductImage = (item) => {
  if (!item) return '/images/no-image.png'
  const img = item.image || item?.product?.image
  return img ? `https://obchod.tanatar.cz/${img}` : '/images/no-image.png'
}
const formatPrice = (price) => (price || 0).toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const handleImageError = (e) => e.target.src = '/images/no-image.png'
const navigateTo = (path) => {
  if (process.client) {
    window.location.href = path
  }
}

// ============================================================
// 📌 ОТПРАВКА ФОРМЫ
// ============================================================

const submitForm = async () => {
  // Валидация
  if (!validateForm()) {
    toastStore.warning('Chybí vyplněné údaje', 'Prosím, vyplňte všechny povinné údaje označené červeně.')
    return
  }

  submitting.value = true
  try {
    saveFormToStore()
    saveFormToStorage(form.value)
    if (form.value.email) await cartStore.updateEmailInCart(form.value.email)

    const orderData = {
      customer: {
        email: form.value.email,
        name: form.value.name,
        phone: form.value.phone,
        ...(form.value.isCompany && {
          companyName: form.value.companyName,
          ico: form.value.ico,
          dic: form.value.dic,
          isVatPayer: form.value.isVatPayer
        })
      },
      invoiceAddress: {
        street: form.value.invoiceStreet,
        city: form.value.invoiceCity,
        postcode: form.value.invoicePostcode,
        country: form.value.invoiceCountry
      },
      deliveryAddress: form.value.isDifferentDelivery ? {
        name: form.value.deliveryName,
        street: form.value.deliveryStreet2,
        city: form.value.deliveryCity2,
        postcode: form.value.deliveryPostcode2,
        country: form.value.deliveryCountry,
        phone: form.value.deliveryPhone,
        email: form.value.deliveryEmail
      } : {
        street: form.value.deliveryStreet,
        city: form.value.deliveryCity,
        postcode: form.value.deliveryPostcode,
        country: form.value.deliveryCountry || 'CZ'
      },
      shipping: {
        method: selectedShipping.value,
        name: selectedShippingName.value,
        price: shippingPrice.value,
        parcelshop: selectedShipping.value === 'zasilkovna' ? displayParcelshop.value : null,
        balikovna: selectedShipping.value === 'balikovna' ? displayBalikovna.value : null
      },
      payment: {
        method: selectedPayment.value,
        price: paymentPrice.value
      },
      note: form.value.note,
      cartItems: cartItems.value,
      totalPrice: finalTotalPrice.value,
      isDifferentDelivery: form.value.isDifferentDelivery,
      _timestamp: Date.now()
    }

    localStorage.setItem('orderData', JSON.stringify(orderData))
    toastStore.success('✅ Objednávka připravena', 'Pokračujte k rekapitulaci objednávky.', 3000)
    setTimeout(() => navigateTo('/rekapitulace'), 1000)
  } catch (error) {
    console.error('❌ Chyba při odesílání:', error)
    toastStore.error('Chyba odesílání', 'Při odesílání došlo k chybě. Zkuste to prosím znovu.')
  } finally {
    submitting.value = false
  }
}

// ============================================================
// 📌 ЖИЗНЕННЫЙ ЦИКЛ
// ============================================================

onMounted(async () => {
  isInitializing = true

  try {
    await cartStore.fetchCart()

    const savedShipping = localStorage.getItem('shippingData')
    if (savedShipping) {
      try {
        const parsed = JSON.parse(savedShipping)
        if (parsed.shippingMethod) authStore.shippingData.shippingMethod = parsed.shippingMethod
        if (parsed.paymentMethod) authStore.shippingData.paymentMethod = parsed.paymentMethod
        if (parsed.parcelshop) authStore.shippingData.parcelshop = parsed.parcelshop
      } catch (e) {}
    }

    await loadUserData()

    // Если пользователь не залогинен, загружаем сохраненные данные
    if (!isUserLoggedIn.value) {
      const savedData = loadFormFromStorage()
      if (savedData) {
        const { _timestamp, ...rest } = savedData
        Object.assign(form.value, rest)
      }
    }

    loadDeliveryData()
    window.addEventListener('beforeunload', saveBeforeUnload)
  } finally {
    isInitializing = false
    // Сохраняем начальное состояние
    saveFormToStorage(form.value)
  }
})

onUnmounted(() => {
  if (!isInternalUpdate.value) {
    saveFormToStorage(form.value)
  }
  window.removeEventListener('beforeunload', saveBeforeUnload)
  if (saveTimeout) clearTimeout(saveTimeout)
})

// ============================================================
// 📌 TOGGLE NOTE
// ============================================================

const toggleNote = () => {
  showNote.value = !showNote.value
}

// ============================================================
// 📌 SEO
// ============================================================

useHead({
  title: 'Dodací údaje | New Idea',
  meta: [{ name: 'description', content: 'Vyplňte dodací a fakturační údaje pro vaši objednávku.' }]
})
</script>

<style scoped>
/* ===== ОШИБКИ ===== */
.form-input.error {
  border-color: #dc2626 !important;
  background-color: #fef2f2 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

.form-input.error:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2) !important;
}

.form-label.error {
  color: #dc2626 !important;
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: none;
}

.error-message.show {
  display: block;
}

/* ===== ОБЩИЕ СТИЛИ ===== */
.delivery-page { max-width: 1270px; margin: 0 auto; padding: 20px 15px 60px; }
.delivery-container { background: white; border-radius: 12px; padding: 24px 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.delivery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.delivery-left { display: flex; flex-direction: column; }
.delivery-form { display: flex; flex-direction: column; gap: 24px; }

/* ===== СЕКЦИИ ===== */
.form-section { display: flex; flex-direction: column; gap: 14px; }
.section-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 4px 0; }
.subsection-title { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }

/* ===== ПОЛЯ ===== */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-row-two-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-size: 13px; font-weight: 600; color: #4b5563; }
.form-input, .form-textarea { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; color: #1e293b; transition: border-color 0.2s; outline: none; width: 100%; box-sizing: border-box; }
.form-input:focus, .form-textarea:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
.form-textarea { resize: vertical; min-height: 80px; }

/* ===== ЧЕКБОКСЫ ===== */
.form-checkbox { display: flex; align-items: flex-start; gap: 10px; }
.checkbox-input { margin-top: 2px; width: 18px; height: 18px; flex-shrink: 0; cursor: pointer; }
.checkbox-label { font-size: 13px; color: #4b5563; line-height: 1.5; }
.checkbox-label .link { color: #007bff; text-decoration: none; }
.checkbox-label .link:hover { text-decoration: underline; }

/* ===== КНОПКИ ===== */
.ico-wrapper { display: flex; gap: 8px; }
.ico-wrapper .form-input { flex: 1; }
.ico-import-btn { padding: 10px 16px; background: #e5e7eb; border: 1px solid #d1d5db; border-radius: 8px; color: #1e293b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.ico-import-btn:hover:not(:disabled) { background: #d1d5db; }
.ico-import-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ===== КОНТЕЙНЕРЫ ДЛЯ ПОЛЕЙ ===== */
.company-fields, .delivery-fields, .note-fields { padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 14px; }
.note-fields { margin-top: 8px; animation: slideDown 0.3s ease; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

/* ===== АВТОРИЗАЦИЯ ===== */
.auth-user-info { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.info-row { display: flex; gap: 8px; font-size: 14px; }
.info-label { font-weight: 600; color: #1e293b; min-width: 70px; }
.info-value { color: #4b5563; }
.info-note { font-size: 13px; color: #6b7280; margin-top: 4px; padding-top: 8px; border-top: 1px solid #86efac; }

.auth-invite-content { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 10px 0; }
.auth-invite-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
.auth-invite-text { display: flex; align-items: center; gap: 16px; }
.guest-fields { display: flex; flex-direction: column; gap: 14px; }

/* ===== ПРАВАЯ КОЛОНКА ===== */
.delivery-right { display: flex; flex-direction: column; position: relative; align-self: flex-start; height: 100%; min-height: 500px; max-width: 100%; }
.order-summary { position: sticky; top: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px 22px; display: flex; flex-direction: column; max-height: calc(100vh - 40px); overflow-y: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: box-shadow 0.3s ease; width: 100%; box-sizing: border-box; }
.order-summary:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
.order-summary .section-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 12px 0; padding-bottom: 10px; border-bottom: 2px solid #f1f5f9; flex-shrink: 0; }
.order-summary::-webkit-scrollbar { width: 4px; }
.order-summary::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.order-summary::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.order-summary::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

/* ===== ТОВАРЫ ===== */
.summary-items { display: flex; flex-direction: column; max-height: 260px; overflow-y: auto; padding-right: 4px; }
.summary-items::-webkit-scrollbar { width: 4px; }
.summary-items::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.summary-items::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.summary-item { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #f1f5f9; gap: 10px; }
.summary-item-border { border-top: 1px solid #f1f5f9; }
.summary-item:first-child { padding-top: 0; }
.summary-item:last-child { padding-bottom: 0; }
.summary-item-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.summary-item-image { width: 32px; height: 32px; border-radius: 4px; object-fit: cover; flex-shrink: 0; background: #f8f9fa; margin-top: 1px; }
.summary-item-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; }
.item-name { font-size: 13px; color: #4b5563; word-break: break-word; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.item-price { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; }

/* ===== ИТОГИ ===== */
.summary-divider { border-top: 1px solid #e5e7eb; margin: 8px 0; }
.summary-totals { display: flex; flex-direction: column; }
.summary-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; min-height: 36px; font-size: 13px; color: #4b5563; }
.summary-row-border { border-top: 1px solid #f1f5f9; }
.summary-row-border:first-child { border-top: none; padding-top: 0; }
.summary-row-border:last-child { padding-bottom: 0; }
.summary-label { font-weight: 500; color: #4b5563; flex-shrink: 0; min-width: 140px; }
.summary-value { font-weight: 500; color: #1e293b; text-align: right; flex: 1; }
.summary-detail { min-height: 36px; padding: 8px 0; align-items: center; }
.summary-detail .summary-label { display: none; }
.summary-detail .detail-value { font-weight: 400; color: #6b7280; font-size: 13px; text-align: right; width: 100%; padding-left: 140px; }

.summary-address { min-height: 36px; padding: 8px 0; align-items: center; }
.summary-address .summary-label { font-weight: 500; color: #4b5563; font-size: 13px; min-width: 140px; }
.summary-address .address-value { font-weight: 400; color: #6b7280; font-size: 13px; text-align: right; flex: 1; word-break: break-word; max-width: 60%; overflow: hidden; text-overflow: ellipsis; }

/* ===== ЦЕНА ===== */
.summary-price-block { background: #f3f4f6; padding: 12px 16px; border-radius: 6px; margin: 4px 0 12px 0; }
.summary-price-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
.summary-price-label { font-size: 15px; font-weight: 600; color: #1e293b; }
.summary-price-value { font-size: 18px; font-weight: 700; color: #1e293b; }

/* ===== КНОПКИ ДЕЙСТВИЙ ===== */
.summary-actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 4px; }
.continue-shopping { color: #6b7280; text-decoration: none; font-size: 13px; transition: color 0.2s; padding: 8px 4px; }
.continue-shopping:hover { color: #1e293b; }
.checkout-btn { display: inline-block; padding: 10px 28px; background: #e11d48; color: white; border: none; border-radius: 6px; font-weight: 600; font-size: 14px; transition: all 0.2s; white-space: nowrap; cursor: pointer; }
.checkout-btn:hover:not(:disabled) { background: #be123c; }
.checkout-btn:disabled { background: #94a3b8; cursor: not-allowed; opacity: 0.6; }

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 992px) {
  .delivery-grid { grid-template-columns: 1fr; gap: 30px; }
  .delivery-right { height: auto; min-height: auto; }
  .order-summary { position: relative; top: 0; max-height: none; overflow-y: visible; }
  .summary-items { max-height: 200px; }
}
@media (max-width: 768px) {
  .delivery-page { padding: 16px 10px 40px; }
  .delivery-container { padding: 16px; }
  .form-row, .form-row-two-columns { grid-template-columns: 1fr; gap: 14px; }
  .ico-wrapper { flex-direction: column; }
  .order-summary { padding: 14px 16px; }
  .summary-item .item-name { font-size: 12px; }
  .summary-item .item-price { font-size: 12px; }
  .summary-item-image { width: 28px; height: 28px; }
  .summary-items { max-height: 160px; }
  .auth-invite-content { flex-direction: column; align-items: stretch; text-align: center; }
}
@media (max-width: 480px) {
  .delivery-container { padding: 12px; }
  .delivery-right { height: auto; min-height: auto; }
  .order-summary { position: relative; top: 0; max-height: none; overflow-y: visible; padding: 12px 14px; }
  .summary-item-image { width: 24px; height: 24px; }
  .summary-item .item-name { font-size: 11px; }
  .summary-item .item-price { font-size: 11px; }
  .summary-items { max-height: 140px; }
  .company-fields, .delivery-fields { padding: 12px; }
}
</style>