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
    const roleMap = { 1: 'usuario', 2: 'administrador', 3: 'cirujano', 4: 'veterinario', 6: 'enfermero', 7: 'recepcionista' };
    const role = roleMap[roleId];

    // Rutas protegidas (no hace falta proteger '/')
    const routeRoles = {
      //Cirugias
      "/cirugias": ["administrador", "cirujano"],
      "/cirugias/nuevo": ["administrador", "cirujano"],
      '^/cirugias/\\d+$': ['administrador', 'cirujano'],
      //citas
      "/citas": ["administrador", "cirujano", "veterinario", "enfermero", "recepcionista"],
      //clientes
      "/clientes": ["administrador", "recepcionista"],
      "/clientes/nuevo": ["administrador"],
      '^/clientes/\\d+$': ['administrador', 'recepcionista'],
      //consultas
      "/consultas": ["administrador", "cirujano", "veterinario", "enfermero", "recepcionista"],
      "/consultas/nuevo": ["administrador", "cirujano", "veterinario", "enfermero", "recepcionista"],
      "^/clientes/\\d+$": ["administrador", "cirujano", "veterinario", "enfermero", "recepcionista"],
      //fisioterapias
      "/fisioterapias": ["administrador", "veterinario", "enfermero", "recepcionista"],
      "/fisioterapias/nuevo": ["administrador", "veterinario", "enfermero", "recepcionista"],
      "^/fisioterapias/\\d+$": ["administrador", "veterinario", "enfermero", "recepcionista"],
      //pacientes
      "/pacientes": ["administrador", "recepcionista"],
      "/pacientes/nuevo": ["administrador", "veterinario",],
      "^/pacientes/\\d+$": ["administrador", "veterinario",],
      //reportes
      "^/reportes/\\d+$": ["administrador", "veterinario", "enfermero", "recepcionista"],
      //tratamientos
      "/tratamientos": ["administrador", "veterinario", "enfermero", "recepcionista", "cirujano"],
      "/tratamientos/nuevo": ["administrador", "veterinario", "enfermero", "recepcionista", "cirujano"],
      "^/tratamientos/\\d+$": ["administrador", "veterinario", "enfermero", "recepcionista", "cirujano"],
      //usuarios
      "/usuarios": ["administrador"],
      //expedientes
      "/expedientes": ["administrador", "veterinario", "enfermero", "recepcionista", "cirujano"],
    };

    const matched = Object.entries(routeRoles).find(([pattern]) =>
      new RegExp(pattern).test(to.path)
    );

    if (matched) {
      const [, allowedRoles] = matched;
      if (!allowedRoles.includes(role)) {
        return navigateTo('/no-permission');
      }
    }
  }
});
