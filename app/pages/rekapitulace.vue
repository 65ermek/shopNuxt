<template>
  <div class="recap-page">
    <CheckoutStepper
        :current-step="4"
        @step-change="handleStepChange"
    />

    <div class="recap-container">
      <!-- Новый заголовок -->
      <div class="recap-header">
        <h1 class="recap-title">Souhrn objednávky před dokončením - zbývá poslední krok</h1>
        <p class="recap-subtitle">
          <span class="recap-warning">Zkontrolujte vámi vyplněné údaje a potvrďte tlačítkem Dokončit objednávku</span>
        </p>
      </div>

      <div class="recap-grid">
        <!-- Левая колонка: Данные заказа -->
        <div class="recap-left">
          <!-- Dodací údaje -->
          <div class="recap-section">
            <div class="section-header">
              <h2 class="section-title">Dodací údaje</h2>
              <NuxtLink to="/dodaci-udaje" class="edit-link">upravit</NuxtLink>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Jméno a příjmení:</span>
                <span class="info-value">{{ orderData.customer?.name || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">E-mail:</span>
                <span class="info-value">{{ orderData.customer?.email || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Telefon:</span>
                <span class="info-value">{{ orderData.customer?.phone || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Doručovací adresa:</span>
                <span class="info-value">{{ deliveryAddress }}</span>
              </div>
              <div v-if="orderData.customer?.companyName" class="info-item">
                <span class="info-label">Firma:</span>
                <span class="info-value">{{ orderData.customer.companyName }}</span>
              </div>
              <div v-if="orderData.customer?.ico" class="info-item">
                <span class="info-label">IČO:</span>
                <span class="info-value">{{ orderData.customer.ico }}</span>
              </div>
              <div v-if="orderData.customer?.dic" class="info-item">
                <span class="info-label">DIČ:</span>
                <span class="info-value">{{ orderData.customer.dic }}</span>
              </div>
            </div>
          </div>

          <!-- Fakturační adresa (pokud se liší) -->
          <div v-if="orderData.isDifferentDelivery" class="recap-section">
            <div class="section-header">
              <h2 class="section-title">Fakturační adresa</h2>
              <NuxtLink to="/dodaci-udaje" class="edit-link">upravit</NuxtLink>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Ulice:</span>
                <span class="info-value">{{ orderData.invoiceAddress?.street || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Město:</span>
                <span class="info-value">{{ orderData.invoiceAddress?.city || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">PSČ:</span>
                <span class="info-value">{{ orderData.invoiceAddress?.postcode || 'Neznámé' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Země:</span>
                <span class="info-value">{{ orderData.invoiceAddress?.country || 'Neznámé' }}</span>
              </div>
            </div>
          </div>

          <!-- Způsob dopravy a platby -->
          <div class="recap-section">
            <div class="section-header">
              <h2 class="section-title">Doprava a platba</h2>
              <NuxtLink to="/doprava-a-platba" class="edit-link">upravit</NuxtLink>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Způsob dopravy:</span>
                <span class="info-value">{{ shippingMethodText }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Cena dopravy:</span>
                <span class="info-value">
        {{ orderData.shipping?.price && orderData.shipping.price > 0 ? formatPrice(orderData.shipping.price) + ' Kč' : 'ZDARMA' }}
      </span>
              </div>
              <div class="info-item">
                <span class="info-label">Způsob platby:</span>
                <span class="info-value">{{ paymentMethodText }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Cena platby:</span>
                <span class="info-value">
        {{ orderData.payment?.price && orderData.payment.price > 0 ? formatPrice(orderData.payment.price) + ' Kč' : 'ZDARMA' }}
      </span>
              </div>
            </div>
          </div>

          <!-- Adresa Zásilkovna / Balíkovna -->
          <div v-if="parcelshopAddress" class="recap-section">
            <div class="section-header">
              <h2 class="section-title">Adresa výdejního místa</h2>
              <NuxtLink to="/doprava-a-platba" class="edit-link">upravit</NuxtLink>
            </div>
            <div class="info-grid">
              <div class="info-item full-width">
                <span class="info-label">Název pobočky:</span>
                <span class="info-value">{{ parcelshopName }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Adresa:</span>
                <span class="info-value">{{ parcelshopAddress }}</span>
              </div>
              <div v-if="parcelshopCity" class="info-item">
                <span class="info-label">Město:</span>
                <span class="info-value">{{ parcelshopCity }}</span>
              </div>
              <div v-if="parcelshopPostcode" class="info-item">
                <span class="info-label">PSČ:</span>
                <span class="info-value">{{ parcelshopPostcode }}</span>
              </div>
              <div v-if="parcelshopOpeningHours" class="info-item full-width">
                <span class="info-label">Otevírací doba:</span>
                <span class="info-value" v-html="parcelshopOpeningHours"></span>
              </div>
            </div>
          </div>

          <!-- Poznámka -->
          <div v-if="orderData.note" class="recap-section">
            <div class="section-header">
              <h2 class="section-title">Poznámka</h2>
              <NuxtLink to="/dodaci-udaje" class="edit-link">upravit</NuxtLink>
            </div>
            <p class="recap-note">{{ orderData.note }}</p>
          </div>
        </div>

        <!-- Правая колонка: Souhrn objednávky -->
        <div class="recap-right">
          <div class="order-summary">
            <h2 class="section-title">Souhrn objednávky</h2>

            <!-- Товары с разделителями -->
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

            <!-- Итоги с разделителями -->
            <div class="summary-totals">
              <div class="summary-row summary-row-border">
                <span class="summary-label">Cena zboží:</span>
                <span class="summary-value">{{ formatPrice(cartTotalPrice) }} Kč</span>
              </div>

              <!-- Способ доставки -->
              <div v-if="orderData.shipping?.method" class="summary-row summary-row-border">
                <span class="summary-label">Způsob dopravy:</span>
                <span class="summary-value">
                  {{ orderData.shipping?.price && orderData.shipping.price > 0 ? formatPrice(orderData.shipping.price) + ' Kč' : 'ZDARMA' }}
                </span>
              </div>

              <!-- Название способа доставки (подстрока) -->
              <div v-if="orderData.shipping?.method && shippingMethodName" class="summary-row summary-detail summary-row-border">
                <span class="summary-label"></span>
                <span class="summary-value detail-value">{{ shippingMethodName }}</span>
              </div>

              <!-- Способ оплаты -->
              <div v-if="orderData.payment?.method" class="summary-row summary-row-border">
                <span class="summary-label">Způsob platby:</span>
                <span class="summary-value">
                  {{ orderData.payment?.price && orderData.payment.price > 0 ? formatPrice(orderData.payment.price) + ' Kč' : 'ZDARMA' }}
                </span>
              </div>

              <!-- Название способа оплаты (подстрока) -->
              <div v-if="orderData.payment?.method && paymentMethodName" class="summary-row summary-detail summary-row-border">
                <span class="summary-label"></span>
                <span class="summary-value detail-value">{{ paymentMethodName }}</span>
              </div>

              <!-- Adresa Zásilkovna -->
              <div v-if="orderData.shipping?.method === 'zasilkovna' && parcelshopData" class="summary-row summary-address summary-row-border">
                <span class="summary-label">Adresa Zásilkovna:</span>
                <span class="summary-value address-value">{{ parcelshopData.name }}</span>
              </div>

              <!-- Adresa Balíkovna -->
              <div v-if="orderData.shipping?.method === 'balikovna' && balikovnaData" class="summary-row summary-address summary-row-border">
                <span class="summary-label">Adresa Balíkovna:</span>
                <span class="summary-value address-value">{{ balikovnaData.name }}</span>
              </div>
            </div>

            <div class="summary-divider"></div>

            <!-- Блок с итоговой ценой -->
            <div class="summary-price-block">
              <div class="summary-price-row">
                <span class="summary-price-label">Celková cena:</span>
                <span class="summary-price-value">{{ formatPrice(finalTotalPrice) }} Kč</span>
              </div>
            </div>

            <!-- ✅ НОВЫЙ БЛОК: Чекбоксы перед кнопкой -->
            <div class="summary-agreement">
              <!-- Чекбокс регистрации -->
              <div class="form-checkbox">
                <input
                    id="createAccount"
                    v-model="createAccount"
                    type="checkbox"
                    class="checkbox-input"
                />
                <label for="createAccount" class="checkbox-label">
                  Vytvořit s objednávkou registraci. Osobní údaje chráníme.
                </label>
              </div>

              <!-- Чекбокс согласия -->
              <div class="form-checkbox">
                <input
                    id="agreement"
                    v-model="agreementAccepted"
                    type="checkbox"
                    class="checkbox-input"
                    required
                />
                <label for="agreement" class="checkbox-label">
                  Souhlasím se <NuxtLink to="/obchodni-podminky" class="link">zpracováním osobních údajů</NuxtLink> a
                  <NuxtLink to="/obchodni-podminky" class="link">obchodními podmínkami</NuxtLink> *
                </label>
              </div>
            </div>

            <!-- Кнопки -->
            <div class="summary-actions">
              <NuxtLink to="/dodaci-udaje" class="continue-shopping">
                ← zpět
              </NuxtLink>
              <button
                  type="button"
                  class="checkout-btn"
                  :disabled="isSubmitting || !agreementAccepted"
                  @click="confirmOrder"
              >
                {{ isSubmitting ? 'Odesílám...' : 'Dokončit objednávku →' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'checkout'
})
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useAuthStore } from '~/stores/authStore'
import { useToastStore } from '~/stores/toastStore'
import CheckoutStepper from '~/components/CheckoutStepper.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const toastStore = useToastStore()
const isSubmitting = ref(false)

// ============================================================
// 📌 СОСТОЯНИЯ
// ============================================================

const agreementAccepted = ref(false)
const createAccount = ref(false)

// ============================================================
// 📌 ДАННЫЕ
// ============================================================

const orderData = ref({})
const isLoading = ref(true)

// ============================================================
// 📌 ОБРАБОТЧИК ШАГОВ
// ============================================================

const handleStepChange = (step) => {
  console.log('Переход на шаг:', step)
}

// ============================================================
// 📌 ГЕТТЕРЫ ДЛЯ КОРЗИНЫ
// ============================================================

const cartItems = computed(() => {
  return cartStore.cartItems || []
})

const cartTotalPrice = computed(() => {
  if (!cartItems.value || !Array.isArray(cartItems.value)) return 0
  return cartItems.value.reduce((sum, item) => {
    const price = getProductPrice(item)
    const quantity = item?.quantity || 1
    return sum + (price * quantity)
  }, 0)
})

const finalTotalPrice = computed(() => {
  const shippingPrice = orderData.value.shipping?.price || 0
  const paymentPrice = orderData.value.payment?.price || 0
  return cartTotalPrice.value + shippingPrice + paymentPrice
})

// ============================================================
// 📌 ВЫЧИСЛЯЕМЫЕ ПОЛЯ ДЛЯ ZÁSILKOVNA / BALÍKOVNA
// ============================================================

const parcelshopName = computed(() => {
  const shipping = orderData.value.shipping
  if (!shipping) return null

  if (shipping.parcelshop?.name) {
    return shipping.parcelshop.name
  }
  if (shipping.balikovna?.name) {
    return shipping.balikovna.name
  }
  if (shipping.name && (shipping.method === 'zasilkovna' || shipping.method === 'balikovna')) {
    return shipping.name
  }
  return null
})

const parcelshopAddress = computed(() => {
  const shipping = orderData.value.shipping
  if (!shipping) return null

  if (shipping.parcelshop?.address) {
    return shipping.parcelshop.address
  }
  if (shipping.parcelshop?.name && !shipping.parcelshop?.address) {
    return shipping.parcelshop.name
  }
  if (shipping.balikovna?.address) {
    return shipping.balikovna.address
  }
  if (shipping.balikovna?.name && !shipping.balikovna?.address) {
    return shipping.balikovna.name
  }
  return null
})

const parcelshopCity = computed(() => {
  const shipping = orderData.value.shipping
  if (!shipping) return null

  if (shipping.parcelshop?.city) {
    return shipping.parcelshop.city
  }
  if (shipping.balikovna?.city) {
    return shipping.balikovna.city
  }
  return null
})

const parcelshopPostcode = computed(() => {
  const shipping = orderData.value.shipping
  if (!shipping) return null

  if (shipping.parcelshop?.postcode) {
    return shipping.parcelshop.postcode
  }
  if (shipping.balikovna?.postcode) {
    return shipping.balikovna.postcode
  }
  return null
})

const parcelshopOpeningHours = computed(() => {
  const shipping = orderData.value.shipping
  if (!shipping) return null

  if (shipping.parcelshop?.openingHours) {
    return shipping.parcelshop.openingHours
  }
  if (shipping.balikovna?.openingHours) {
    return shipping.balikovna.openingHours
  }
  return null
})

// ============================================================
// 📌 ВЫЧИСЛЯЕМЫЕ ПОЛЯ ДЛЯ ПРАВОЙ КОЛОНКИ
// ============================================================

const shippingMethodName = computed(() => {
  const method = orderData.value.shipping?.method
  const names = {
    'ppl': 'PPL',
    'ppl-parcelshop': 'PPL ParcelShop',
    'zasilkovna': 'Zásilkovna',
    'balikovna': 'Balíkovna',
    'our-car': 'NAŠE AUTO'
  }
  return names[method] || orderData.value.shipping?.name || ''
})

const paymentMethodName = computed(() => {
  const method = orderData.value.payment?.method
  const names = {
    'dobirka': 'Platba dobírkou',
    'bank-transfer': 'Bankovním převodem',
    'qr-payment': 'Okamžitá platba QR kódem'
  }
  return names[method] || ''
})

const parcelshopData = computed(() => {
  return orderData.value.shipping?.parcelshop || null
})

const balikovnaData = computed(() => {
  return orderData.value.shipping?.balikovna || null
})

// ============================================================
// 📌 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

const getProductName = (item) => {
  if (!item) return 'Neznámý produkt'
  if (item.name) return item.name
  if (item.product && item.product.name) return item.product.name
  return 'Neznámý produkt'
}

const getProductPrice = (item) => {
  if (!item) return 0
  if (item.price !== undefined && item.price !== null) {
    const num = parseFloat(item.price)
    return isNaN(num) ? 0 : num
  }
  if (item.product && typeof item.product === 'object' && item.product.price !== undefined && item.product.price !== null) {
    const num = parseFloat(item.product.price)
    return isNaN(num) ? 0 : num
  }
  return 0
}

const getProductImage = (item) => {
  if (!item) return '/images/no-image.png'
  if (item.image) {
    return `https://obchod.tanatar.cz/${item.image}`
  }
  if (item.product && typeof item.product === 'object' && item.product.image) {
    return `https://obchod.tanatar.cz/${item.product.image}`
  }
  return '/images/no-image.png'
}

const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0,00'
  }
  const num = parseFloat(price)
  if (isNaN(num)) return '0,00'
  return num.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleImageError = (e) => {
  e.target.src = '/images/no-image.png'
}

// ============================================================
// 📌 ВЫЧИСЛЯЕМЫЕ ПОЛЯ
// ============================================================

const deliveryAddress = computed(() => {
  const shipping = orderData.value.shipping
  if (shipping) {
    if (shipping.parcelshop?.address) {
      return `${shipping.parcelshop.name} - ${shipping.parcelshop.address}`
    }
    if (shipping.balikovna?.address) {
      return `${shipping.balikovna.name} - ${shipping.balikovna.address}`
    }
  }

  const delivery = orderData.value.deliveryAddress
  if (delivery) {
    return `${delivery.street}, ${delivery.city}, ${delivery.postcode}, ${delivery.country}`
  }
  const invoice = orderData.value.invoiceAddress
  if (invoice) {
    return `${invoice.street}, ${invoice.city}, ${invoice.postcode}, ${invoice.country}`
  }
  return 'Neznámé'
})

const shippingMethodText = computed(() => {
  const method = orderData.value.shipping?.method
  const methods = {
    'ppl': 'PPL Kurýr',
    'ppl-parcelshop': 'PPL ParcelShop',
    'our-car': 'Naše auto',
    'zasilkovna': 'Zásilkovna',
    'balikovna': 'Balíkovna',
    'osobni': 'Osobní odběr'
  }
  if (orderData.value.shipping?.name) {
    return orderData.value.shipping.name
  }
  return methods[method] || method || 'Neznámé'
})

const paymentMethodText = computed(() => {
  const method = orderData.value.payment?.method
  const methods = {
    'dobirka': 'Platba dobírkou',
    'bank-transfer': 'Bankovním převodem',
    'qr-payment': 'QR kód',
    'card': 'Platební karta',
    'qr': 'QR kód',
    'bank_transfer': 'Bankovní převod'
  }
  return methods[method] || method || 'Neznámé'
})

// ============================================================
// 📌 ЗАГРУЗКА ДАННЫХ
// ============================================================

onMounted(() => {
  cartStore.fetchCart()

  const savedData = localStorage.getItem('orderData')
  if (savedData) {
    try {
      orderData.value = JSON.parse(savedData)
      console.log('📦 Данные заказа загружены:', orderData.value)
      isLoading.value = false
    } catch (e) {
      console.error('❌ Ошибка загрузки данных заказа:', e)
      toastStore.error(
          'Chyba dat',
          'Nepodařilo se načíst data objednávky.'
      )
      navigateTo('/dodaci-udaje')
    }
  } else {
    toastStore.warning(
        'Chybí data',
        'Prosím, vyplňte nejprve dodací údaje.'
    )
    navigateTo('/dodaci-udaje')
  }
})

// ============================================================
// 📌 ПОДТВЕРЖДЕНИЕ ЗАКАЗА
// ============================================================

const confirmOrder = async () => {
  // ✅ Проверяем согласие перед отправкой
  if (!agreementAccepted.value) {
    toastStore.warning(
        'Souhlas je vyžadován',
        'Pro pokračování musíte souhlasit se zpracováním osobních údajů.'
    )
    return
  }

  try {
    isSubmitting.value = true

    if (!orderData.value.customer) {
      throw new Error('Chybí data o zákazníkovi')
    }

    // ✅ 1. Сохраняем копию товаров из корзины перед отправкой
    const cartItemsCopy = [...cartStore.cartItems]

    if (cartItemsCopy.length === 0) {
      toastStore.warning(
          'Košík je prázdný',
          'Pro vytvoření objednávky musíte mít alespoň jeden produkt v košíku.'
      )
      isSubmitting.value = false
      return
    }

    const token = localStorage.getItem('token')
    const payload = {
      name: orderData.value.customer.name || '',
      email: orderData.value.customer.email || '',
      phone: orderData.value.customer.phone || orderData.value.deliveryAddress?.phone || '',
      address: orderData.value.deliveryAddress?.street || orderData.value.invoiceAddress?.street || '',
      city: orderData.value.deliveryAddress?.city || orderData.value.invoiceAddress?.city || '',
      zip: orderData.value.deliveryAddress?.postcode || orderData.value.invoiceAddress?.postcode || '',
      shipping_method: orderData.value.shipping?.method || 'ppl',
      payment_method: orderData.value.payment?.method || 'bank-transfer',
      customer_note: orderData.value.note || null,
      company_name: orderData.value.customer?.companyName || null,
      ico: orderData.value.customer?.ico || null,
      dic: orderData.value.customer?.dic || null,
      isDifferentDelivery: orderData.value.isDifferentDelivery || false,
      deliveryAddress: orderData.value.deliveryAddress || null,
      invoiceAddress: orderData.value.invoiceAddress || null,
      session_id: localStorage.getItem('session_id') || null,
      customer_id: orderData.value.customer?.id || null,
      parcelshop: orderData.value.shipping?.parcelshop || null,
      balikovna: orderData.value.shipping?.balikovna || null,
      agreement: agreementAccepted.value,
      create_account: createAccount.value,
      password: localStorage.getItem('temp_password') || null
    }

    console.log('📦 Odesílám objednávku:', payload)

    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'https://obchod.tanatar.cz'

    // ✅ 2. Отправляем запрос на сервер
    const response = await fetch(`${apiBase}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    console.log('📦 Response:', result)

    if (!response.ok) {
      let errorMessage = result.error || result.message || 'Chyba při vytváření objednávky'
      if (result.errors) {
        errorMessage = Object.values(result.errors).flat().join(', ')
      }
      throw new Error(errorMessage)
    }

    console.log('✅ Objednávka vytvořena:', result)

    const orderNumber = result.order?.order_number || result.order_id || result.id
    localStorage.setItem('lastOrderNumber', orderNumber)

    // ✅ ✅ ✅ 3. АВТОРИЗАЦИЯ (ВСЕГДА, если есть токен)
    if (result.token && result.customer) {
      // Сохраняем токен
      localStorage.setItem('token', result.token)
      authStore.token = result.token

      // Сохраняем данные пользователя
      authStore.customer = result.customer
      localStorage.setItem('customer', JSON.stringify(result.customer))

      // ✅ Устанавливаем флаг авторизации
      authStore.isAuthenticated = true

      console.log('✅ Пользователь авторизован через токен из ответа сервера', {
        customer_id: result.customer.id,
        email: result.customer.email,
        is_new_customer: result.is_new_customer
      })

      // ✅ Если новый пользователь и есть пароль - показываем уведомление
      if (result.password && result.is_new_customer) {
        toastStore.success(
            '✅ Účet byl vytvořen!',
            `Vaše heslo: ${result.password}. Doporučujeme si ho změnit v profilu.`,
            15000
        )
      }
    } else {
      console.warn('⚠️ Токен не получен, авторизация не выполнена')
    }

    // ✅ 4. Очищаем корзину
    cartStore.items = cartStore.items.filter(item => item.type !== 'cart')
    cartStore.saveToLocalStorage()

    localStorage.removeItem('orderData')
    localStorage.removeItem('dodaci_udaje_form')

    toastStore.success(
        '✅ Objednávka byla úspěšně vytvořena!',
        `Číslo objednávky: ${orderNumber}`,
        5000
    )

    setTimeout(() => {
      navigateTo(`/objednavka-uspesna?order=${orderNumber}`)
    }, 1500)

  } catch (error) {
    console.error('❌ Chyba při potvrzení objednávky:', error)
    toastStore.error(
        'Chyba potvrzení',
        error.message || 'Při potvrzení objednávky došlo k chybě. Zkuste to prosím znovu.'
    )
  } finally {
    isSubmitting.value = false
  }
}

// ============================================================
// 📌 SEO
// ============================================================

useHead({
  title: 'Rekapitulace objednávky | New Idea',
  meta: [
    {
      name: 'description',
      content: 'Zkontrolujte a potvrďte svou objednávku v internetovém obchodě New Idea.'
    }
  ]
})
</script>

<style scoped>
/* ============================================================
   ЗАГОЛОВОК
   ============================================================ */

.recap-header {
  margin-bottom: 30px;
}

.recap-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.recap-subtitle {
  margin: 0;
  font-size: 15px;
  color: #4b5563;
}

.recap-warning {
  color: #dc2626;
  font-weight: 600;
}

.recap-page {
  max-width: 1270px;
  margin: 0 auto;
  padding: 20px 15px 60px;
}

.recap-container {
  background: white;
  border-radius: 12px;
  padding: 24px 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.recap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

/* ============================================================
   ЛЕВАЯ КОЛОНКА
   ============================================================ */

.recap-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.recap-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.edit-link {
  font-size: 13px;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.edit-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px 0;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.recap-note {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

/* ============================================================
   ПРАВАЯ КОЛОНКА - SUMMARY
   ============================================================ */

.recap-right {
  display: flex;
  flex-direction: column;
  position: relative;
  align-self: flex-start;
  height: 100%;
  min-height: 500px;
  max-width: 100%;
}

.order-summary {
  position: sticky;
  top: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.order-summary:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.order-summary .section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1f5f9;
  flex-shrink: 0;
}

.order-summary::-webkit-scrollbar {
  width: 4px;
}

.order-summary::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.order-summary::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.order-summary::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ===== ТОВАРЫ В СУММАРИ ===== */
.summary-items {
  display: flex;
  flex-direction: column;
  max-height: 260px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  width: 100%;
}

.summary-items::-webkit-scrollbar {
  width: 4px;
}

.summary-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.summary-items::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.summary-items::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item-border {
  border-top: 1px solid #f1f5f9;
}

.summary-item:first-child {
  padding-top: 0;
}

.summary-item:last-child {
  padding-bottom: 0;
}

.summary-item-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
  min-width: 0;
  max-width: 70%;
}

.summary-item-image {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f8f9fa;
  margin-top: 1px;
}

.summary-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  margin-left: auto;
}

.item-name {
  font-size: 13px;
  color: #4b5563;
  word-break: break-word;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-price {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ===== ИТОГИ ===== */
.summary-divider {
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
  width: 100%;
}

.summary-totals {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  min-height: 36px;
  font-size: 13px;
  color: #4b5563;
  width: 100%;
  box-sizing: border-box;
}

.summary-row-border {
  border-top: 1px solid #f1f5f9;
}

.summary-row-border:first-child {
  border-top: none;
  padding-top: 0;
}

.summary-row-border:last-child {
  padding-bottom: 0;
}

.summary-label {
  font-weight: 500;
  color: #4b5563;
  flex-shrink: 0;
  min-width: 140px;
}

.summary-value {
  font-weight: 500;
  color: #1e293b;
  text-align: right;
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

/* Детали (подстрока) */
.summary-detail {
  min-height: 36px;
  padding: 8px 0;
  align-items: center;
}

.summary-detail .summary-label {
  display: none;
}

.summary-detail .detail-value {
  font-weight: 400;
  color: #6b7280;
  font-size: 13px;
  text-align: right;
  width: 100%;
  padding-left: 140px;
}

/* Адрес */
.summary-address {
  min-height: 36px;
  padding: 8px 0;
  align-items: center;
}

.summary-address .summary-label {
  font-weight: 500;
  color: #4b5563;
  font-size: 13px;
  min-width: 140px;
  flex-shrink: 0;
}

.summary-address .address-value {
  font-weight: 400;
  color: #6b7280;
  font-size: 13px;
  text-align: right;
  flex: 1;
  word-break: break-word;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== БЛОК С ИТОГОВОЙ ЦЕНОЙ ===== */
.summary-price-block {
  background: #f3f4f6;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 4px 0 12px 0;
  width: 100%;
  box-sizing: border-box;
}

.summary-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.summary-price-label {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.summary-price-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

/* ===== СОГЛАСИЕ ===== */
.summary-agreement {
  margin: 8px 0 4px 0;
  padding: 12px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.checkbox-input {
  margin-top: 2px;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  cursor: pointer;
}

.checkbox-label {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.checkbox-label .link {
  color: #007bff;
  text-decoration: none;
}

.checkbox-label .link:hover {
  text-decoration: underline;
}

/* ===== КНОПКИ ===== */
.summary-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
}

.continue-shopping {
  color: #6b7280;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
  padding: 8px 4px;
}

.continue-shopping:hover {
  color: #1e293b;
}

.checkout-btn {
  display: inline-block;
  padding: 10px 28px;
  background: #e11d48;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
}

.checkout-btn:hover:not(:disabled) {
  background: #be123c;
}

.checkout-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

/* ============================================================
   КНОПКИ ДЕЙСТВИЙ В ЛЕВОЙ КОЛОНКЕ
   ============================================================ */

.recap-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.back-btn {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #1e293b;
}

.confirm-btn {
  padding: 14px 40px;
  background: #e11d48;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:hover:not(:disabled) {
  background: #be123c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
}

.confirm-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* ============================================================
   АДАПТИВНОСТЬ
   ============================================================ */

@media (max-width: 992px) {
  .recap-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .recap-right {
    height: auto;
    min-height: auto;
    max-width: 100%;
  }

  .order-summary {
    position: relative;
    top: 0;
    max-height: none;
    overflow-y: visible;
    padding: 14px 16px;
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .recap-actions {
    flex-direction: column;
  }

  .confirm-btn {
    width: 100%;
    text-align: center;
  }

  .back-btn {
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .recap-page {
    padding: 16px 10px 40px;
  }

  .recap-container {
    padding: 16px;
  }

  .recap-title {
    font-size: 20px;
  }

  .recap-subtitle {
    font-size: 14px;
  }

  .recap-section {
    padding: 16px;
  }

  .section-title {
    font-size: 15px;
  }

  .info-item {
    padding: 2px 0;
  }

  .info-label {
    font-size: 11px;
  }

  .info-value {
    font-size: 13px;
  }

  .order-summary {
    padding: 14px 16px;
  }

  .summary-item-left {
    max-width: 60%;
  }

  .summary-label {
    min-width: 100px;
    font-size: 12px;
  }

  .summary-address .address-value {
    max-width: 50%;
    font-size: 12px;
  }

  .summary-address .summary-label {
    min-width: 100px;
    font-size: 12px;
  }

  .summary-actions {
    flex-direction: column;
  }

  .checkout-btn {
    width: 100%;
    text-align: center;
  }

  .continue-shopping {
    text-align: center;
    width: 100%;
  }

  .summary-agreement {
    padding: 10px 0;
  }
}

@media (max-width: 480px) {
  .recap-container {
    padding: 12px;
  }

  .recap-title {
    font-size: 18px;
  }

  .recap-subtitle {
    font-size: 13px;
  }

  .recap-section {
    padding: 12px;
  }

  .order-summary {
    padding: 12px 14px;
  }

  .summary-item-left {
    max-width: 55%;
  }

  .summary-label {
    min-width: 80px;
    font-size: 11px;
  }

  .item-name {
    font-size: 11px;
  }

  .item-price {
    font-size: 11px;
  }

  .summary-item-image {
    width: 24px;
    height: 24px;
  }

  .confirm-btn {
    font-size: 14px;
    padding: 12px 20px;
  }

  .edit-link {
    font-size: 12px;
  }

  .checkbox-label {
    font-size: 12px;
  }
}
</style>