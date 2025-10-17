import { createPinia } from 'pinia'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  pinia.use(({ store }) => {
    if (process.server) return
    store.$devtools = false // evita devtools en SSR
  })
  nuxtApp.vueApp.use(pinia)
})
