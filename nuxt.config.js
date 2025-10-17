export default defineNuxtConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000
  },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    bucketName: process.env.BUCKET_NAME,
    API_KEY: process.env.WASENDER_API_KEY,
    DEVICE_ID: process.env.WASENDER_DEVICE_ID
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/signUp'],
    }
  },
  css: ['@/assets/css/tailwind.css'],

  compatibilityDate: '2025-03-28'
})
