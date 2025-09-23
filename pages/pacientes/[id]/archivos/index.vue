<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">
      Archivos del Paciente #{{ pacienteId }} - {{ pacienteNombre }}
    </h1>

    <!-- Lista de archivos -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Archivos Médicos</h2>
      <ul class="divide-y divide-gray-200">
        <li v-for="file in files" :key="file.id" class="flex justify-between items-center py-3">
          <span class="text-gray-800">{{ file.nombre_archivo }}</span>
          <div class="flex gap-2">
            <a :href="file.url_publica" target="_blank"
               class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors">
              Previsualizar
            </a>
            <a :href="file.url_publica" download
               class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">
              Descargar
            </a>
            <button @click="deleteFile(file.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
              Eliminar
            </button>
          </div>
        </li>
      </ul>
      <p v-if="files.length === 0" class="text-gray-400 mt-4 text-center">
        No hay archivos para este paciente.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pacienteId = route.params.id
const pacienteNombre = ref('')
const files = ref([])

async function getPaciente() {
  try {
    const paciente = await $fetch(
      `https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/pacientes/${pacienteId}`
    )
    pacienteNombre.value = paciente.nombre || ''
  } catch (error) {
    console.error('Error al obtener paciente:', error)
    pacienteNombre.value = ''
  }
}

async function listFiles() {
  try {
    files.value = await $fetch(
      `https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/expediente_archivos/paciente/${pacienteId}`
    )
  } catch (error) {
    console.error('Error al cargar archivos:', error)
    files.value = []
  }
}

async function deleteFile(fileId) {
  try {
    const result = await $fetch(
      `https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/expedientes/${fileId}`,
      { method: 'DELETE' }
    )
    alert(result.message || 'Archivo eliminado')
    listFiles()
  } catch (error) {
    alert(error?.message || 'Error al eliminar el archivo')
  }
}

onMounted(() => {
  getPaciente()
  listFiles()
})
</script>
