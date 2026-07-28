<!-- layouts/checkout.vue -->
<template>
  <div class="checkout-layout">
    <!-- Упрощенный TopBar только для checkout -->
    <CheckoutTopBar />
    <CheckoutAppheader />
    <!-- Основной контент -->
    <main class="checkout-main">
      <div class="checkout-container">
        <slot />
      </div>
    </main>

    <!-- Простой футер для checkout -->
    <footer class="checkout-footer">
      <div class="checkout-footer-inner">
        <p class="footer-text">
          © {{ new Date().getFullYear() }} EOBCHOD. Všechna práva vyhrazena.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.checkout-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

.checkout-main {
  flex: 1;
  padding: 30px 0 60px;
}

.checkout-container {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
}

.checkout-footer {
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 16px 0;
}

.checkout-footer-inner {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
  text-align: center;
}

.footer-text {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

@media (max-width: 768px) {
  .checkout-main {
    padding: 20px 0 40px;
  }
}

@media (max-width: 480px) {
  .checkout-main {
    padding: 15px 0 30px;
  }
}
</style>