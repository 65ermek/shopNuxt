<template>
  <div class="captcha-container">
    <div class="captcha-display">
      <canvas ref="canvasRef" width="160" height="60" class="captcha-canvas"></canvas>
      <button type="button" class="captcha-refresh" @click="generateCaptcha" aria-label="Обновить капчу">
        🔄
      </button>
    </div>
    <div class="captcha-input-wrapper">
      <input
          v-model="userInput"
          type="text"
          class="captcha-input"
          placeholder="Opište text z obrázku"
          @input="validateInput"
          @keyup.enter="validateInput"
      />
      <span v-if="isValid === true" class="captcha-valid">✅</span>
      <span v-if="isValid === false" class="captcha-invalid">❌</span>
    </div>
    <p v-if="errorMessage" class="captcha-error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// ============================================================
// 📌 ПРОПСЫ И СОБЫТИЯ
// ============================================================

const emit = defineEmits<{
  (e: 'update:valid', value: boolean): void
  (e: 'update:value', value: string): void
}>()

// ============================================================
// 📌 СОСТОЯНИЯ
// ============================================================

const canvasRef = ref<HTMLCanvasElement | null>(null)
const userInput = ref<string>('')
const isValid = ref<boolean | null>(null)
const errorMessage = ref<string>('')
const currentCaptcha = ref<string>('')

// ============================================================
// 📌 ГЕНЕРАЦИЯ КАПЧИ
// ============================================================

const generateCaptcha = (): void => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Очищаем canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Фон
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#f0f4f8')
  gradient.addColorStop(1, '#e2e8f0')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Шум (линии)
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = `rgba(100, 116, 139, ${Math.random() * 0.3})`
    ctx.lineWidth = Math.random() * 2 + 1
    ctx.beginPath()
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.stroke()
  }

  // Точки (шум)
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(100, 116, 139, ${Math.random() * 0.5})`
    ctx.beginPath()
    ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3 + 1,
        0,
        Math.PI * 2
    )
    ctx.fill()
  }

  // Генерируем случайный текст (6 символов)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let text = ''
  for (let i = 0; i < 6; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  currentCaptcha.value = text

  // ✅ Рисуем текст с искажениями
  const charsArray = text.split('')
  for (let i = 0; i < charsArray.length; i++) {
    // ✅ Используем ! (non-null assertion) для TypeScript
    const char = charsArray[i]!
    const x = 20 + i * 22 + Math.random() * 8
    const y = 35 + Math.random() * 12
    const rotation = (Math.random() - 0.5) * 0.4
    const fontSize = 26 + Math.random() * 8

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.font = `${fontSize}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Тень для объема
    ctx.shadowColor = 'rgba(0,0,0,0.15)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    // Основной цвет
    ctx.fillStyle = `hsl(${Math.random() * 40 + 200}, 60%, ${Math.random() * 30 + 20}%)`
    ctx.fillText(char, 0, 0)

    // Обводка для читаемости
    ctx.shadowColor = 'transparent'
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1
    ctx.strokeText(char, 0, 0)

    ctx.restore()
  }

  // Сброс состояния
  isValid.value = null
  userInput.value = ''
  errorMessage.value = ''
  emit('update:valid', false)
}

// ============================================================
// 📌 ВАЛИДАЦИЯ
// ============================================================

const validateInput = (): void => {
  if (!userInput.value) {
    isValid.value = null
    errorMessage.value = ''
    emit('update:valid', false)
    return
  }

  const cleanedInput = userInput.value.toUpperCase().trim()
  const cleanedCaptcha = currentCaptcha.value.toUpperCase().trim()

  if (cleanedInput === cleanedCaptcha) {
    isValid.value = true
    errorMessage.value = ''
    emit('update:valid', true)
    emit('update:value', cleanedInput)
  } else if (cleanedInput.length >= cleanedCaptcha.length) {
    isValid.value = false
    errorMessage.value = 'Ověřovací kód se neshoduje. Zkuste to znovu.'
    emit('update:valid', false)
    // Автоматически обновляем капчу при ошибке
    setTimeout(() => {
      generateCaptcha()
    }, 1000)
  } else {
    isValid.value = null
    errorMessage.value = ''
    emit('update:valid', false)
  }
}

// ============================================================
// 📌 СБРОС ПРИ ИЗМЕНЕНИИ
// ============================================================

const resetCaptcha = (): void => {
  generateCaptcha()
}

// ============================================================
// 📌 ИНИЦИАЛИЗАЦИЯ
// ============================================================

onMounted(() => {
  generateCaptcha()
})

// ============================================================
// 📌 ЭКСПОРТ МЕТОДОВ ДЛЯ РОДИТЕЛЬСКОГО КОМПОНЕНТА
// ============================================================

defineExpose({
  resetCaptcha,
  isValid,
  currentCaptcha,
  userInput
})
</script>

<style scoped>
.captcha-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 0;
}

.captcha-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.captcha-canvas {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.captcha-canvas:hover {
  border-color: #94a3b8;
}

.captcha-refresh {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-refresh:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  transform: rotate(30deg);
}

.captcha-refresh:active {
  transform: rotate(90deg);
}

.captcha-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.captcha-input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  transition: border-color 0.2s;
  outline: none;
  background: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
}

.captcha-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.captcha-input::placeholder {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 400;
  color: #94a3b8;
}

.captcha-valid,
.captcha-invalid {
  position: absolute;
  right: 12px;
  font-size: 20px;
}

.captcha-error {
  color: #dc2626;
  font-size: 13px;
  margin: 0;
  font-weight: 500;
}

/* Адаптивность */
@media (max-width: 480px) {
  .captcha-canvas {
    width: 120px;
    height: 45px;
  }

  .captcha-refresh {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }

  .captcha-input {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>