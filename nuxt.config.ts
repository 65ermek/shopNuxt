// nuxt.config.ts
export default defineNuxtConfig({
  // ✅ Runtime config (работает на сервере и клиенте)
  runtimeConfig: {
    public: {
      apiBase: import.meta.env.NUXT_PUBLIC_API_BASE || 'https://obchod.tanatar.cz'
    }
  },

  // ✅ CSS
  css: ['~/assets/styles/main.css'],

  // ✅ Дата совместимости
  compatibilityDate: '2025-07-15',

  // ✅ DevTools
  devtools: { enabled: true },

  // ✅ Модули
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/ui'
  ],

  // ✅ Vue настройки (ИСПРАВЛЕНО)
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag === 'Teleport'
    }
  },

  // ✅ Настройки Vite (для предварительной сборки)
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  }
})