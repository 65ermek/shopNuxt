<template>
  <div class="category-menu">
    <h3 class="category-menu-title">KATEGORIE</h3>
    <ul class="category-menu-list">
      <li v-for="category in categories" :key="category.slug">
        <NuxtLink :to="category.path" class="category-menu-link">
          {{ category.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
// Данные категорий (позже можно будет загружать из API)
const categories = [
  { name: 'Tiskárny EPSON', slug: 'tiskarny-epson', path: '/kategorie/tiskarny-epson' },
  { name: 'Tiskové materiály', slug: 'tiskove-materialy', path: '/kategorie/tiskove-materialy' },
  { name: 'Inkousty EPSON', slug: 'inkousty-epson', path: '/kategorie/inkousty-epson' },
  { name: 'Toaletní papír', slug: 'toaletni-papir', path: '/kategorie/toaletni-papir' },
  { name: 'Display systémy', slug: 'display-systemy', path: '/kategorie/display-systemy' },
  { name: 'Výroba plastových karet', slug: 'plastove-karty', path: '/kategorie/plastove-karty' },
  { name: 'Obaly na hranolky', slug: 'obaly-na-hranolky', path: '/kategorie/obaly-na-hranolky' },
  { name: 'Menu boxy', slug: 'menu-boxy', path: '/kategorie/menu-boxy' },
  { name: 'Burger boxy', slug: 'burger-boxy', path: '/kategorie/burger-boxy' },
  { name: 'Misky na zatavení', slug: 'misky-na-zataveni', path: '/kategorie/misky-na-zataveni' }
]
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
</style>