// /composables/useUser.js
import { ref } from 'vue'

export const useUser = () => {
  const user = ref(null)

  // Función para cargar usuario desde Supabase / localStorage / sesión
  const loadUser = async (supabaseUserId) => {
    if (!supabaseUserId) return
    try {
      const res = await $fetch(`http://127.0.0.1:8000/api/v1/usuarios/${supabaseUserId}`)
      user.value = res
    } catch (err) {
      console.error('Error cargando usuario:', err)
    }
  }

  const getUserRole = async (userId) => {
    try {
      const res = await $fetch(`http://127.0.0.1:8000/api/v1/usuarios/${userId}`);
      return res?.rol_id || null;
    } catch (error) {
      console.error("Error al obtener rol del usuario:", error);
      return null;
    }
  };

  return { user, loadUser, getUserRole }
}
