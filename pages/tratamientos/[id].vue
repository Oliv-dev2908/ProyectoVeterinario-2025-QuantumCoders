<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar fijo en esquina superior izquierda -->
    <button
      @click="router.push('/tratamientos')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver a Tratamientos
    </button>

    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🩺 Encabezado centrado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">✏️ Editar Tratamiento</h1>
        <p class="text-gray-500 text-sm mt-1">
          Modifica los datos del tratamiento del paciente
        </p>
      </div>

      <!-- 🐶 Tarjeta del formulario -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="actualizarTratamiento" class="space-y-6">
          <!-- 🐾 Paciente -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🐾 Paciente</label>
            <select
              v-model="form.id_paciente"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            >
              <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <!-- 👤 Usuario (solo lectura) -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">👤 Usuario</label>
            <input
              type="text"
              :value="usuarioNombre"
              disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <!-- 📅 Fechas -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha Inicio</label>
            <input
              type="date"
              v-model="form.fecha_inicio"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha Fin</label>
            <input
              type="date"
              v-model="form.fecha_fin"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>

          <!-- 🩹 Descripción -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🩹 Descripción</label>
            <textarea
              v-model="form.descripcion"
              rows="4"
              placeholder="Describe brevemente el tratamiento..."
              class="w-full border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            ></textarea>
          </div>

          <!-- 💾 Botón actualizar -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
            >
              Actualizar Tratamiento
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const form = reactive({
  id_paciente: "",
  id_usuario: "",
  fecha_inicio: "",
  fecha_fin: "",
  descripcion: ""
})

const pacientes = ref([])
const usuarioNombre = ref("")

onMounted(async () => {
  pacientes.value = await $fetch("/api/pacientes")

  const data = await $fetch(`/api/tratamientos/${route.params.id}`)
  Object.assign(form, data)

  // obtener usuario para mostrar el nombre
  const usuarioData = await $fetch(`/api/user/${form.id_usuario}`)
  usuarioNombre.value = usuarioData.nombre
})

const actualizarTratamiento = async () => {
  try {
    await $fetch(`/api/tratamientos/${route.params.id}`, { method: "PUT", body: form })
    alert("✅ Tratamiento actualizado!")
    router.push("/tratamientos")
  } catch (err) {
    console.error("Error actualizando tratamiento:", err)
    alert("❌ Error: " + (err.data?.error || err.message))
  }
}
</script>
