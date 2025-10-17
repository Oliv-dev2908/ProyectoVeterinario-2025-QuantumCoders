<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

    <table class="w-full border border-gray-300 rounded-lg shadow">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-3 text-left">Nombre</th>
          <th class="p-3 text-left">Email</th>
          <th class="p-3 text-left">Rol</th>
          <th class="p-3 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in usuarios" :key="u.supabase_user_id" class="border-b">
          <td class="p-3">{{ u.nombre }}</td>
          <td class="p-3">{{ u.email }}</td>
          <td class="p-3">
            <select v-model="u.rol_id" class="border rounded px-2 py-1">
              <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">
                {{ rol.nombre_rol }}
              </option>
            </select>
          </td>
          <td class="p-3 text-center">
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              @click="asignarRol(u)"
            >
              Guardar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const usuarios = ref([])
const roles = ref([
  { id_rol: 1, nombre_rol: "Usuario" },
  { id_rol: 2, nombre_rol: "Administrador" },
  { id_rol: 3, nombre_rol: "Cirujano" },
  { id_rol: 4, nombre_rol: "Veterinario" },
  { id_rol: 6, nombre_rol: "Enfermero" },
  { id_rol: 7, nombre_rol: "Recepcionista"}
]) 

// ✅ Cargar usuarios desde nuestra API interna
onMounted(async () => {
  try {
    usuarios.value = await $fetch("/api/user")
  } catch (err) {
    console.error("Error cargando usuarios:", err)
  }
})

// ✅ Asignar rol → llama a nuestra API interna
const asignarRol = async (usuario) => {
  try {
    // Enviamos todos los campos obligatorios con los valores actuales del usuario
    const body = {
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
      activo: usuario.activo, // asegúrate que el objeto usuario tenga este campo
    }

    await $fetch(`/api/user/${usuario.supabase_user_id}`, {
      method: "PUT",
      body,
    })

    alert(`Rol actualizado para ${usuario.nombre} ✅`)
  } catch (err) {
    console.error("Error actualizando rol:", err)
    alert("Error al actualizar rol ❌")
  }
}

</script>
