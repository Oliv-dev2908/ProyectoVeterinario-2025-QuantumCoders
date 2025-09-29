<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
    <p class="text-lg">Confirmando inicio de sesión con {{ providerName }}...</p>
  </div>
</template>

<script setup>
import { useSupabaseUser } from '#imports'

const user = useSupabaseUser()

const providerName = computed(() => {
  switch (user.value?.app_metadata?.provider) {
    case 'facebook': return 'Facebook'
    case 'google': return 'Google'
    case 'linkedin_oidc': return 'LinkedIn'
    case 'github': return 'GitHub'
    case 'email': return 'Correo'
    default: return 'tu cuenta'
  }
})

watch(user, async (newUser) => {
  if (newUser) {
    // Aquí guardamos el usuario en tu API, igual que en login normal
    try {
      await fetch(`/api/user/loginsignup?uuid=${newUser.id}&name=${newUser.user_metadata.full_name || newUser.user_metadata.name}`)
      return navigateTo("/") // 🚀 lo mandamos al home
    } catch (error) {
      console.error("Error durante fetch:", error)
    }
  }
}, { immediate: true })
</script>



