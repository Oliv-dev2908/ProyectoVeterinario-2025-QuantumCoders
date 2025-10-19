<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button
      @click="router.push('/fisioterapias')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver a Fisioterapias
    </button>

    <!-- Tarjeta central -->
    <div class="w-full max-w-3xl p-8 ml-65">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">🧘‍♂️ Nueva Fisioterapia</h1>
        <p class="text-gray-500 text-sm mt-1">Registra una nueva sesión de fisioterapia</p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarFisioterapia" class="space-y-6">
          <!-- Paciente -->
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

          <!-- Usuario -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Usuario</label>
            <input type="text" :value="usuarioNombre" disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
          </div>
          
          <!-- Fecha -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Fecha</label>
            <input type="date" v-model="form.fecha"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Procedimiento -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Procedimiento</label>
            <textarea v-model="form.procedimiento" placeholder="Describe el procedimiento"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Botón guardar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Guardar Fisioterapia
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue"
import { useSupabaseUser, useRouter } from "#imports"

const router = useRouter()
const form = reactive({
  id_paciente: "",
  id_usuario: 0,
  fecha: new Date().toISOString().substr(0, 10),
  procedimiento: ""
})

const pacientes = ref([])
const usuarioNombre = ref("")
const user = useSupabaseUser()

onMounted(async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")

    if (user.value?.id) {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.id_usuario = usuarioData.id_usuario
      usuarioNombre.value = usuarioData.nombre
    } else {
      alert("Usuario no logueado")
    }
  } catch (err) {
    console.error("Error cargando datos:", err)
    alert("No se pudieron cargar los datos del formulario")
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

const guardarFisioterapia = async () => {
  if (!form.id_paciente || !form.id_usuario || !form.procedimiento) {
    alert("Por favor completa todos los campos obligatorios")
    return
  }

  try {
    await $fetch("/api/fisioterapias", { method: "POST", body: form })
    alert("✅ Fisioterapia guardada correctamente")
    router.push("/fisioterapias")
  } catch (err) {
    console.error("Error guardando fisioterapia:", err)
    alert("Error al guardar: " + (err.data?.error || err.message))
  }
}
</script>
