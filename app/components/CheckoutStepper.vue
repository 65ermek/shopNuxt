<!-- components/CheckoutStepper.vue -->
<template>
  <div class="checkout-stepper">
    <div class="stepper-container">
      <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-item"
          :class="{
          'step-active': index + 1 === currentStep,
          'step-completed': index + 1 < currentStep,
          'step-disabled': index + 1 > currentStep
        }"
      >
        <NuxtLink
            :to="step.route"
            class="step-link"
            :class="{
            'step-link-disabled': index + 1 > currentStep
          }"
            :event="index + 1 <= currentStep ? 'click' : ''"
        >
          <span class="step-number">{{ index + 1 }}.</span>
          <span class="step-label">{{ step.label }}</span>
        </NuxtLink>
        <span v-if="index < steps.length - 1" class="step-separator">/</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true,
    default: 1
  }
})

const steps = [
  { label: 'Nákupní košík', route: '/cart' },
  { label: 'Doprava a platba', route: '/doprava-a-platba' },
  { label: 'Dodací údaje', route: '/dodaci-udaje' },
  { label: 'Rekapitulace objednávky', route: '/rekapitulace' }
]
</script>

<style scoped>
.checkout-stepper {
  margin-bottom: 40px;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.stepper-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.step-link {
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 15px;
  cursor: default;
}

/* Активная ссылка (текущий шаг) */
.step-active .step-link {
  color: #1a1a1a;
  font-weight: 600;
  cursor: default;
}

.step-active .step-number {
  color: #1a1a1a;
  font-weight: 700;
}

/* Пройденные шаги */
.step-completed .step-link {
  color: #1a1a1a;
  font-weight: 500;
  cursor: pointer;
}

.step-completed .step-link:hover {
  background: #f3f4f6;
}

.step-completed .step-number {
  color: #1a1a1a;
}

/* Будущие шаги (недоступные) */
.step-disabled .step-link {
  color: #9ca3af;
  cursor: not-allowed;
  pointer-events: none;
}

.step-disabled .step-number {
  color: #9ca3af;
}

/* Стили для номеров */
.step-number {
  font-weight: 500;
  color: #6b7280;
  transition: color 0.2s;
  font-size: 15px;
}

.step-label {
  transition: color 0.2s;
  font-size: 15px;
}

/* Разделитель между шагами */
.step-separator {
  color: #d1d5db;
  font-size: 14px;
  margin: 0 4px;
  user-select: none;
}

/* Адаптивность */
@media (max-width: 768px) {
  .stepper-container {
    gap: 4px;
  }

  .step-link {
    font-size: 13px;
    padding: 4px 6px;
  }

  .step-number {
    font-size: 13px;
  }

  .step-label {
    font-size: 13px;
  }

  .step-separator {
    font-size: 12px;
    margin: 0 2px;
  }
}

@media (max-width: 480px) {
  .stepper-container {
    gap: 2px;
  }

  .step-link {
    font-size: 11px;
    padding: 3px 4px;
  }

  .step-number {
    font-size: 11px;
  }

  .step-label {
    font-size: 11px;
  }

  .step-separator {
    font-size: 10px;
    margin: 0 1px;
  }
}
</style>