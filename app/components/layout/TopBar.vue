<template>
  <div class="top-bar">
    <div class="top-bar-inner">
      <!-- Левая часть: Контакты -->
      <div class="top-bar-left">
        <a href="tel:+420732199285" class="top-bar-phone">
          <span class="phone-icon">📞</span>
          +420 732 199 285
        </a>
        <span class="top-bar-worktime">(Po–Pá, 8–16 hod.)</span>
      </div>

      <!-- Правая часть: Доп. ссылки -->
      <div class="top-bar-right">
        <NuxtLink to="/pro-firmy" class="top-bar-link">
          PRO FIRMY A INSTITUCE
        </NuxtLink>
        <NuxtLink to="/kontakt" class="top-bar-link">
          KONTAKT
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  background-color: #1e293b;
  color: #e5e7eb;
  font-size: 0.8rem;
  padding: 6px 0;
  border-bottom: 1px solid #334155;
}

.top-bar-inner {
  max-width: 1270px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-bar-phone {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.top-bar-phone:hover {
  color: #facc15;
}

.phone-icon {
  margin-right: 4px;
}

.top-bar-worktime {
  color: #9ca3af;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.top-bar-link {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem;
  transition: color 0.2s;
  letter-spacing: 0.3px;
}

.top-bar-link:hover {
  color: #facc15;
}

@media (max-width: 768px) {
  .top-bar-inner {
    flex-direction: column;
    gap: 4px;
    padding: 4px 0;
  }

  .top-bar-left,
  .top-bar-right {
    font-size: 0.7rem;
  }
}
</style>