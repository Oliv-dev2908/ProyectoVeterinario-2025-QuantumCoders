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
        <h1 class="text-3xl font-bold text-gray-800">➕ Nuevo Tratamiento</h1>
        <p class="text-gray-500 text-sm mt-1">
          Registra un nuevo tratamiento para un paciente
        </p>
      </div>

      <!-- 🐶 Tarjeta del formulario -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarTratamiento" class="space-y-6">
          <!-- 🐾 Paciente -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🐾 Paciente</label>
            <select
              v-model="form.id_paciente"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            >
              <option value="" disabled>Seleccione un paciente</option>
              <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <!-- 👤 Usuario (solo mostrar) -->
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

          <!-- 💾 Botón guardar -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
            >
              Guardar Tratamiento
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue"
import { useSupabaseUser } from "#imports"
import { useRouter } from "vue-router"

const router = useRouter()
const form = reactive({
  id_paciente: "",
  id_usuario: 0,
  fecha_inicio: new Date().toISOString().substr(0, 10),
  fecha_fin: "",
  descripcion: ""
})

const pacientes = ref([])
const usuarioNombre = ref("")
const user = useSupabaseUser()

onMounted(async () => {
  pacientes.value = await $fetch("/api/pacientes")

  if (user.value?.id) {
    try {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.id_usuario = usuarioData.id_usuario
      usuarioNombre.value = usuarioData.nombre
    } catch (err) {
      console.error("Error obteniendo usuario:", err)
      alert("No se pudo obtener el usuario logueado")
    }
  } else {
    alert("Usuario no logueado")
  }
})

watch(
  () => user.value,
  async (u) => {
    if (u?.id) {
      const usuarioData = await $fetch(`/api/user/${u.id}`)
      form.id_usuario = usuarioData.id_usuario
      usuarioNombre.value = usuarioData.nombre
    }
  },
  { immediate: true }
)

const guardarTratamiento = async () => {
  if (!form.id_usuario || !form.id_paciente || !form.descripcion) {
    alert("Faltan datos para crear el tratamiento")
    return
  }

  try {
    await $fetch("/api/tratamientos", { method: "POST", body: form })
    alert("Tratamiento guardado!")
    router.push("/tratamientos")
  } catch (err) {
    console.error("Error guardando tratamiento:", err)
    alert("Error: " + (err.data?.error || err.message))
  }
}
</script>
