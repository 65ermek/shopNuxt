<template>
  <div class="layout-wrapper">
    <LayoutTopBar />
    <LayoutAppHeader />

    <main class="main-content">
      <div class="container-custom">
        <slot />
      </div>
    </main>

    <LayoutAppFooter />
    <LayoutAppScrollTop />
    <CookieConsent />
  </div>
</template>
<script setup>
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap'
    }
  ]
})
</script>
<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1 0 auto;
  padding: 0;
}

.container-custom {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}
</style>