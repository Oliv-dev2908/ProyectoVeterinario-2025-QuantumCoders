<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <!-- Ajuste por sidebar -->
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">🩺 Cirugías</h1>
          <p class="text-gray-500 text-sm mt-1">Gestión de procedimientos quirúrgicos veterinarios</p>
        </div>

        <router-link
          to="/cirugias/nuevo"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
        >
          ➕ Nueva Cirugía
        </router-link>
      </div>

      <!-- 🧾 Tabla -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm">
              <th class="p-3">ID</th>
              <th class="p-3">Paciente</th>
              <th class="p-3">Usuario</th>
              <th class="p-3">Fecha</th>
              <th class="p-3">Descripción</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in cirugias"
              :key="c.id_cirugia"
              class="border-t hover:bg-teal-50 transition"
            >
              <td class="p-3 font-medium">{{ c.id_cirugia }}</td>
              <td class="p-3">{{ pacientesMap[c.id_paciente] || c.id_paciente }}</td>
              <td class="p-3">{{ usuariosMap[c.id_usuario] || c.id_usuario }}</td>
              <td class="p-3">{{ formatFecha(c.fecha) }}</td>
              <td class="p-3">{{ c.descripcion }}</td>
              <td class="p-3 flex justify-center gap-3">
                <router-link
                  :to="`/cirugias/${c.id_cirugia}`"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ✏️ Editar
                </router-link>
                <button
                  @click="eliminarCirugia(c.id_cirugia)"
                  class="text-red-500 hover:text-red-700 font-medium"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="cirugias.length === 0">
              <td colspan="6" class="p-6 text-center text-gray-500">
                No hay cirugías registradas aún 🐶
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cirugias = ref([])
const pacientes = ref([])
const usuarios = ref([])
const pacientesMap = ref({})
const usuariosMap = ref({})

// 📅 Formatear fecha
const formatFecha = (fecha) => {
  if (!fecha) return '—'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' })
}

// 🔄 Cargar cirugías, pacientes y usuarios
onMounted(async () => {
  try {
    // Traer pacientes y crear mapa
    pacientes.value = await $fetch('/api/pacientes')
    pacientesMap.value = pacientes.value.reduce((acc, p) => {
      acc[p.id_paciente] = p.nombre
      return acc
    }, {})

    // Traer usuarios y crear mapa
    usuarios.value = await $fetch('/api/user')
    usuariosMap.value = usuarios.value.reduce((acc, u) => {
      acc[u.id_usuario] = u.nombre || u.email // muestra nombre si existe, sino email
      return acc
    }, {})

    // Traer cirugías
    cirugias.value = await $fetch('/api/cirugias')
  } catch (err) {
    console.error('Error cargando datos:', err)
    alert('No se pudieron cargar las cirugías, pacientes o usuarios.')
  }
})

// ❌ Eliminar cirugía
const eliminarCirugia = async (id) => {
  if (!confirm('¿Desea eliminar esta cirugía?')) return
  await $fetch(`/api/cirugias/${id}`, { method: 'DELETE' })
  cirugias.value = cirugias.value.filter(c => c.id_cirugia !== id)
}
</script>
