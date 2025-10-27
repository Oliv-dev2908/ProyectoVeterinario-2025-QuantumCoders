<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <!-- Ajuste por sidebar -->
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">👤 Gestión de Usuarios</h1>
          <p class="text-gray-500 text-sm mt-1">Administración de roles y permisos del sistema</p>
        </div>
      </div>

      <!-- 🧾 Tabla de usuarios -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm">
              <th class="p-3">Nombre</th>
              <th class="p-3">Email</th>
              <th class="p-3">Rol</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuariosFiltrados" :key="u.supabase_user_id" class="border-t hover:bg-teal-50 transition">
              <td class="p-3">{{ u.nombre }}</td>
              <td class="p-3">{{ u.email }}</td>
              <td class="p-3">
                <select v-model="u.rol_id" class="border rounded px-2 py-1 w-full">
                  <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">
                    {{ rol.nombre_rol }}
                  </option>
                </select>
              </td>
              <td class="p-3 flex justify-center gap-3">
                <button class="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
                  @click="asignarRol(u)">
                  Guardar
                </button>
              </td>
            </tr>

            <tr v-if="usuarios.length === 0">
              <td colspan="4" class="p-6 text-center text-gray-500">
                No hay usuarios registrados aún 🐶
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"

const usuarios = ref([])
const roles = ref([
  { id_rol: 1, nombre_rol: "Usuario" },
  { id_rol: 2, nombre_rol: "Administrador" },
  { id_rol: 3, nombre_rol: "Cirujano" },
  { id_rol: 4, nombre_rol: "Veterinario" },
  { id_rol: 6, nombre_rol: "Enfermero" },
  { id_rol: 7, nombre_rol: "Recepcionista" }
])

// 🔹 Usuario logueado
const user = useSupabaseUser()

onMounted(async () => {
  try {
    usuarios.value = await $fetch("/api/user")
  } catch (err) {
    console.error("Error cargando usuarios:", err)
  }
})

// 🔹 Computed para filtrar al usuario logueado
const usuariosFiltrados = computed(() => {
  if (!user.value?.id) return usuarios.value
  return usuarios.value.filter(u => u.supabase_user_id !== user.value.id)
})

const asignarRol = async (usuario) => {
  try {
    const body = {
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
      activo: usuario.activo,
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
