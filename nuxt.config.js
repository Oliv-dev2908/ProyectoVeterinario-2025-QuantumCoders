export default defineNuxtConfig({
  server: {
    host: '0.0.0.0'
  },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    bucketName: process.env.BUCKET_NAME
  },
  modules: ['@nuxtjs/tailwindcss'], // ← ya sin supabase
  css: ['@/assets/css/tailwind.css'],
  compatibilityDate: '2025-03-28'
})
