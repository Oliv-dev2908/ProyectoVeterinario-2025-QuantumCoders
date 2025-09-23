<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">Gestión de Archivos Médicos</h1>

    <!-- Subir archivo -->
    <div class="mb-8 p-4 bg-white shadow rounded-lg flex flex-col sm:flex-row sm:items-center gap-4">
      <input type="file" ref="fileInput" class="border rounded px-3 py-2 w-full sm:w-auto" />
      <button @click="uploadFile" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Subir Archivo
      </button>
    </div>

    <!-- Lista de archivos -->
    <div class="bg-white shadow rounded-lg p-4">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Archivos Subidos</h2>
      <ul class="divide-y divide-gray-200">
        <li v-for="file in files" :key="file.name" class="flex justify-between items-center py-2">
          <span class="text-gray-800">{{ file.name }}</span>

          <div class="flex gap-2">
            <!-- Previsualizar y descargar igual -->
            <button @click="previewFile(file.name)" class="bg-yellow-500 ...">Previsualizar</button>
            <button @click="downloadFileDirect(file.name)" class="bg-green-500 ...">Descargar</button>
            <button @click="deleteFile(file.name)" class="bg-red-500 ...">Eliminar</button>

            <!-- NUEVO: Asignar a mascota -->
            <select v-model="file.selectedPaciente" class="border rounded px-2 py-1">
              <option disabled value="">Selecciona mascota</option>
              <option v-for="pac in pacientes" :key="pac.id_paciente" :value="pac.id_paciente">{{ pac.nombre }}</option>
            </select>
            <button @click="assignFileToPaciente(file)"
              class="bg-blue-500 text-white px-3 py-1 rounded">Asignar</button>
          </div>
        </li>
      </ul>
      <p v-if="files.length === 0" class="text-gray-400 mt-4 text-center">No hay archivos subidos aún.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const files = ref([])
const pacientes = ref([])
const fileInput = ref(null)

// Cargar archivos desde Supabase
async function listFiles() {
  const storedFiles = await $fetch('/api/expedientes')
  // Agregamos un campo para guardar la selección de mascota
  files.value = storedFiles.map(f => ({ ...f, selectedPaciente: '' }))
}

// Cargar lista de mascotas
async function listPacientes() {
  pacientes.value = await $fetch('/api/pacientes') // si quieres también puedes hacer proxy
}

// Subir archivo a Supabase
async function uploadFile() {
  if (!fileInput.value.files.length) return alert('Selecciona un archivo')
  const file = fileInput.value.files[0]

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

  try {
    const result = await $fetch('/api/expedientes/upload', { method: 'POST', body: formData })
    alert(result.message)
    listFiles()
  } catch (error) {
    alert(error?.message || 'Error al subir el archivo')
  }
}

// Asignar archivo a una mascota usando la API de expedientes
async function assignFileToPaciente(file) {
  if (!file.selectedPaciente) return alert('Selecciona una mascota')

  try {
    const body = {
      paciente_id: file.selectedPaciente,
      nombre_archivo: file.name,
      url_publica: file.url_publica || '', // asegúrate de tener la url pública desde Supabase
      tipo_archivo: file.type || ''
    }

    const result = await $fetch('/api/expedientes/asignar', { method: 'POST', body })

    alert('Archivo asignado a la mascota con éxito')
    listFiles() // refresca la lista si quieres
  } catch (error) {
    alert(error?.message || 'Error al asignar el archivo')
  }
}

async function previewFile(filename) {
  const encodedFilename = encodeURIComponent(filename)
  const { url, message } = await $fetch(`/api/expedientes/${encodedFilename}`)
  if (!url) return alert(message || 'Error al generar la URL de previsualización')
  window.open(`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`, '_blank')
}

async function downloadFileDirect(filename) {
  const encodedFilename = encodeURIComponent(filename)
  const { url, message } = await $fetch(`/api/expedientes/${encodedFilename}`)
  if (!url) return alert(message || 'Error al generar la URL de descarga')
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function deleteFile(filename) {
  const encodedFilename = encodeURIComponent(filename)
  const result = await $fetch(`/api/expedientes/${encodedFilename}`, { method: 'DELETE' })
  if (result.message) alert(result.message)
  listFiles()
}

onMounted(() => {
  listFiles()
  listPacientes()
})
</script>
