<template>
  <div class="layout-wrapper">
    <AppHeader />

    <main class="main-content">
      <div class="container-custom">
        <slot />
      </div>
    </main>

    <AppFooter />

    <AppScrollTop />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* занимает всю высоту экрана */
}

.main-content {
  flex: 1 0 auto; /* растягивается на всё свободное место */
}

/* Если используете container-custom — добавьте сюда же */
.container-custom {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
  width: 100%;
}
</style>