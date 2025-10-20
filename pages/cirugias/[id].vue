<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🔙 Botón regresar fijo en esquina superior izquierda -->
      <button @click="router.push('/cirugias')"
        class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50">
        ← Volver a Cirugías
      </button>
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

          <!-- 💾 Botón actualizar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Actualizar Cirugía
            </button>
          </div>
        </form>

        <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModalError from '../../components/modalError.vue'

const route = useRoute()
const router = useRouter()

const modalVisible = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')

const showModal = (message, title = 'Aviso') => {
  modalMessage.value = message
  modalTitle.value = title
  modalVisible.value = true
}

const handleModalClose = () => {
  modalVisible.value = false
  // Solo redirigir si fue éxito
  if (modalTitle.value === '✅ Éxito') {
    router.push('/cirugias')
  }
}

const form = ref({
  id_paciente: '',
  fecha: new Date().toISOString().substr(0, 10),
  descripcion: ''
})

const pacientes = ref([])

onMounted(async () => {
  try {
    pacientes.value = await $fetch('/api/pacientes')
    const data = await $fetch(`/api/cirugias/${route.params.id}`)
    form.value = {
      id_paciente: data.id_paciente,
      fecha: data.fecha,
      descripcion: data.descripcion
    }
  } catch (err) {
    console.error('Error cargando datos:', err)
    showModal('No se pudieron cargar los datos.')
  }
})

const actualizarCirugia = async () => {
  // Validación paciente
  if (!form.value.id_paciente) {
    showModal('Seleccione un paciente.', '❌ Error')
    return
  }

  // Validación fecha
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaSeleccionada = new Date(form.value.fecha)
  fechaSeleccionada.setHours(0, 0, 0, 0)
  const veinteDiasDespues = new Date(hoy)
  veinteDiasDespues.setDate(veinteDiasDespues.getDate() + 20)

  if (fechaSeleccionada < hoy) {
    showModal('❌ La fecha no puede ser anterior a hoy.')
    return
  }
  if (fechaSeleccionada > veinteDiasDespues) {
    showModal('❌ La cirugía no puede programarse más de 20 días en el futuro.')
    return
  }

  // Validación descripción
  const descripcion = form.value.descripcion.trim()
  if (descripcion.length < 10) {
    showModal('❌ La descripción es demasiado corta.')
    return
  }
  if (descripcion.length > 200) {
    showModal('❌ La descripción es demasiado larga.')
    return
  }

  const patronesRaros = [/aaaa/i, /xdxd/i, /f{2,}/i, /[^\w\s.,]/]
  if (patronesRaros.some((patron) => patron.test(descripcion))) {
    showModal('❌ La descripción contiene caracteres o secuencias inválidas.')
    return
  }

  const sqlInjection = [/;/, /--/, /DROP/i, /DELETE/i, /INSERT/i, /UPDATE/i]
  if (sqlInjection.some((patron) => patron.test(descripcion))) {
    showModal('❌ La descripción contiene palabras reservadas o código no permitido.')
    return
  }

  const malasPalabras = ['puta', 'mierda', 'tonto']
  if (malasPalabras.some((palabra) => descripcion.toLowerCase().includes(palabra))) {
    showModal('❌ La descripción contiene palabras inapropiadas.')
    return
  }

  // Guardar cambios
  try {
    await $fetch(`/api/cirugias/${route.params.id}`, {
      method: 'PUT',
      body: form.value
    })
    showModal('Cirugía actualizada exitosamente.', '✅ Éxito')
  } catch (err) {
    console.error('Error actualizando cirugía:', err)
    showModal('❌ Error actualizando cirugía: ' + (err.data?.error || err.message))
  }
}
</script>
