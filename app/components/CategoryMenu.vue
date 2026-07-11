<template>
  <div class="category-menu">
    <h3 class="category-menu-title">KATEGORIE</h3>
    <ul class="category-menu-list">
      <!-- Показываем скелетон загрузки -->
      <li v-if="pending" v-for="n in 5" :key="n" class="category-menu-skeleton">
        <span class="skeleton-line"></span>
      </li>

      <!-- Реальные категории -->
      <li v-else v-for="category in categories" :key="category.id">
        <NuxtLink
            :to="`/kategorie/${category.slug}`"
            class="category-menu-link"
            :class="{ active: isActive(category.slug) }"
        >
          {{ category.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

// ✅ Добавляем props для активной категории
const props = defineProps({
  activeSlug: {
    type: String,
    default: ''
  }
})

const route = useRoute()

// Используем useFetch для получения данных с API
const { data: categories, pending } = await useFetch('https://obchod.tanatar.cz/api/categories')

// ✅ Функция проверки активной категории
const isActive = (slug) => {
  // Если передан activeSlug через props - используем его
  if (props.activeSlug) {
    return props.activeSlug === slug
  }
  // Иначе проверяем по текущему маршруту (для страницы категории)
  return route.params.slug === slug
}
</script>

<style scoped>
.category-menu {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px 0;
}

.category-menu-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  padding: 0 16px 12px 16px;
  border-bottom: 2px solid #e5e7eb;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-menu-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
}

.category-menu-list li {
  border-bottom: 1px solid #f1f5f9;
}

.category-menu-list li:last-child {
  border-bottom: none;
}

.category-menu-link {
  display: block;
  padding: 10px 16px;
  color: #1e293b;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.category-menu-link:hover {
  background-color: #f1f5f9;
  color: #e11d48;
  padding-left: 20px;
}

/* ===== ✅ Активная категория (серая) ===== */
.category-menu-link.active {
  background-color: #f1f5f9;
  color: #6b7280;
  cursor: default;
  border-left: 3px solid #94a3b8;
  padding-left: 13px; /* компенсируем border */
}

.category-menu-link.active:hover {
  background-color: #f1f5f9;
  color: #6b7280;
  padding-left: 13px;
}

/* ===== Скелетон загрузки ===== */
.category-menu-skeleton {
  padding: 10px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.skeleton-line {
  display: block;
  height: 14px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  width: 70%;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Адаптивность */
@media (max-width: 768px) {
  .category-menu-link {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>