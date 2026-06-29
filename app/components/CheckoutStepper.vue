<template>
  <div class="checkout-stepper">
    <div class="stepper-steps">
      <div
          v-for="(step, index) in steps"
          :key="index"
          class="stepper-step"
          :class="{
          active: index === currentStep,
          completed: index < currentStep
        }"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <span class="step-label">{{ step.label }}</span>
        <div v-if="index < steps.length - 1" class="step-line"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    default: 0 // 0 = Košík, 1 = Doprava a platba, 2 = Dodací údaje, 3 = Rekapitulace
  }
})

const steps = [
  { label: 'Nákupní košík' },
  { label: 'Doprava a platba' },
  { label: 'Dodací údaje' },
  { label: 'Rekapitulace objednávky' }
]
</script>

<style scoped>
.checkout-stepper {
  margin-bottom: 30px;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.stepper-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.stepper-step {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  flex: 1;
}

.stepper-step:last-child {
  flex: 0 0 auto;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

/* Активный шаг */
.stepper-step.active .step-number {
  background-color: #007bff;
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15);
}

.stepper-step.active .step-label {
  color: #1e293b;
  font-weight: 700;
}

/* Завершённый шаг */
.stepper-step.completed .step-number {
  background-color: #10b981;
  color: #ffffff;
}

.stepper-step.completed .step-number::after {
  content: '✓';
  font-size: 14px;
}

.stepper-step.completed .step-number span {
  display: none;
}

.step-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.3s ease;
  white-space: nowrap;
}

/* Линия между шагами */
.step-line {
  flex: 1;
  height: 2px;
  background-color: #e5e7eb;
  margin: 0 12px;
  min-width: 20px;
  transition: background-color 0.3s ease;
}

/* Активная линия */
.stepper-step.active .step-line,
.stepper-step.completed .step-line {
  background-color: #007bff;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 768px) {
  .stepper-steps {
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 0;
    padding: 4px 0;
  }

  .stepper-step {
    flex: 0 0 auto;
    gap: 6px;
  }

  .step-number {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .step-label {
    font-size: 11px;
    white-space: nowrap;
  }

  .step-line {
    min-width: 16px;
    margin: 0 6px;
  }

  .stepper-step .step-label {
    display: block;
  }
}

@media (max-width: 480px) {
  .checkout-stepper {
    padding: 12px 0;
  }

  .step-number {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }

  .step-label {
    font-size: 9px;
  }

  .step-line {
    min-width: 10px;
    margin: 0 4px;
  }
}
</style>