import { useUser } from '~/composables/useUser';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  await client.auth.getSession();

  const publicPaths = ['/login', '/signUp', '/no-permission'];

  // Si no hay usuario y la ruta no es pública
  if (!user.value && !publicPaths.includes(to.path)) {
    return navigateTo('/login');
  }

  // Si hay usuario y va a login o sign-up
  if (user.value && ['/login', '/signUp'].includes(to.path)) {
    return navigateTo('/');
  }

  if (user.value) {
    const { getUserRole } = useUser();
    const roleId = await getUserRole(user.value.id); // devuelve 1, 2 o 3

    // Mapear rolId a nombre de rol
    const roleMap = { 1: 'usuario', 2: 'administrador', 3: 'cirujano' };
    const role = roleMap[roleId];

    // Rutas protegidas (no hace falta proteger '/')
    const routeRoles = {
      "/clientes": ["administrador", "cirujano"],
      "/clientes/nuevo": ["administrador"],
      "/expedientes": ["administrador", "cirujano"],
      "/pacientes": ["usuario", "cirujano"],
      "/pacientes/nuevo": ["cirujano"],
    };

    const allowedRoles = routeRoles[to.path];
    if (allowedRoles && !allowedRoles.includes(role)) {
      if (!publicPaths.includes(to.path)) {
        return navigateTo('/no-permission'); 
      }
    }
  }
});
