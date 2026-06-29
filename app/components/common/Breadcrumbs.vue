<!-- components/common/Breadcrumbs.vue -->
<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumbs-list">
      <li class="breadcrumbs-item">
        <NuxtLink to="/" class="breadcrumbs-link">
          Domů
        </NuxtLink>
        <span class="breadcrumbs-separator">›</span>
      </li>
      <li
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumbs-item"
      >
        <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="breadcrumbs-link"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="breadcrumbs-current">
          {{ crumb.label }}
        </span>
        <span
            v-if="index < breadcrumbs.length - 1"
            class="breadcrumbs-separator"
        >
          ›
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Маппинг путей на названия
const routeNames = {
  'obchodni-podminky': 'Obchodní podmínky',
  'jak-objednat': 'Jak objednat',
  'pro-firmy-a-instituce': 'Pro firmy a instituce',
  'kontakt': 'Kontakt'
}

const breadcrumbs = computed(() => {
  const path = route.path
  const segments = path.split('/').filter(Boolean)

  // Если это главная страница, возвращаем пустой массив
  if (segments.length === 0) {
    return []
  }

  // Собираем хлебные крошки
  const crumbs = []
  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`
    const label = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    crumbs.push({
      path: currentPath,
      label: label
    })
  }

  return crumbs
})
</script>

<style scoped>
.breadcrumbs {
  padding: 12px 0 20px 0;
  font-size: 0.85rem;
}

.breadcrumbs-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumbs-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumbs-link {
  color: #4b5563;
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumbs-link:hover {
  color: #e11d48;
  text-decoration: underline;
}

.breadcrumbs-home {
  font-size: 0.9rem;
}

.breadcrumbs-current {
  color: #1e293b;
  font-weight: 600;
}

.breadcrumbs-separator {
  color: #9ca3af;
  font-weight: 300;
  padding: 0 2px;
}

/* Адаптивность */
@media (max-width: 576px) {
  .breadcrumbs {
    font-size: 0.75rem;
    padding: 8px 0 14px 0;
  }

  .breadcrumbs-home {
    font-size: 0.8rem;
  }
}
</style>