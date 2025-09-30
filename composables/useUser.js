// /composables/useUser.js
export const useUser = () => {
  // Esta función obtiene el rol de un usuario por su ID
  const getUserRole = async (userId) => {
    try {
      const res = await $fetch(`http://127.0.0.1:8000/api/v1/usuarios/${userId}`);
      // Suponiendo que tu API devuelve { id, nombre, email, rol }
      return res?.rol_id || null;
    } catch (error) {
      console.error("Error al obtener rol del usuario:", error);
      return null;
    }
  };

  return { getUserRole };
};
