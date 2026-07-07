<!-- pages/checkout.vue - пример использования -->
<template>
  <div class="checkout-page">
    <h1>Pokladna</h1>

    <!-- Форма заказа -->
    <form @submit.prevent="submitOrder">
      <!-- Email (обязательное поле) -->
      <div class="form-group">
        <label for="email">E-mail *</label>
        <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="vas@email.cz"
        />
      </div>

      <!-- Остальные поля -->
      <div class="form-group">
        <label for="firstName">Jméno *</label>
        <input id="firstName" v-model="form.firstName" required />
      </div>

      <div class="form-group">
        <label for="lastName">Příjmení *</label>
        <input id="lastName" v-model="form.lastName" required />
      </div>

      <div class="form-group">
        <label for="phone">Telefon *</label>
        <input id="phone" v-model="form.phone" type="tel" required />
      </div>

      <div class="form-group">
        <label for="address">Adresa *</label>
        <input id="address" v-model="form.address" required />
      </div>

      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Odesílám...' : 'Odeslat objednávku' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '~/stores/cartStore'

const cartStore = useCartStore()
const submitting = ref(false)

const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: ''
})

const submitOrder = async () => {
  if (submitting.value) return

  submitting.value = true

  try {
    // 1. Сохраняем email в корзину
    await cartStore.setUserEmail(form.value.email)

    // 2. Создаем заказ
    const orderData = {
      ...form.value,
      items: cartStore.cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0
      })),
      total: cartStore.cartTotal
    }

    // 3. Отправляем заказ на сервер
    const response = await $fetch('/api/orders', {
      method: 'POST',
      body: orderData
    })

    console.log('✅ Objednávka odeslána:', response)

    // 4. Очищаем корзину
    await cartStore.clearCart()

    // 5. Перенаправляем на страницу успеха
    navigateTo(`/objednavka-dokoncena?id=${response.id}`)

  } catch (error) {
    console.error('❌ Chyba při odesílání objednávky:', error)
  } finally {
    submitting.value = false
  }
}
</script>