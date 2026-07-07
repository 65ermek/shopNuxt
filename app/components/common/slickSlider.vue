<template>
  <div v-if="isVisible" class="slick-slider-overlay" @click="closeSlider">
    <div class="slick-slider-container" @click.stop>
      <!-- Кнопка закрытия -->
      <button class="slider-close" @click="closeSlider">✕</button>

      <!-- Основное содержимое -->
      <div class="slider-content">
        <!-- Левая часть: 75% - основное изображение -->
        <div class="slider-main">
          <img
              :src="currentImage"
              :alt="'Фото ' + (currentIndex + 1)"
              class="slider-image"
              @error="handleImageError"
              @click="nextImage"
          />

          <!-- Навигация на изображении -->
          <button
              class="slider-nav prev"
              @click.stop="prevImage"
              :disabled="currentIndex === 0"
          >
            ‹
          </button>
          <button
              class="slider-nav next"
              @click.stop="nextImage"
              :disabled="currentIndex === images.length - 1"
          >
            ›
          </button>

          <!-- Индикатор -->
          <div class="slider-indicator">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>

        <!-- Правая часть: 25% - миниатюры -->
        <div class="slider-thumbs-container">
          <div class="slider-thumbs">
            <button
                v-for="(img, index) in images"
                :key="index"
                class="thumb-item"
                :class="{ active: currentIndex === index }"
                @click="currentIndex = index"
            >
              <img
                  :src="getImageUrl(typeof img === 'string' ? img : img.path)"
                  :alt="'Миниатюра ' + (index + 1)"
                  loading="lazy"
                  @error="handleThumbError"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// ============================================================
// 📌 ТИПЫ
// ============================================================

interface ImageItem {
  id?: number
  path: string
  // ✅ Вместо any используем конкретные типы или unknown
  is_main?: number
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  [key: string]: unknown // ✅ вместо any используем unknown
}

// ============================================================
// 📌 ПРОПСЫ
// ============================================================

const props = defineProps<{
  isVisible: boolean
  images: (string | ImageItem)[]
  initialIndex?: number
  apiBaseUrl?: string
}>()

// ============================================================
// 📌 СОБЫТИЯ
// ============================================================

const emit = defineEmits<{
  (e: 'close'): void
}>()

// ============================================================
// 📌 ЛОГИКА
// ============================================================

const API_BASE_URL = props.apiBaseUrl || 'https://obchod.tanatar.cz'

const currentIndex = ref(props.initialIndex || 0)

// ✅ Функция для получения пути из изображения
const getImagePath = (img: string | ImageItem): string => {
  if (typeof img === 'string') {
    return img
  }
  return img.path || ''
}

// Текущее изображение
const currentImage = computed(() => {
  if (!props.images.length) return ''

  const index = currentIndex.value
  // ✅ Проверяем, что индекс в пределах массива
  if (index < 0 || index >= props.images.length) return ''

  const img = props.images[index]
  if (!img) return ''

  const path = getImagePath(img)
  return getImageUrl(path)
})

// Получение URL изображения
const getImageUrl = (path: string): string => {
  if (!path) return '/images/no-image.png'
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}/${path}`
}

// Следующее изображение
const nextImage = (): void => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
}

// Предыдущее изображение
const prevImage = (): void => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// Закрытие слайдера
const closeSlider = (): void => {
  emit('close')
}

// Обработка клавиш
const handleKeydown = (e: KeyboardEvent): void => {
  if (!props.isVisible) return
  if (e.key === 'Escape') {
    closeSlider()
  } else if (e.key === 'ArrowRight') {
    nextImage()
  } else if (e.key === 'ArrowLeft') {
    prevImage()
  }
}

// Обработка ошибок изображений
const handleImageError = (e: Event): void => {
  const target = e.target as HTMLImageElement
  target.src = '/images/no-image.png'
}

const handleThumbError = (e: Event): void => {
  const target = e.target as HTMLImageElement
  target.src = '/images/no-image.png'
}

// Сброс индекса при открытии
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    currentIndex.value = props.initialIndex || 0
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKeydown)
  }
}, { immediate: true })
</script>

<style scoped>
/* ============================================================
   ОСНОВНОЙ КОНТЕЙНЕР
   ============================================================ */

.slick-slider-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
  padding: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.slick-slider-container {
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 100%;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* ============================================================
   КНОПКА ЗАКРЫТИЯ
   ============================================================ */

.slider-close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 10;
  line-height: 1;
}

.slider-close:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

/* ============================================================
   ОСНОВНОЙ КОНТЕНТ
   ============================================================ */

.slider-content {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 500px;
}

/* ============================================================
   ЛЕВАЯ ЧАСТЬ: 75% - ОСНОВНОЕ ИЗОБРАЖЕНИЕ
   ============================================================ */

.slider-main {
  width: 75%;
  height: 100%;
  background: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.slider-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  cursor: pointer;
}

/* ============================================================
   НАВИГАЦИЯ НА ИЗОБРАЖЕНИИ
   ============================================================ */

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 28px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.slider-nav:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.05);
}

.slider-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slider-nav.prev {
  left: 16px;
}

.slider-nav.next {
  right: 16px;
}

/* ============================================================
   ИНДИКАТОР
   ============================================================ */

.slider-indicator {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(4px);
  z-index: 5;
}

/* ============================================================
   ПРАВАЯ ЧАСТЬ: 25% - МИНИАТЮРЫ
   ============================================================ */

.slider-thumbs-container {
  width: 25%;
  height: 100%;
  background: #f8f9fa;
  padding: 16px 12px;
  overflow-y: auto;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slider-thumbs {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 120px;
  align-items: center;
  padding: 4px 0;
}

.thumb-item {
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  max-width: 80px;
  max-height: 80px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  background: white;
  transition: all 0.2s;
  flex-shrink: 0;
}

.thumb-item:hover {
  border-color: #94a3b8;
  transform: scale(1.05);
}

.thumb-item.active {
  border-color: #46a3fa;
  box-shadow: 0 0 12px rgba(70, 163, 250, 0.3);
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Стилизация скролла */
.slider-thumbs-container::-webkit-scrollbar {
  width: 4px;
}

.slider-thumbs-container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.slider-thumbs-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.slider-thumbs-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* ============================================================
   МОБИЛЬНАЯ ВЕРСИЯ
   ============================================================ */

@media (max-width: 992px) {
  .slider-thumbs-container {
    padding: 12px 8px;
  }

  .thumb-item {
    width: 72px;
    height: 72px;
    min-width: 72px;
    min-height: 72px;
    max-width: 72px;
    max-height: 72px;
  }
}

@media (max-width: 768px) {
  .slick-slider-overlay {
    padding: 10px;
  }

  .slick-slider-container {
    max-height: 95vh;
    border-radius: 12px;
  }

  .slider-content {
    flex-direction: column;
    min-height: 0;
  }

  .slider-main {
    width: 100%;
    height: 55vh;
    padding: 12px;
  }

  .slider-nav {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }

  .slider-nav.prev {
    left: 8px;
  }

  .slider-nav.next {
    right: 8px;
  }

  .slider-thumbs-container {
    width: 100%;
    height: auto;
    max-height: 25vh;
    padding: 10px 16px;
    border-left: none;
    border-top: 1px solid #e5e7eb;
    overflow-y: hidden;
    overflow-x: auto;
    flex-direction: row;
  }

  .slider-thumbs {
    flex-direction: row;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    max-width: 100%;
    justify-content: flex-start;
    flex-wrap: nowrap;
  }

  .slider-thumbs::-webkit-scrollbar {
    height: 3px;
  }

  .slider-thumbs::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
  }

  .slider-thumbs::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }

  .thumb-item {
    width: 60px;
    height: 60px;
    min-width: 60px;
    min-height: 60px;
    max-width: 60px;
    max-height: 60px;
    flex-shrink: 0;
  }

  .slider-close {
    top: 12px;
    right: 16px;
    font-size: 20px;
    padding: 6px 12px;
  }

  .slider-indicator {
    bottom: 12px;
    font-size: 12px;
    padding: 4px 12px;
  }
}

@media (max-width: 480px) {
  .slick-slider-overlay {
    padding: 6px;
  }

  .slider-main {
    height: 45vh;
    padding: 8px;
  }

  .slider-nav {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .slider-nav.prev {
    left: 4px;
  }

  .slider-nav.next {
    right: 4px;
  }

  .slider-thumbs-container {
    max-height: 20vh;
    padding: 6px 12px;
  }

  .slider-thumbs {
    gap: 4px;
  }

  .thumb-item {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;
    border-radius: 4px;
  }

  .slider-close {
    top: 8px;
    right: 12px;
    font-size: 18px;
    padding: 4px 10px;
  }

  .slider-indicator {
    bottom: 8px;
    font-size: 11px;
    padding: 3px 10px;
  }
}

/* ============================================================
   ОЧЕНЬ МАЛЕНЬКИЕ ЭКРАНЫ (до 360px)
   ============================================================ */

@media (max-width: 360px) {
  .slider-main {
    height: 40vh;
    padding: 6px;
  }

  .thumb-item {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
  }

  .slider-nav {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .slider-close {
    top: 6px;
    right: 10px;
    font-size: 16px;
    padding: 4px 8px;
  }

  .slider-indicator {
    bottom: 6px;
    font-size: 10px;
    padding: 2px 8px;
  }
}
</style>