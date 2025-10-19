<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <!-- Ajuste por sidebar -->
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">🐾 Consultas</h1>
          <p class="text-gray-500 text-sm mt-1">
            Registro y gestión de consultas veterinarias
          </p>
        </div>

        <NuxtLink
          to="/consultas/nuevo"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
        >
          ➕ Nueva Consulta
        </NuxtLink>
      </div>

      <!-- 📋 Lista de consultas -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm">
              <th class="p-3">Paciente</th>
              <th class="p-3">Usuario</th>
              <th class="p-3">Motivo</th>
              <th class="p-3">Fecha</th>
              <th class="p-3">Próxima cita</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in consultas"
              :key="`${c.id_paciente}-${c.fecha}`"
              class="border-t hover:bg-teal-50 transition-all duration-200"
            >
              <td class="p-3 font-medium">{{ c.nombre_paciente }}</td>
              <td class="p-3">{{ c.nombre_usuario }}</td>
              <td class="p-3">{{ c.motivo }}</td>
              <td class="p-3">
                {{ new Date(c.fecha).toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </td>
              <td class="p-3">
                <span v-if="c.fechaproxconsulta">
                  {{ new Date(c.fechaproxconsulta).toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' }) }}
                </span>
                <span v-else>—</span>
              </td>

              <td class="p-3 flex justify-center gap-3">
                <button
                  @click="verDetalles(c)"
                  class="text-green-600 hover:text-green-800 font-medium"
                >
                  👁️ Ver
                </button>
                <NuxtLink
                  :to="`/consultas/${c.id_consulta}`"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ✏️ Editar
                </NuxtLink>
                <button
                  @click="eliminar(c.id_paciente, c.fecha)"
                  class="text-red-500 hover:text-red-700 font-medium"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>

            <tr v-if="consultas.length === 0">
              <td colspan="6" class="p-6 text-center text-gray-500">
                No hay consultas registradas aún 🐶
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 💬 Modal de detalles -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full relative animate-fade-in"
      >
        <button
          @click="modalVisible = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>

        <h2 class="text-2xl font-bold mb-4 text-teal-700">
          🩺 Detalles de la Consulta
        </h2>

        <div class="space-y-1 text-gray-700">
          <p><strong>🐾 Paciente:</strong> {{ detalle.nombre_paciente }}</p>
          <p><strong>👨‍⚕️ Usuario:</strong> {{ detalle.nombre_usuario }}</p>
          <p><strong>📅 Fecha:</strong> {{ new Date(detalle.fecha).toLocaleString() }}</p>
          <p v-if="detalle.fechaproxconsulta">
            <strong>🗓 Próxima cita:</strong>
            {{ new Date(detalle.fechaproxconsulta).toLocaleString() }}
          </p>
          <p><strong>📌 Motivo:</strong> {{ detalle.motivo }}</p>
          <p><strong>⚕️ Signos clínicos:</strong> {{ detalle.signosclinicos }}</p>
          <p><strong>🧩 Curso:</strong> {{ detalle.curso }}</p>
          <p><strong>💉 Diagnóstico:</strong> {{ detalle.diagnosticopresuntivo }}</p>
          <p><strong>📝 Observaciones:</strong> {{ detalle.observaciones }}</p>
          <p><strong>❤️ Condición:</strong> {{ detalle.condicion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const consultas = ref([])
const pacientes = ref([])
const usuarios = ref([])

const modalVisible = ref(false)
const detalle = ref({})

const verDetalles = (consulta) => {
  detalle.value = consulta
  modalVisible.value = true
}

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
  const f = await $fetch("/api/consultas")
  consultas.value = f.map((c) => {
    const paciente = pacientes.value.find((pa) => pa.id_paciente === c.id_paciente)
    const usuario = usuarios.value.find((us) => us.id_usuario === c.id_usuario)
    return {
      ...c,
      nombre_paciente: paciente?.nombre || "Desconocido",
      nombre_usuario: usuario?.nombre || "Desconocido",
    }
  })
})

const eliminar = async (id_paciente, fecha) => {
  if (!confirm("¿Seguro que deseas eliminar esta consulta?")) return
  await $fetch(`/api/consultas/${id_paciente}`, {
    method: "DELETE",
    body: { fecha },
  })
  consultas.value = consultas.value.filter(
    (c) => !(c.id_paciente === id_paciente && c.fecha === fecha)
  )
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
