<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative"
  >
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
            <select
              v-model="form.id_paciente"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            >
              <option value="" disabled>Seleccione un paciente</option>
              <option
                v-for="p in pacientes"
                :key="p.id_paciente"
                :value="p.id_paciente"
              >
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <!-- Usuario -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Usuario</label>
            <input
              type="text"
              :value="usuarioNombre"
              disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <!-- Fecha -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Fecha</label>
            <input
              type="date"
              v-model="form.fecha"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>

          <!-- Procedimiento -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Procedimiento</label>
            <textarea
              v-model="form.procedimiento"
              placeholder="Describe el procedimiento"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            ></textarea>
          </div>

          <!-- Botón guardar -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
            >
              Guardar Fisioterapia
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 🧩 Modal de errores -->
    <ModalError
      :visible="modalVisible"
      :title="modalTitle"
      :message="modalMessage"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue"
import { useSupabaseUser, useRouter } from "#imports"
import ModalError from "@/components/modalError.vue"


const router = useRouter()
const user = useSupabaseUser()

// 🧠 Formulario reactivo
const form = reactive({
  id_paciente: "",
  id_usuario: 0,
  fecha: new Date().toISOString().substr(0, 10),
  procedimiento: ""
})

// 📋 Datos
const pacientes = ref([])
const usuarioNombre = ref("")

// 💬 Modal de errores
const modalVisible = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")

const handleModalClose = () => {
  modalVisible.value = false
  // Redirigir solo si fue éxito
  if (modalTitle.value === "✅ Éxito") {
    router.push("/fisioterapias")
  }
}

// 🚀 Cargar datos iniciales
onMounted(async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")

    if (user.value?.id) {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.id_usuario = usuarioData.id_usuario
      usuarioNombre.value = usuarioData.nombre
    } else {
      mostrarModal("⚠️ Error", "Usuario no logueado")
    }
  } catch (err) {
    console.error("Error cargando datos:", err)
    mostrarModal("❌ Error", "No se pudieron cargar los datos del formulario.")
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

// 🧩 Función para mostrar modal
const mostrarModal = (titulo, mensaje) => {
  modalTitle.value = titulo
  modalMessage.value = mensaje
  modalVisible.value = true
}

// 🔍 Validaciones del formulario
const validarFormulario = () => {
  // Paciente
  if (!form.id_paciente) return mostrarModal("⚠️ Atención", "Debe seleccionar un paciente.")

  // Fecha
  const hoy = new Date()
  const fechaSeleccionada = new Date(form.fecha)
  const diferenciaDias = (fechaSeleccionada - hoy) / (1000 * 60 * 60 * 24)

  if (fechaSeleccionada < new Date(hoy.toISOString().substr(0, 10))) {
    return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser anterior a hoy.")
  }

  if (diferenciaDias > 20) {
    return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser más de 20 días en el futuro.")
  }

  // Procedimiento
  const texto = form.procedimiento.trim()
  if (!texto) return mostrarModal("⚠️ Atención", "Debe ingresar una descripción del procedimiento.")

  // Palabras ofensivas o sospechosas
  const ofensivas = /(tonto|idiota|mierda|puto|puta|imbecil|estúpido|maldito)/i
  const sqlInyecciones = /(drop\s|delete\s|insert\s|update\s|select\s|--|;|\/\*|\*\/)/i
  const repeticiones = /(.)\1{4,}/

  if (ofensivas.test(texto))
    return mostrarModal("🚫 Contenido inapropiado", "El texto contiene palabras ofensivas.")
  if (sqlInyecciones.test(texto))
    return mostrarModal("🚫 Seguridad", "El texto contiene posibles inyecciones SQL.")
  if (repeticiones.test(texto))
    return mostrarModal("🚫 Texto inválido", "El texto tiene caracteres repetitivos en exceso.")

  return true
}

// 💾 Guardar fisioterapia
const guardarFisioterapia = async () => {
  if (!validarFormulario()) return

  try {
    await $fetch("/api/fisioterapias", { method: "POST", body: form })
    mostrarModal("✅ Éxito", "Fisioterapia guardada correctamente.")
  } catch (err) {
    console.error("Error guardando fisioterapia:", err)
    mostrarModal("❌ Error", "Ocurrió un error al guardar la fisioterapia.")
  }
}
</script>
