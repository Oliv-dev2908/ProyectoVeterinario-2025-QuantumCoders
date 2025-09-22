export default defineNuxtConfig({
  server: {
    host: '0.0.0.0'
  },
  modules: ['@nuxtjs/tailwindcss'], // ← ya sin supabase
  css: ['@/assets/css/tailwind.css'],
  compatibilityDate: '2025-03-28'
})
