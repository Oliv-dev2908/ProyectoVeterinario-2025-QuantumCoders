<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🩺 Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">✏️ Editar Cirugía</h1>
        <p class="text-gray-500 text-sm mt-1">
          Modifica los datos del procedimiento quirúrgico veterinario
        </p>
      </div>

      <!-- 🐶 Tarjeta del formulario -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="actualizarCirugia" class="space-y-6">
          <!-- 🐾 Paciente -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🐾 Paciente</label>
            <select
              v-model="form.id_paciente"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            >
              <option value="" disabled>Seleccione un paciente</option>
              <option
                v-for="p in pacientes"
                :key="p.id_paciente"
                :value="p.id_paciente"
              >
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <!-- 📅 Fecha -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha</label>
            <input
              type="date"
              v-model="form.fecha"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>

          <!-- 🩹 Descripción -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🩹 Descripción</label>
            <textarea
              v-model="form.descripcion"
              rows="4"
              placeholder="Describe brevemente la cirugía realizada..."
              class="w-full border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            ></textarea>
          </div>

          <!-- 💾 Botón actualizar -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
            >
              Actualizar Cirugía
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const form = ref({
  id_paciente: '',
  fecha: new Date().toISOString().substr(0, 10),
  descripcion: ''
})
const pacientes = ref([])

onMounted(async () => {
  pacientes.value = await $fetch('/api/pacientes')
  const data = await $fetch(`/api/cirugias/${route.params.id}`)
  form.value = {
    id_paciente: data.id_paciente,
    fecha: data.fecha,
    descripcion: data.descripcion
  }
})

const actualizarCirugia = async () => {
  if (!form.value.id_paciente || !form.value.descripcion) {
    alert('Por favor complete todos los campos.')
    return
  }
  try {
    await $fetch(`/api/cirugias/${route.params.id}`, { method: 'PUT', body: form.value })
    alert('✅ Cirugía actualizada exitosamente')
    router.push('/cirugias') // 🔹 Redirigir a la lista de cirugías
  } catch (err) {
    console.error('Error actualizando cirugía:', err)
    alert('❌ Error actualizando cirugía: ' + (err.data?.error || err.message))
  }
}
</script>
