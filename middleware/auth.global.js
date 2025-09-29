export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  // Espera a que Nuxt cargue la sesión
  await client.auth.getSession()

  // Si no hay usuario y la ruta no es login o sign-up
  if (!user.value && !['/login', '/signUp'].includes(to.path)) {
    return navigateTo('/login')
  }

  // Si hay usuario y va a login o sign-up, redirigir al home
  if (user.value && ['/login', '/signUp'].includes(to.path)) {
    return navigateTo('/')
  }

  // Si todo está bien, deja pasar
})
