<!-- components/CurrencyWidget.vue -->
<template>
  <div class="currency-widget">
    <div class="currency-widget-header">
      <span class="currency-widget-title">💱 Kurzy měn</span>
      <ClientOnly>
        <button
            @click="handleRefresh"
            class="currency-refresh-btn"
            :disabled="isLoading"
        >
          <span :class="{ 'animate-spin': isLoading }">⟳</span>
        </button>
      </ClientOnly>
    </div>

    <div v-if="error" class="currency-error">
      ⚠️ {{ error }}
    </div>

    <div v-else class="currency-grid">
      <!-- EUR -->
      <div class="currency-card" :class="getSignalColor('EUR')">
        <div class="currency-row">
          <span class="currency-code">EUR</span>
          <span class="currency-rate">{{ getRateFormatted('EUR') }}</span>
          <span class="currency-unit">Kč</span>
        </div>
        <div class="currency-row">
          <span class="currency-change" :class="getChangeClass('EUR')">
            {{ getChangeFormatted('EUR') }}
          </span>
          <span class="currency-signal" :title="getSignalTitle('EUR')">
            {{ getSignalIcon('EUR') }}
            <span class="signal-text">{{ getSignalShortText('EUR') }}</span>
          </span>
        </div>
      </div>

      <!-- USD -->
      <div class="currency-card" :class="getSignalColor('USD')">
        <div class="currency-row">
          <span class="currency-code">USD</span>
          <span class="currency-rate">{{ getRateFormatted('USD') }}</span>
          <span class="currency-unit">Kč</span>
        </div>
        <div class="currency-row">
          <span class="currency-change" :class="getChangeClass('USD')">
            {{ getChangeFormatted('USD') }}
          </span>
          <span class="currency-signal" :title="getSignalTitle('USD')">
            {{ getSignalIcon('USD') }}
            <span class="signal-text">{{ getSignalShortText('USD') }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="currency-last-update">
      ⏱ {{ lastUpdate }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  fetchRates,
  getRates,
  getSignalColor,
  getSignalText,
  getLastUpdate,
  getLoadingState,
  getError
} from '~/utils/currencyRates'

const rates = ref(getRates())
const isLoading = ref(getLoadingState())
const error = ref(getError())
const lastUpdate = ref(getLastUpdate())

const updateData = () => {
  rates.value = getRates()
  isLoading.value = getLoadingState()
  error.value = getError()
  lastUpdate.value = getLastUpdate()
}

onMounted(() => {
  setInterval(updateData, 5000)
  updateData()
})

// ✅ Показываем курс в Kč (сколько стоит 1 EUR/USD)
const getRateFormatted = (code) => {
  const rate = rates.value.find(r => r.code === code)
  return rate && rate.rate ? rate.rate.toFixed(2) : '---'
}

// ✅ Изменение курса
const getChangeFormatted = (code) => {
  const rate = rates.value.find(r => r.code === code)
  if (!rate || !rate.previousRate || rate.previousRate === 0) return '0.00 Kč'
  const change = rate.rate - rate.previousRate
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(2)} Kč`
}

const getChangeClass = (code) => {
  const rate = rates.value.find(r => r.code === code)
  if (!rate || !rate.previousRate || rate.previousRate === 0) return ''
  return rate.change >= 0 ? 'change-positive' : 'change-negative'
}

const getSignalIcon = (code) => {
  const rate = rates.value.find(r => r.code === code)
  if (!rate) return ''
  switch (rate.signal) {
    case 'buy': return '🟢'
    case 'sell': return '🔴'
    default: return '⚪'
  }
}

const getSignalShortText = (code) => {
  const rate = rates.value.find(r => r.code === code)
  if (!rate) return ''
  switch (rate.signal) {
    case 'buy': return 'Nákup'
    case 'sell': return 'Prodej'
    default: return 'Čekat'
  }
}

const getSignalTitle = (code) => {
  return getSignalText(code)
}

const handleRefresh = () => {
  fetchRates()
  setTimeout(updateData, 500)
}
</script>

<style scoped>
.currency-widget {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  max-width: 280px;
  margin: 0 auto;
  font-size: 12px;
}

.currency-widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.currency-widget-title {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.currency-refresh-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #6b7280;
  padding: 2px;
  transition: color 0.2s;
  line-height: 1;
}

.currency-refresh-btn:hover:not(:disabled) {
  color: #1e293b;
}

.currency-refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.animate-spin {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.currency-error {
  color: #dc2626;
  font-size: 11px;
  padding: 4px;
  text-align: center;
}

.currency-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.currency-card {
  background: white;
  border-radius: 6px;
  padding: 8px 10px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s;
  min-height: 52px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.currency-card.text-green-600 {
  border-color: #22c55e;
  background: #f0fdf4;
}

.currency-card.text-red-600 {
  border-color: #ef4444;
  background: #fef2f2;
}

.currency-card.text-gray-500 {
  border-color: #d1d5db;
}

.currency-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 1.4;
}

.currency-code {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.currency-rate {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.currency-unit {
  font-size: 11px;
  font-weight: 400;
  color: #6b7280;
  margin-left: 2px;
}

.currency-change {
  font-size: 11px;
  font-weight: 600;
}

.change-positive {
  color: #22c55e;
}

.change-negative {
  color: #ef4444;
}

.currency-signal {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  cursor: help;
}

.signal-text {
  font-size: 10px;
  font-weight: 600;
  color: #4b5563;
}

.currency-card.text-green-600 .signal-text {
  color: #166534;
}

.currency-card.text-red-600 .signal-text {
  color: #991b1b;
}

.currency-card.text-gray-500 .signal-text {
  color: #6b7280;
}

.currency-last-update {
  text-align: center;
  font-size: 9px;
  color: #9ca3af;
  margin-top: 6px;
  padding-top: 4px;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 640px) {
  .currency-widget {
    max-width: 100%;
    padding: 8px 12px;
  }
}
</style>