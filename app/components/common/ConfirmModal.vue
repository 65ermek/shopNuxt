<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-icon">⚠️</div>
        <h3 class="modal-title">Opravdu chcete odebrat zboží z košíku?</h3>
        <p class="modal-subtitle">{{ itemName }}</p>

        <div class="modal-actions">
          <button class="modal-btn modal-btn-danger" @click="confirmRemove">
            Ano, odebrat
          </button>
          <button class="modal-btn modal-btn-secondary" @click="closeModal">
            Neodebírat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  itemName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirmRemove = () => {
  emit('confirm')
}

const closeModal = () => {
  emit('cancel')
}
</script>

<style scoped>
/* ===== ОВЕРЛЕЙ ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

/* ===== КОНТЕЙНЕР МОДАЛКИ ===== */
.modal-container {
  background: #ffffff;
  border-radius: 12px;
  max-width: 420px;
  width: 90%;
  padding: 32px 28px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

/* ===== КОНТЕНТ ===== */
.modal-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin: 0 0 8px 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #64748b;
  text-align: center;
  margin: 0 0 24px 0;
  word-break: break-word;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ===== КНОПКИ ===== */
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  padding: 10px 28px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.modal-btn-danger {
  background-color: #dc3545;
  color: #ffffff;
}

.modal-btn-danger:hover {
  background-color: #c82333;
}

.modal-btn-secondary {
  background-color: #f1f5f9;
  color: #1e293b;
}

.modal-btn-secondary:hover {
  background-color: #e5e7eb;
}

/* ===== АНИМАЦИИ ===== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 480px) {
  .modal-container {
    padding: 24px 16px 20px;
  }

  .modal-title {
    font-size: 16px;
  }

  .modal-btn {
    padding: 8px 16px;
    font-size: 13px;
    min-width: 100px;
  }
}
</style>