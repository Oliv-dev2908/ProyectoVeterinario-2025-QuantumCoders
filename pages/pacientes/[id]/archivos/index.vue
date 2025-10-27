<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-3xl p-8 ml-65">
      <!-- 🔙 Botón de regresar -->
      <div class="mb-6 text-left">
        <NuxtLink
          to="/pacientes"
          class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span class="text-2xl">←</span>
          <span class="font-semibold">Regresar</span>
        </NuxtLink>
      </div>

      <!-- 🧾 Contenedor principal -->
      <div class="bg-white shadow-lg rounded-2xl p-8">
        <h1 class="text-3xl font-bold mb-8 text-center text-blue-700">
          Archivos del Paciente #{{ pacienteId }} - {{ pacienteNombre }}
        </h1>

        <!-- 📂 Lista de archivos -->
        <div>
          <h2 class="text-xl font-semibold mb-4 text-gray-700">Archivos Médicos</h2>
          <ul v-if="files.length > 0" class="divide-y divide-gray-200">
            <li
              v-for="file in files"
              :key="file.id"
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-3"
            >
              <span class="text-gray-800 font-medium">{{ file.nombre_archivo }}</span>
              <div class="flex flex-wrap gap-2">
                <a
                  :href="file.url_publica"
                  download
                  class="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition"
                >
                  Previsualizar
                </a>
                <a
                  :href="file.url_publica"
                  @click.prevent="descargarArchivo(file.url_publica)"
                  class="bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition"
                >
                  Descargar
                </a>
                <button
                  @click="deleteFile(file.id)"
                  class="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </li>
          </ul>

          <p v-else class="text-gray-400 mt-4 text-center">
            No hay archivos registrados para este paciente.
          </p>
        </div>
      </div>
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
function descargarArchivo(url) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const enlace = document.createElement('a');
      enlace.href = URL.createObjectURL(blob);
      enlace.download = url.split('/').pop();
      enlace.click();
      URL.revokeObjectURL(enlace.href);
    });
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
  const confirmDelete = confirm('¿Seguro que deseas eliminar este archivo?')
  if (!confirmDelete) return

  try {
    const result = await $fetch(
      `https://proyectoveterinario-2025-quantumcoders.onrender.com/api/v1/expedientes/${fileId}`,
      { method: 'DELETE' }
    )
    alert(result.message || 'Archivo eliminado correctamente')
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
