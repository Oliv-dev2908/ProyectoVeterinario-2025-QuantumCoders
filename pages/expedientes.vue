<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <!-- Ajuste por sidebar -->
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800">📁 Gestión de Archivos Médicos</h1>
        <p class="text-gray-500 text-sm mt-1">Sube, descarga y asigna archivos a los pacientes</p>
      </div>

      <!-- Subir archivo -->
      <div class="mb-8 p-4 bg-white shadow-xl rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4">
        <input type="file" ref="fileInput" class="border rounded px-3 py-2 w-full sm:w-auto" />
        <button
          @click="uploadFile"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
        >
          Subir Archivo
        </button>
      </div>

      <!-- Lista de archivos -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 p-4">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Archivos Subidos</h2>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="file in files"
            :key="file.name"
            class="flex flex-col sm:flex-row sm:items-center justify-between py-3 hover:bg-teal-50 transition px-2 rounded"
          >
            <span class="text-gray-800 font-medium mb-2 sm:mb-0">{{ file.name }}</span>

            <div class="flex flex-wrap gap-2 items-center">
              <button
                @click="previewFile(file.name)"
                class="text-yellow-500 hover:text-yellow-700 font-medium"
              >
                ⏩ Previsualizar
              </button>
              <button
                @click="downloadFileDirect(file.name)"
                class="text-green-500 hover:text-green-700 font-medium"
              >
                ⬇️ Descargar
              </button>
              <button
                @click="deleteFile(file.name)"
                class="text-red-500 hover:text-red-700 font-medium"
              >
                🗑️ Eliminar
              </button>
              <select
                v-model="file.selectedPaciente"
                class="border rounded px-2 py-1"
              >
                <option disabled value="">Selecciona mascota</option>
                <option
                  v-for="pac in pacientes"
                  :key="pac.id_paciente"
                  :value="pac.id_paciente"
                >
                  {{ pac.nombre }}
                </option>
              </select>
              <button
                @click="assignFileToPaciente(file)"
                class="text-blue-500 hover:text-blue-700 font-medium"
              >
                ➕ Asignar
              </button>
            </div>
          </li>
        </ul>
        <p v-if="files.length === 0" class="text-gray-400 mt-4 text-center">
          No hay archivos subidos aún.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const files = ref([])
const pacientes = ref([])
const fileInput = ref(null)

async function listFiles() {
  const storedFiles = await $fetch('/api/expedientes')
  files.value = storedFiles.map(f => ({ ...f, selectedPaciente: '' }))
}

async function listPacientes() {
  pacientes.value = await $fetch('/api/pacientes')
}

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

async function assignFileToPaciente(file) {
  if (!file.selectedPaciente) return alert('Selecciona una mascota')

  try {
    const body = {
      paciente_id: file.selectedPaciente,
      nombre_archivo: file.name,
      url_publica: file.url_publica || '',
      tipo_archivo: file.type || ''
    }
    await $fetch('/api/expedientes/asignar', { method: 'POST', body })
    alert('Archivo asignado a la mascota con éxito')
    listFiles()
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
