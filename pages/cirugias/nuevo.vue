<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar fijo en esquina superior izquierda -->
    <button @click="router.push('/cirugias')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50">
      ← Volver a Cirugías
    </button>

    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🩺 Encabezado centrado -->
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
            <select v-model="form.id_paciente"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="" disabled>Seleccione un paciente</option>
              <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <!-- 📅 Fecha -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha</label>
            <input type="date" v-model="form.fecha"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- 🩹 Descripción -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🩹 Descripción</label>
            <textarea v-model="form.descripcion" rows="4" placeholder="Describe brevemente la cirugía realizada..."
              class="w-full border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- 💾 Botón guardar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Guardar Cirugía
            </button>
          </div>
        </form>

        <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />

      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'
import ModalError from '../../components/modalError.vue'

// ✅ Variables del modal
const modalVisible = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

const showModal = (message, title = 'Aviso') => {
  modalMessage.value = message
  modalTitle.value = title
  modalVisible.value = true
}

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
      showModal('Usuario no logueado', '❌ Error')
    }
  } catch (err) {
    console.error('Error obteniendo datos:', err)
    showModal('No se pudieron cargar los datos.', '❌ Error')
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
  // Validación paciente
  if (!form.value.id_paciente) {
    showModal('Seleccione un paciente.', '❌ Error')
    return
  }

  // Validación de fecha
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaSeleccionada = new Date(form.value.fecha)
  fechaSeleccionada.setHours(0, 0, 0, 0)
  const veinteDiasDespues = new Date(hoy)
  veinteDiasDespues.setDate(veinteDiasDespues.getDate() + 20)

  if (fechaSeleccionada <= hoy) {
    showModal('La fecha no puede ser anterior a hoy.', '❌ Error')
    return
  }
  if (fechaSeleccionada > veinteDiasDespues) {
    showModal('La cirugía no puede programarse más de 20 días en el futuro.', '❌ Error')
    return
  }

  // Validación descripción
  const descripcion = form.value.descripcion.trim()
  if (descripcion.length < 10) {
    showModal('La descripción es demasiado corta.', '❌ Error')
    return
  }
  if (descripcion.length > 200) {
    showModal('La descripción es demasiado larga.', '❌ Error')
    return
  }

  const patronesRaros = [/aaaa/i, /xdxd/i, /f{2,}/i, /[^\w\s.,]/]
  if (patronesRaros.some((patron) => patron.test(descripcion))) {
    showModal('La descripción contiene caracteres o secuencias inválidas.', '❌ Error')
    return
  }

  const sqlInjection = [/;/, /--/, /DROP/i, /DELETE/i, /INSERT/i, /UPDATE/i]
  if (sqlInjection.some((patron) => patron.test(descripcion))) {
    showModal('La descripción contiene palabras reservadas o código no permitido.', '❌ Error')
    return
  }

  const malasPalabras = ['puta', 'mierda', 'tonto']
  if (malasPalabras.some((palabra) => descripcion.toLowerCase().includes(palabra))) {
    showModal('La descripción contiene palabras inapropiadas.', '❌ Error')
    return
  }

  // Guardar cirugía
  try {
    await $fetch('/api/cirugias', { method: 'POST', body: form.value })
    showModal('Cirugía registrada exitosamente.', '✅ Éxito')
  } catch (err) {
    console.error('Error guardando cirugía:', err)
    showModal('Error guardando cirugía: ' + (err.data?.error || err.message), '❌ Error')
  }
}

// Función para manejar el cierre del modal
const handleModalClose = () => {
  modalVisible.value = false
  // Redirigir solo si fue un éxito
  if (modalTitle.value === '✅ Éxito') {
    router.push('/cirugias')
  }
}
</script>
