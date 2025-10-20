<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <!-- Ajuste por sidebar -->
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">💊 Tratamientos</h1>
          <p class="text-gray-500 text-sm mt-1">Gestión de tratamientos veterinarios</p>
        </div>

        <NuxtLink
          to="/tratamientos/nuevo"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
        >
          ➕ Nuevo Tratamiento
        </NuxtLink>
      </div>

      <!-- 🧾 Tabla de tratamientos -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm">
              <th class="p-3">ID</th>
              <th class="p-3">Paciente</th>
              <th class="p-3">Usuario</th>
              <th class="p-3">Fecha inicio</th>
              <th class="p-3">Fecha fin</th>
              <th class="p-3">Descripción</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in tratamientos"
              :key="t.id_tratamiento"
              class="border-t hover:bg-teal-50 transition"
            >
              <td class="p-3 font-medium">{{ t.id_tratamiento }}</td>
              <td class="p-3">{{ t.nombre_paciente }}</td>
              <td class="p-3">{{ t.nombre_usuario }}</td>
              <td class="p-3">{{ t.fecha_inicio }}</td>
              <td class="p-3">{{ t.fecha_fin }}</td>
              <td class="p-3">{{ t.descripcion }}</td>
              <td class="p-3 flex justify-center gap-3">
                <NuxtLink
                  :to="`/tratamientos/${t.id_tratamiento}`"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ✏️ Editar
                </NuxtLink>
                <button
                  @click="eliminar(t.id_tratamiento)"
                  class="text-red-500 hover:text-red-700 font-medium"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>

            <tr v-if="tratamientos.length === 0">
              <td colspan="7" class="p-6 text-center text-gray-500">
                No hay tratamientos registrados aún 🐶
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const tratamientos = ref([])
const pacientes = ref([])
const usuarios = ref([])

const cargarPacientes = async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")
  } catch (e) {
    console.error("Error al cargar pacientes", e)
  }
}

const cargarUsuarios = async () => {
  try {
    usuarios.value = await $fetch("/api/user")
  } catch (err) {
    console.error("Error cargando usuarios:", err)
  }
}

onMounted(async () => {
  await Promise.all([cargarPacientes(), cargarUsuarios()])

  const t = await $fetch("/api/tratamientos")

  tratamientos.value = t.map(trat => {
    const paciente = pacientes.value.find(pa => pa.id_paciente === trat.id_paciente)
    const usuario = usuarios.value.find(us => us.id_usuario === trat.id_usuario)

    return {
      ...trat,
      nombre_paciente: paciente ? paciente.nombre : "Desconocido",
      nombre_usuario: usuario ? usuario.nombre : "Desconocido",
    }
  })
})

const eliminar = async (id) => {
  if (confirm("¿Seguro que deseas eliminar este tratamiento?")) {
    await $fetch(`/api/tratamientos/${id}`, { method: "DELETE" })
    tratamientos.value = tratamientos.value.filter(t => t.id_tratamiento !== id)
  }
}
</script>
