<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <!-- Ajuste por sidebar -->
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">💆‍♀️ Fisioterapias</h1>
          <p class="text-gray-500 text-sm mt-1">
            Registro y control de sesiones de fisioterapia veterinaria
          </p>
        </div>

        <NuxtLink
          to="/fisioterapias/nuevo"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
        >
          ➕ Nueva Fisioterapia
        </NuxtLink>
      </div>

      <!-- 📋 Tabla de fisioterapias -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm">
              <th class="p-3">Paciente</th>
              <th class="p-3">Usuario</th>
              <th class="p-3">Procedimiento</th>
              <th class="p-3">Fecha</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="f in fisioterapias"
              :key="f.id_fisioterapia"
              class="border-t hover:bg-teal-50 transition-all duration-200"
            >
              <td class="p-3 font-medium">{{ f.nombre_paciente }}</td>
              <td class="p-3">{{ f.nombre_usuario }}</td>
              <td class="p-3">{{ f.procedimiento }}</td>
              <td class="p-3">
                {{ new Date(f.fecha).toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </td>

              <td class="p-3 flex justify-center gap-3">
                <NuxtLink
                  :to="`/fisioterapias/${f.id_fisioterapia}`"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ✏️ Editar
                </NuxtLink>
                <button
                  @click="eliminar(f.id_fisioterapia)"
                  class="text-red-500 hover:text-red-700 font-medium"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>

            <tr v-if="fisioterapias.length === 0">
              <td colspan="5" class="p-6 text-center text-gray-500">
                No hay fisioterapias registradas aún 🐶
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

const fisioterapias = ref([])
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
  const f = await $fetch("/api/fisioterapias")

  fisioterapias.value = f.map((fisio) => {
    const paciente = pacientes.value.find((pa) => pa.id_paciente === fisio.id_paciente)
    const usuario = usuarios.value.find((us) => us.id_usuario === fisio.id_usuario)

    return {
      ...fisio,
      nombre_paciente: paciente ? paciente.nombre : "Desconocido",
      nombre_usuario: usuario ? usuario.nombre : "Desconocido",
    }
  })
})

const eliminar = async (id) => {
  if (confirm("¿Seguro que deseas eliminar esta fisioterapia?")) {
    await $fetch(`/api/fisioterapias/${id}`, { method: "DELETE" })
    fisioterapias.value = fisioterapias.value.filter((f) => f.id_fisioterapia !== id)
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
</style>
