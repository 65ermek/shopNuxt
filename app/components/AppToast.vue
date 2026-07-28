<!-- components/AppToast.vue -->
<template>
  <!-- ✅ Используем Teleport для рендеринга в body -->
  <Teleport to="body">
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
          v-if="toast.visible"
          class="toast-container"
      >
        <div
            class="toast-content"
            :class="{
            'toast-success': toast.type === 'success',
            'toast-error': toast.type === 'error',
            'toast-info': toast.type === 'info',
            'toast-warning': toast.type === 'warning',
          }"
        >
          <div class="toast-icon">
            <span v-if="toast.type === 'success'">✅</span>
            <span v-else-if="toast.type === 'error'">❌</span>
            <span v-else-if="toast.type === 'warning'">⚠️</span>
            <span v-else-if="toast.type === 'info'">ℹ️</span>
          </div>
          <div class="toast-body">
            <p class="toast-message">{{ toast.message }}</p>
            <p v-if="toast.subMessage" class="toast-submessage">{{ toast.subMessage }}</p>
          </div>
          <button @click="closeToast" class="toast-close">✕</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useToastStore } from '~/stores/toastStore'

const toastStore = useToastStore()
const { toast } = storeToRefs(toastStore)
const { close } = toastStore

const closeToast = () => {
  close()
}
</script>

<style scoped>
/* ✅ Стили для тоста - фиксированное позиционирование */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  max-width: 420px;
  width: 100%;
  pointer-events: auto;
  animation: slideInRight 0.3s ease-out;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  background: white;
}

.toast-success {
  background: #f0fdf4;
  border-color: #86efac;
}

.toast-error {
  background: #fef2f2;
  border-color: #fca5a5;
}

.toast-warning {
  background: #fffbeb;
  border-color: #fcd34d;
}

.toast-info {
  background: #eff6ff;
  border-color: #93c5fd;
}

.toast-icon {
  flex-shrink: 0;
  font-size: 24px;
  line-height: 1;
  margin-top: 2px;
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-message {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
}

.toast-success .toast-message {
  color: #166534;
}

.toast-error .toast-message {
  color: #991b1b;
}

.toast-warning .toast-message {
  color: #92400e;
}

.toast-info .toast-message {
  color: #1e40af;
}

.toast-submessage {
  font-size: 13px;
  margin: 4px 0 0 0;
  opacity: 0.7;
  white-space: pre-line;
  color: #4b5563;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  line-height: 1;
}

.toast-close:hover {
  color: #4b5563;
}

/* Анимации */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* Адаптивность */
@media (max-width: 640px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
    width: auto;
  }

  .toast-content {
    padding: 14px 16px;
  }
}
</style>