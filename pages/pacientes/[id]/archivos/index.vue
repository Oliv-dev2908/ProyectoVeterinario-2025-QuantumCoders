<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">
      Archivos del Paciente #{{ pacienteId }}
    </h1>

    <!-- Subir archivo -->
    <div class="mb-8 p-4 bg-white shadow rounded-lg flex flex-col sm:flex-row sm:items-center gap-4">
      <input type="file" ref="fileInput" class="border rounded px-3 py-2 w-full sm:w-auto" />
      <button @click="uploadFile"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Subir Archivo
      </button>
    </div>

    <!-- Lista de archivos -->
    <div class="bg-white shadow rounded-lg p-4">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Archivos Subidos</h2>
      <ul class="divide-y divide-gray-200">
        <li v-for="file in files" :key="file.id" class="flex justify-between items-center py-2">
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
      <p v-if="files.length === 0" class="text-gray-400 mt-4 text-center">No hay archivos subidos aún.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pacienteId = route.params.id
const fileInput = ref(null)
const files = ref([])

async function listFiles() {
  files.value = await $fetch(`/api/expedientes/${pacienteId}`)
}

async function uploadFile() {
  if (!fileInput.value.files.length) return alert('Selecciona un archivo')
  const file = fileInput.value.files[0]

  // Validaciones
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
  if (!allowedTypes.includes(file.type)) return alert('Tipo de archivo no permitido.')

  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) return alert('Archivo demasiado grande. Máx 50 MB.')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('paciente_id', pacienteId)

  try {
    const result = await $fetch('/api/expedientes/upload', {
      method: 'POST',
      body: formData
    })
    alert(result.message)
    listFiles()
  } catch (error) {
    alert(error?.message || 'Error al subir el archivo')
  }
}

async function deleteFile(fileId) {
  const result = await $fetch(`/api/expedientes/${pacienteId}/${fileId}`, { method: 'DELETE' })
  if (result.message) alert(result.message)
  listFiles()
}

onMounted(listFiles)
</script>
