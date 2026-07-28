<!-- pages/doprava-a-platba/index.vue -->
<template>
  <div class="shipping-page">
    <CheckoutStepper :current-step="2" />

    <h1 class="shipping-title">Doprava a platba</h1>

    <div class="shipping-grid">
      <!-- Левая колонка -->
      <div class="shipping-left">
        <!-- Способы доставки -->
        <div class="shipping-section">
          <h2 class="section-title">Zvolte způsob dopravy</h2>

          <div class="shipping-options">
            <div
                v-for="option in shippingOptions"
                :key="option.id"
                class="shipping-option"
                :class="{ selected: selectedShipping === option.id }"
                @click="selectShipping(option.id)"
            >
              <div class="option-radio">
                <div class="radio-circle">
                  <div v-if="selectedShipping === option.id" class="radio-dot"></div>
                </div>
              </div>
              <div class="option-content">
                <div class="option-header">
                  <span class="option-name">
                    <img
                        v-if="option.icon"
                        :src="option.icon"
                        :alt="option.name"
                        class="option-icon"
                    />
                    {{ option.name }}
                  </span>
                  <span class="option-price">
                    {{ option.free && cartTotalPrice >= option.free ? 'ZDARMA' : option.price + ' Kč' }}
                  </span>
                </div>
                <p class="option-description">{{ option.description }}</p>
                <span v-if="option.free" class="option-free">
                  Nad {{ option.free }} Kč doprava ZDARMA
                </span>

                <!-- Блок Zásilkovna -->
                <div
                    v-if="option.id === 'zasilkovna' && selectedShipping === 'zasilkovna'"
                    class="parcelshop-selected"
                >
                  <div class="parcelshop-info">
                    <span class="parcelshop-address">
                      {{ parcelshopData?.name || 'Vyberte výdejní místo' }}
                    </span>
                    <span v-if="parcelshopData?.openingHours" class="parcelshop-hours">
                    </span>
                  </div>
                  <button
                      type="button"
                      class="btn-change-parcelshop btn-change-zasilkovna"
                      @click.stop="openPacketaWidget"
                  >
                    ✏️ změnit
                  </button>
                </div>

                <!-- Блок Balíkovna -->
                <div
                    v-if="option.id === 'balikovna' && selectedShipping === 'balikovna'"
                    class="parcelshop-selected"
                >
                  <div class="parcelshop-info">
                    <span class="parcelshop-badge parcelshop-badge-balikovna">📮 Balíkovna</span>
                    <span class="parcelshop-address">
                      {{ balikovnaData?.name || 'Vyberte výdejní místo' }}
                    </span>
                    <span v-if="balikovnaData?.address" class="parcelshop-hours">
                      {{ balikovnaData.address }}
                    </span>
                    <span v-if="balikovnaPhone" class="parcelshop-phone">
                      📞 {{ balikovnaPhone }}
                    </span>
                  </div>
                  <button
                      type="button"
                      class="btn-change-parcelshop btn-change-balikovna"
                      @click.stop="openBalikovnaWidget"
                  >
                    ✏️ změnit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Способы оплаты -->
        <div class="shipping-section">
          <h2 class="section-title">Zvolte způsob platby</h2>

          <div class="payment-options">
            <div
                v-for="option in paymentOptions"
                :key="option.id"
                class="payment-option"
                :class="{ selected: selectedPayment === option.id }"
                @click="selectPayment(option.id)"
            >
              <div class="option-radio">
                <div class="radio-circle">
                  <div v-if="selectedPayment === option.id" class="radio-dot"></div>
                </div>
              </div>
              <div class="option-content">
                <span class="option-name">
                  {{ option.name }}
                </span>
                <span class="option-price">{{ option.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка -->
      <div class="shipping-right">
        <div class="order-summary">
          <h2 class="section-title">Souhrn objednávky</h2>

          <!-- Товары с разделителями -->
          <div class="summary-items">
            <div
                v-for="(item, index) in cartItems"
                :key="item.id"
                class="summary-item"
                :class="{ 'summary-item-border': index > 0 }"
            >
              <div class="summary-item-left">
                <img
                    :src="getProductImage(item)"
                    :alt="getProductName(item)"
                    class="summary-item-image"
                    loading="lazy"
                    @error="handleImageError"
                />
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
            <div class="summary-row summary-row-border" v-if="selectedShippingOption">
              <span class="summary-label">Způsob dopravy:</span>
              <span class="summary-value">
      {{ selectedShippingOption.free && cartTotalPrice >= selectedShippingOption.free ? 'ZDARMA' : formatPrice(shippingPrice) + ' Kč' }}
    </span>
            </div>

            <!-- Название способа доставки (подстрока) -->
            <div
                v-if="selectedShippingOption && getShippingDetail()"
                class="summary-row summary-detail summary-row-border"
            >
              <span class="summary-label"></span>
              <span class="summary-value detail-value">{{ getShippingDetail() }}</span>
            </div>

            <!-- Способ оплаты -->
            <div class="summary-row summary-row-border" v-if="selectedPaymentOption">
              <span class="summary-label">Způsob platby:</span>
              <span class="summary-value">{{ selectedPaymentOption.price }}</span>
            </div>

            <!-- Название способа оплаты (подстрока) -->
            <div
                v-if="selectedPaymentOption && getPaymentDetail()"
                class="summary-row summary-detail summary-row-border"
            >
              <span class="summary-label"></span>
              <span class="summary-value detail-value">{{ getPaymentDetail() }}</span>
            </div>

            <!-- Адрес для выбранного пункта выдачи -->
            <div
                v-if="selectedShipping === 'zasilkovna' && parcelshopData?.name"
                class="summary-row summary-address summary-row-border"
            >
              <span class="summary-label">Adresa Zásilkovna:</span>
              <span class="summary-value address-value">{{ parcelshopData.name }}</span>
            </div>

            <div
                v-if="selectedShipping === 'balikovna' && balikovnaData?.name"
                class="summary-row summary-address summary-row-border"
            >
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

          <!-- Кнопки -->
          <div class="summary-actions">
            <NuxtLink to="/cart" class="continue-shopping">
              ← zpět do košíku
            </NuxtLink>
            <NuxtLink
                to="/dodaci-udaje"
                class="checkout-btn"
                :class="{ disabled: !selectedShipping || !selectedPayment || (selectedShipping === 'zasilkovna' && !parcelshopData) || (selectedShipping === 'balikovna' && !balikovnaData) }"
                @click.prevent="handleContinue"
            >
              Pokračovat v objednávce →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== MODAL S WIDGETEM ZÁSILKOVNY ====== -->
    <Teleport to="body">
      <div v-if="showPacketaWidget" class="modal-overlay" @click.self="closePacketaWidget">
        <div class="modal-box">
          <div class="modal-header">
            <h3>
              <span style="font-size:24px;">📦</span>
              Vyberte výdejní místo Zásilkovny
            </h3>
            <button class="modal-close" @click="closePacketaWidget">✕</button>
          </div>

          <div class="modal-body">
            <iframe
                ref="packetaIframe"
                src="https://widget.packeta.com/v6/#!?city=Praha&lang=cs"
                width="100%"
                height="550"
                frameborder="0"
                allow="geolocation"
                @load="onIframeLoad"
            ></iframe>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ====== MODAL S WIDGETEM BALÍKOVNY ====== -->
    <Teleport to="body">
      <div v-if="showBalikovnaWidget" class="modal-overlay" @click.self="closeBalikovnaWidget">
        <div class="modal-box">
          <div class="modal-header">
            <h3>
              <span style="font-size:24px;">📮</span>
              Vyberte výdejní místo Balíkovny
            </h3>
            <button class="modal-close" @click="closeBalikovnaWidget">✕</button>
          </div>

          <div class="modal-body">
            <iframe
                ref="balikovnaIframe"
                src="https://b2c.cpost.cz/locations/?type=BALIKOVNY"
                width="100%"
                height="550"
                frameborder="0"
                allow="geolocation"
            ></iframe>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'checkout'
})
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useCartStore } from '~/stores/cartStore'
import { useAuthStore } from '~/stores/authStore'
import CheckoutStepper from '~/components/CheckoutStepper.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()

// ============================================================
// 📌 ДАННЫЕ
// ============================================================

const shippingOptions = [
  {
    id: 'zasilkovna',
    name: 'Zásilkovna',
    description: 'Výdejní místa po celé ČR',
    price: 79,
    free: 1500,
    icon: '/images/zasilkovna.png'
  },
  {
    id: 'balikovna',
    name: 'Balíkovna',
    description: 'Výdejní místa České pošty',
    price: 69,
    free: 1500,
    icon: '/images/balíkovna.png'
  },
  {
    id: 'our-car',
    name: 'NAŠE AUTO - Praha + Okolí do 60 km',
    description: 'Kralupy nad Vltavou, Mělník, Roudnice nad Labem, Praha, Kladno, Slaný, Litoměřice, Louny atd.',
    price: 120,
    free: 1500,
    icon: null
  }
]

const paymentOptions = [
  {
    id: 'dobirka',
    name: 'Platba dobírkou',
    price: '35 Kč',
    price_value: 35
  },
  {
    id: 'bank-transfer',
    name: 'Bankovním převodem',
    price: 'ZDARMA',
    price_value: 0
  },
  {
    id: 'qr-payment',
    name: 'Okamžitá platba QR kódem',
    price: 'ZDARMA',
    price_value: 0
  }
]

// ============================================================
// 📌 СОСТОЯНИЯ
// ============================================================

const selectedShipping = ref(null)
const selectedPayment = ref(null)

// Zásilkovna
const showPacketaWidget = ref(false)
const parcelshopData = ref(null)
const packetaIframe = ref(null)
let lastSelectedId = null

// Balíkovna
const showBalikovnaWidget = ref(false)
const balikovnaData = ref(null)
const balikovnaPhone = ref(null)
const balikovnaIframe = ref(null)

// ============================================================
// 📌 МЕТОДЫ ВЫБОРА
// ============================================================

const selectShipping = (methodId) => {
  console.log('🔵 Выбран способ доставки:', methodId)

  selectedShipping.value = methodId
  authStore.setShippingMethod(methodId)

  const shippingData = {
    shippingMethod: methodId,
    paymentMethod: selectedPayment.value,
    parcelshop: authStore.shippingData.parcelshop
  }
  localStorage.setItem('shippingData', JSON.stringify(shippingData))

  console.log('📦 shippingData после сохранения:', authStore.shippingData)
  console.log('📦 localStorage shippingData:', localStorage.getItem('shippingData'))

  if (methodId === 'zasilkovna' && !parcelshopData.value) {
    nextTick(() => openPacketaWidget())
  }

  if (methodId === 'balikovna' && !balikovnaData.value) {
    nextTick(() => openBalikovnaWidget())
  }
}

const selectPayment = (methodId) => {
  console.log('🟢 Выбран способ оплаты:', methodId)

  selectedPayment.value = methodId
  authStore.setPaymentMethod(methodId)

  const shippingData = {
    shippingMethod: selectedShipping.value,
    paymentMethod: methodId,
    parcelshop: authStore.shippingData.parcelshop
  }
  localStorage.setItem('shippingData', JSON.stringify(shippingData))

  console.log('💰 paymentData после сохранения:', authStore.shippingData)
  console.log('📦 localStorage shippingData:', localStorage.getItem('shippingData'))
}

// ============================================================
// 📌 WIDGET ZÁSILKOVNY
// ============================================================

const openPacketaWidget = () => {
  showPacketaWidget.value = true
  document.body.style.overflow = 'hidden'
  lastSelectedId = null

  setTimeout(() => {
    if (packetaIframe.value) {
      const src = packetaIframe.value.src
      packetaIframe.value.src = ''
      packetaIframe.value.src = src
    }
  }, 100)
}

const closePacketaWidget = () => {
  showPacketaWidget.value = false
  document.body.style.overflow = ''
  if (packetaIframe.value) {
    setTimeout(() => {
      if (packetaIframe.value) {
        packetaIframe.value.src = 'about:blank'
      }
    }, 100)
  }
}

const onIframeLoad = () => {
  console.log('✅ Widget Zásilkovny načten')
}

// ============================================================
// 📌 WIDGET BALÍKOVNY
// ============================================================

const openBalikovnaWidget = () => {
  showBalikovnaWidget.value = true
  document.body.style.overflow = 'hidden'

  setTimeout(() => {
    if (balikovnaIframe.value) {
      const src = balikovnaIframe.value.src
      balikovnaIframe.value.src = ''
      balikovnaIframe.value.src = src
    }
  }, 100)
}

const closeBalikovnaWidget = () => {
  showBalikovnaWidget.value = false
  document.body.style.overflow = ''

  if (balikovnaIframe.value) {
    setTimeout(() => {
      if (balikovnaIframe.value) {
        balikovnaIframe.value.src = 'about:blank'
      }
    }, 100)
  }
}

// ============================================================
// 📌 УВЕДОМЛЕНИЕ
// ============================================================

function showNotification(message) {
  const old = document.querySelector('.notification-toast')
  if (old) old.remove()

  const div = document.createElement('div')
  div.className = 'notification-toast'
  div.textContent = message
  div.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #2e7d32;
    color: white;
    padding: 14px 28px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    z-index: 99999;
    animation: slideUp 0.3s;
  `
  document.body.appendChild(div)

  setTimeout(() => {
    div.style.opacity = '0'
    div.style.transition = 'opacity 0.3s'
    setTimeout(() => div.remove(), 300)
  }, 3000)
}

// ============================================================
// 📌 ОБРАБОТЧИКИ СООБЩЕНИЙ
// ============================================================

// Zásilkovna
function handlePacketaMessage(event) {
  if (event.origin !== 'https://widget.packeta.com') return

  const data = event.data

  if (data && data.packetaBranchId) {
    if (lastSelectedId === data.packetaBranchId) {
      console.log('⚠️ Duplicitní událost Zásilkovna, ignoruji')
      return
    }
    lastSelectedId = data.packetaBranchId

    console.log('✅ Vybrána Zásilkovna pobočka:', data.packetaBranchName)

    const pointData = {
      id: data.packetaBranchId,
      name: data.packetaBranchName,
      openingHours: data.packetaBranchOpeningHours || 'Po–Ne Nonstop',
      url: data.packetaBranchUrl,
      isCreditCard: data.packetaBranchCreditCardPayment || false,
      type: 'zasilkovna',
      price: 79,
      address: data.packetaBranchStreet || data.packetaBranchName || '',
      city: data.packetaBranchCity || 'Praha',
      postcode: data.packetaBranchZip || '14900'
    }

    try {
      parcelshopData.value = pointData
      authStore.setParcelshopData(pointData)
      localStorage.setItem('selectedPacketaPoint', JSON.stringify(pointData))

      const shippingData = {
        shippingMethod: selectedShipping.value,
        paymentMethod: selectedPayment.value,
        parcelshop: pointData
      }
      localStorage.setItem('shippingData', JSON.stringify(shippingData))

      closePacketaWidget()
      showNotification(`✅ Zásilkovna vybrána: ${pointData.name}`)
    } catch (error) {
      console.error('❌ Chyba při ukládání Zásilkovna:', error)
    }
  }
}

// Balíkovna
function handleBalikovnaMessage(event) {
  if (event.origin !== 'https://b2c.cpost.cz') return

  const data = event.data

  if (data && data.message === 'pickerResult' && data.point) {
    const point = data.point

    console.log('✅ Vybrána Balíkovna:', point.name)

    const pointData = {
      id: point.id,
      name: point.name,
      address: point.address,
      zip: point.zip,
      type: 'balikovna',
      coords: point.coords,
      openingHours: point.opening_hours,
      isAtm: point.atm || false,
      parking: point.parking || false,
      distanceMeters: point.distanceMeters || 0,
      district: point.district || '',
      municipality: point.municipality_name || '',
      price: 69,
      city: point.city || 'Praha',
      postcode: point.zip || '14900'
    }

    try {
      balikovnaData.value = pointData
      balikovnaPhone.value = data.phone || null

      authStore.setParcelshopData({
        ...pointData,
        type: 'balikovna'
      })

      localStorage.setItem('selectedBalikovnaPoint', JSON.stringify(pointData))
      if (data.phone) {
        localStorage.setItem('balikovnaPhone', data.phone)
      }

      const shippingData = {
        shippingMethod: selectedShipping.value,
        paymentMethod: selectedPayment.value,
        parcelshop: { ...pointData, type: 'balikovna' }
      }
      localStorage.setItem('shippingData', JSON.stringify(shippingData))

      closeBalikovnaWidget()
      showNotification(`✅ Balíkovna vybrána: ${pointData.name}`)
    } catch (error) {
      console.error('❌ Chyba při ukládání Balíkovna:', error)
    }
  }
}

// ============================================================
// 📌 ПРОДОЛЖИТЬ ЗАКАЗ
// ============================================================

const handleContinue = () => {
  if (!selectedShipping.value || !selectedPayment.value) {
    console.warn('⚠️ Chybí vybraný způsob dopravy nebo platby')
    return
  }

  if (selectedShipping.value === 'zasilkovna' && !parcelshopData.value) {
    openPacketaWidget()
    return
  }

  if (selectedShipping.value === 'balikovna' && !balikovnaData.value) {
    openBalikovnaWidget()
    return
  }

  const shippingData = {
    shippingMethod: selectedShipping.value,
    paymentMethod: selectedPayment.value,
    parcelshop: authStore.shippingData.parcelshop
  }
  localStorage.setItem('shippingData', JSON.stringify(shippingData))
  console.log('📦 Перед переходом сохранено:', shippingData)

  navigateTo('/dodaci-udaje')
}

// ============================================================
// 📌 ГЕТТЕРЫ
// ============================================================

const cartItems = computed(() => {
  return cartStore.items.filter(item => item.type === 'cart')
})

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

const handleImageError = (e) => {
  e.target.src = '/images/no-image.png'
}

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

const cartTotalPrice = computed(() => {
  if (!cartItems.value || !Array.isArray(cartItems.value)) return 0
  return cartItems.value.reduce((sum, item) => {
    const price = getProductPrice(item)
    const quantity = item?.quantity || 1
    return sum + (price * quantity)
  }, 0)
})

const selectedShippingOption = computed(() => {
  return shippingOptions.find(o => o.id === selectedShipping.value)
})

const selectedPaymentOption = computed(() => {
  return paymentOptions.find(o => o.id === selectedPayment.value)
})

const shippingPrice = computed(() => {
  if (!selectedShippingOption.value) return 0
  const total = cartTotalPrice.value
  if (selectedShippingOption.value.free && total >= selectedShippingOption.value.free) {
    return 0
  }
  return selectedShippingOption.value.price
})

const paymentPrice = computed(() => {
  if (!selectedPaymentOption.value) return 0
  return selectedPaymentOption.value.price_value || 0
})

const finalTotalPrice = computed(() => {
  return cartTotalPrice.value + shippingPrice.value + paymentPrice.value
})

const formatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0,00'
  }
  const num = parseFloat(price)
  if (isNaN(num)) return '0,00'
  return num.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ============================================================
// 📌 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

const navigateTo = (path) => {
  if (process.client) {
    window.location.href = path
  }
}

const handleStepChange = (step) => {
  console.log('Переход на шаг:', step)
}

// Получение детали способа доставки
const getShippingDetail = () => {
  if (!selectedShippingOption.value) return ''

  const option = selectedShippingOption.value

  if (option.id === 'zasilkovna') {
    return 'Zásilkovna'
  }

  if (option.id === 'balikovna') {
    return 'Balíkovna'
  }

  if (option.id === 'our-car') {
    return 'NAŠE AUTO'
  }

  return ''
}

// Получение детали способа оплаты
const getPaymentDetail = () => {
  if (!selectedPaymentOption.value) return ''

  const option = selectedPaymentOption.value

  if (option.id === 'dobirka') {
    return 'Platba dobírkou'
  }

  if (option.id === 'bank-transfer') {
    return 'Bankovním převodem'
  }

  if (option.id === 'qr-payment') {
    return 'Okamžitá platba QR kódem'
  }

  return ''
}

// ============================================================
// 📌 ЖИЗНЕННЫЙ ЦИКЛ
// ============================================================

onMounted(() => {
  cartStore.fetchCart()

  console.log('🔄 Загрузка страницы - authStore.shippingData:', authStore.shippingData)

  if (authStore.shippingData.shippingMethod) {
    selectedShipping.value = authStore.shippingData.shippingMethod
    console.log('✅ Восстановлен способ доставки:', selectedShipping.value)
  } else {
    const saved = localStorage.getItem('shippingData')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.shippingMethod) {
          selectedShipping.value = data.shippingMethod
          authStore.setShippingMethod(data.shippingMethod)
          console.log('✅ Восстановлен способ доставки из localStorage:', selectedShipping.value)
        }
        if (data.paymentMethod) {
          selectedPayment.value = data.paymentMethod
          authStore.setPaymentMethod(data.paymentMethod)
          console.log('✅ Восстановлен способ оплаты из localStorage:', selectedPayment.value)
        }
        if (data.parcelshop) {
          authStore.setParcelshopData(data.parcelshop)
          if (data.parcelshop.type === 'zasilkovna') {
            parcelshopData.value = data.parcelshop
          } else if (data.parcelshop.type === 'balikovna') {
            balikovnaData.value = data.parcelshop
          }
        }
      } catch (e) {
        console.warn('Chyba při načítání shippingData z localStorage:', e)
      }
    }
  }

  if (authStore.shippingData.paymentMethod) {
    selectedPayment.value = authStore.shippingData.paymentMethod
    console.log('✅ Восстановлен способ оплаты:', selectedPayment.value)
  }

  // Восстанавливаем Zásilkovna
  if (authStore.shippingData.parcelshop?.type === 'zasilkovna') {
    parcelshopData.value = authStore.shippingData.parcelshop
    console.log('✅ Восстановлена Zásilkovna:', parcelshopData.value)
  } else {
    const saved = localStorage.getItem('selectedPacketaPoint')
    if (saved) {
      try {
        const point = JSON.parse(saved)
        parcelshopData.value = point
        authStore.setParcelshopData(point)
        console.log('✅ Восстановлена Zásilkovna z localStorage:', point)
      } catch (e) {
        console.warn('Chyba při načítání Zásilkovna z localStorage:', e)
      }
    }
  }

  // Восстанавливаем Balíkovna
  if (authStore.shippingData.parcelshop?.type === 'balikovna') {
    balikovnaData.value = authStore.shippingData.parcelshop
    console.log('✅ Восстановлена Balíkovna:', balikovnaData.value)
  } else {
    const saved = localStorage.getItem('selectedBalikovnaPoint')
    if (saved) {
      try {
        const point = JSON.parse(saved)
        balikovnaData.value = point
        authStore.setParcelshopData({ ...point, type: 'balikovna' })
        console.log('✅ Восстановлена Balíkovna z localStorage:', point)
      } catch (e) {
        console.warn('Chyba při načítání Balíkovna z localStorage:', e)
      }
    }
  }

  const savedPhone = localStorage.getItem('balikovnaPhone')
  if (savedPhone) {
    balikovnaPhone.value = savedPhone
  }

  window.addEventListener('message', handlePacketaMessage)
  window.addEventListener('message', handleBalikovnaMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handlePacketaMessage)
  window.removeEventListener('message', handleBalikovnaMessage)
  document.body.style.overflow = ''
})

// ============================================================
// 📌 ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЙ
// ============================================================

watch(() => authStore.shippingData.shippingMethod, (newVal) => {
  if (newVal !== selectedShipping.value) {
    selectedShipping.value = newVal
  }
})

watch(() => authStore.shippingData.paymentMethod, (newVal) => {
  if (newVal !== selectedPayment.value) {
    selectedPayment.value = newVal
  }
})

watch(() => authStore.shippingData.parcelshop, (newVal) => {
  if (newVal && JSON.stringify(newVal) !== JSON.stringify(parcelshopData.value)) {
    if (newVal.type === 'zasilkovna') {
      parcelshopData.value = newVal
    } else if (newVal.type === 'balikovna') {
      balikovnaData.value = newVal
    }
  }
})

// ============================================================
// 📌 SEO
// ============================================================

useHead({
  title: 'Doprava a platba | New Idea',
  meta: [
    {
      name: 'description',
      content: 'Vyberte způsob dopravy a platby pro vaši objednávku v internetovém obchodě New Idea.'
    }
  ]
})
</script>

<style scoped>
/* ===== ОБЩИЕ СТИЛИ ===== */
.shipping-page {
  max-width: 1270px;
  margin: 0 auto;
  padding: 20px 15px 60px;
}

.shipping-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.shipping-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.shipping-left {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

/* ===== ОПЦИИ ДОСТАВКИ ===== */
.shipping-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shipping-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.shipping-option:hover {
  border-color: #94a3b8;
}

.shipping-option.selected {
  border-color: #e11d48;
  background: #fef2f2;
}

/* ===== РАДИО КНОПКИ ===== */
.option-radio {
  padding-top: 2px;
  flex-shrink: 0;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.shipping-option.selected .radio-circle,
.payment-option.selected .radio-circle {
  border-color: #e11d48;
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: #e11d48;
  border-radius: 50%;
}

/* ===== ОПЦИИ ОПЛАТЫ ===== */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.payment-option:hover {
  border-color: #94a3b8;
}

.payment-option.selected {
  border-color: #e11d48;
  background: #fef2f2;
}

.payment-option .option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

/* ===== КОНТЕНТ ОПЦИЙ ===== */
.option-icon {
  height: 24px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 8px;
}

.option-name {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.option-price {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
}

.option-description {
  font-size: 13px;
  color: #6b7280;
  margin: 2px 0 0 0;
  line-height: 1.4;
}

.option-free {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
  display: block;
  margin-top: 4px;
}

/* ===== PARCELSHOP ===== */
.parcelshop-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.parcelshop-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.parcelshop-address {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.parcelshop-hours {
  font-size: 13px;
  color: #6b7280;
}

.parcelshop-phone {
  font-size: 13px;
  color: #6b7280;
}

.parcelshop-badge {
  display: inline-block;
  background: #ff6b00;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 12px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.parcelshop-badge-balikovna {
  background: #005c9e;
}

.btn-change-parcelshop {
  padding: 4px 14px;
  background: white;
  border: 1.5px solid #e11d48;
  color: #e11d48;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-change-parcelshop:hover {
  background: #e11d48;
  color: white;
}

.btn-change-zasilkovna {
  border-color: #ff6b00;
  color: #ff6b00;
}

.btn-change-zasilkovna:hover {
  background: #ff6b00;
  color: white;
}

.btn-change-balikovna {
  border-color: #005c9e;
  color: #005c9e;
}

.btn-change-balikovna:hover {
  background: #005c9e;
  color: white;
}

/* ===== ПРАВАЯ КОЛОНКА - SUMMARY ===== */
.shipping-right {
  display: flex;
  flex-direction: column;
  position: relative;
  align-self: flex-start;
  height: 100%;
  min-height: 500px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
  width: 100%;
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
  padding-right: 4px;
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
  padding: 8px 0;
  gap: 10px;
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
}

.item-name {
  font-size: 13px;
  color: #4b5563;
  word-break: break-word;
  line-height: 1.4;
}

.item-price {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
}

.summary-divider {
  border-top: 1px solid #e5e7eb;
  margin: 8px 0;
}

/* ===== ИТОГИ ===== */
.summary-totals {
  display: flex;
  flex-direction: column;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  min-height: 36px;
  font-size: 13px;
  color: #4b5563;
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
}

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
}

.summary-address .address-value {
  font-weight: 400;
  color: #6b7280;
  font-size: 13px;
  text-align: right;
  flex: 1;
  word-break: break-word;
}

/* ===== БЛОК С ИТОГОВОЙ ЦЕНОЙ ===== */
.summary-price-block {
  background: #f3f4f6;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 4px 0 12px 0;
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

/* ===== КНОПКИ ===== */
.summary-actions {
  margin: 0 auto;
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
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.checkout-btn:hover:not(.disabled) {
  background: #be123c;
}

.checkout-btn.disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

/* ===== МОДАЛКИ ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.25s ease;
}

.modal-box {
  background: white;
  border-radius: 12px;
  width: 95%;
  max-width: 1000px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f3f5;
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  flex: 1;
  min-height: 500px;
  position: relative;
}

.modal-body iframe {
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(30px) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 992px) {
  .shipping-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .shipping-right {
    height: auto;
    min-height: auto;
  }

  .order-summary {
    position: relative;
    top: 0;
    max-height: none;
    overflow-y: visible;
  }

  .summary-items {
    max-height: 200px;
  }
}

@media (max-width: 768px) {
  .shipping-page {
    padding: 16px 10px 40px;
  }

  .shipping-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 15px;
  }

  .shipping-option {
    padding: 12px 14px;
  }

  .option-name {
    font-size: 14px;
  }

  .option-price {
    font-size: 14px;
  }

  .payment-option {
    padding: 10px 14px;
  }

  .shipping-right {
    height: auto;
    min-height: auto;
  }

  .order-summary {
    position: relative;
    top: 0;
    max-height: none;
    overflow-y: visible;
    padding: 14px 16px;
  }

  .summary-items {
    max-height: 160px;
  }

  .summary-price-label {
    font-size: 15px;
  }

  .summary-price-value {
    font-size: 18px;
  }

  .continue-shopping {
    text-align: center;
    width: 100%;
  }

  .modal-box {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-body {
    min-height: 60vh;
  }

  .parcelshop-selected {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-change-parcelshop {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .shipping-title {
    font-size: 18px;
  }

  .option-name {
    font-size: 13px;
  }

  .option-price {
    font-size: 13px;
  }

  .item-name {
    font-size: 12px;
  }

  .item-price {
    font-size: 12px;
  }

  .summary-item-image {
    width: 28px;
    height: 28px;
  }

  .summary-price-block {
    padding: 12px 16px;
  }

  .summary-price-label {
    font-size: 14px;
  }

  .summary-price-value {
    font-size: 16px;
  }

  .summary-items {
    max-height: 140px;
  }

  .checkout-btn {
    font-size: 13px;
    padding: 10px 20px;
  }

  .continue-shopping {
    font-size: 12px;
  }

  .summary-row {
    font-size: 12px;
    padding: 5px 0;
  }

  .summary-address .address-value {
    max-width: 120px;
    font-size: 11px;
  }
}
</style>