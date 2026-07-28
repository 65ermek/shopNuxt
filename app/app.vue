<!-- app.vue -->
<template>
  <div>
    <!-- ✅ AppToast должен быть самым первым и вне NuxtLayout -->
    <AppToast />

    <!-- Основной контент -->
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const route = useRoute();
const layout = computed(() => route.meta.layout || 'default');
</script>