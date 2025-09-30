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
    try {
      await $fetch('/api/user/loginsignup', {
        method: 'GET',
        params: {
          uuid: newUser.id,
          name: newUser.user_metadata.full_name || newUser.user_metadata.name,
          email: newUser.email
        }
      })

      return navigateTo("/") // redirige al home
    } catch (error) {
      console.error("Error al registrar/confirmar usuario:", error)
    }
  }
}, { immediate: true })

</script>
