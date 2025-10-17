<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🩺 Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">➕ Nueva Cirugía</h1>
        <p class="text-gray-500 text-sm mt-1">
          Registra un nuevo procedimiento quirúrgico veterinario
        </p>
      </div>

      <!-- 🐶 Tarjeta del formulario -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarCirugia" class="space-y-6">
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

          <!-- 💾 Botón guardar -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
            >
              Guardar Cirugía
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  id_paciente: '',
  id_usuario: 0,
  fecha: new Date().toISOString().substr(0, 10),
  descripcion: ''
})

const pacientes = ref([])
const user = useSupabaseUser()

onMounted(async () => {
  try {
    pacientes.value = await $fetch('/api/pacientes')
    if (user.value?.id) {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.value.id_usuario = usuarioData.id_usuario
    } else {
      alert('Usuario no logueado')
    }
  } catch (err) {
    console.error('Error obteniendo datos:', err)
    alert('No se pudieron cargar los datos.')
  }
})

watch(
  () => user.value,
  (u) => {
    if (u?.id_usuario) form.value.id_usuario = u.id_usuario
  },
  { immediate: true }
)

const guardarCirugia = async () => {
  if (!form.value.id_paciente || !form.value.descripcion) {
    alert('Por favor complete todos los campos.')
    return
  }

  try {
    await $fetch('/api/cirugias', { method: 'POST', body: form.value })
    alert('✅ Cirugía registrada exitosamente')
    router.push('/cirugias') // 🔹 Redirigir a la página de cirugías
  } catch (err) {
    console.error('Error guardando cirugía:', err)
    alert('❌ Error guardando cirugía: ' + (err.data?.error || err.message))
  }
}
</script>
