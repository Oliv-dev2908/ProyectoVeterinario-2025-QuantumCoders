<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative"
  >
    <!-- 🔙 Botón regresar -->
    <button
      @click="router.push('/tratamientos')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver a Tratamientos
    </button>

    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🩺 Encabezado -->
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

          <!-- 👤 Usuario -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">👤 Usuario</label>
            <input
              type="text"
              :value="usuarioNombre"
              disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <!-- 🧩 Tipo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🧩 Tipo de tratamiento</label>
            <select
              v-model="form.tipo"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            >
              <option value="" disabled>Seleccione el tipo de tratamiento</option>
              <option value="Vacunación">Vacunación</option>
              <option value="Desparasitación">Desparasitación</option>
              <option value="Limpieza dental">Limpieza dental</option>
              <option value="Revisión general">Revisión general</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <!-- 📅 Fecha inicio -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha Inicio</label>
            <input
              type="date"
              v-model="form.fecha_inicio"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>

          <!-- 💰 Costo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">💰 Costo (Bs)</label>
            <input
              v-model="form.costo"
              type="number"
              step="0.01"
              placeholder="Ej: 80.00"
              min="10"
              max="1500"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
            <p class="text-sm text-gray-500 mt-1">
              Monto entre 10.00 y 1500.00 Bs (máx. 2 decimales)
            </p>
          </div>

          <!-- ⚙️ Estado -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">⚙️ Estado</label>
            <select
              v-model="form.estado"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            >
              <option value="" disabled>Seleccione el estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          <!-- 🚨 Gravedad -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🚨 Gravedad</label>
            <select
              v-model="form.gravedad"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            >
              <option value="" disabled>Seleccione la gravedad</option>
              <option value="leve">Leve</option>
              <option value="moderada">Moderada</option>
              <option value="grave">Grave</option>
            </select>
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

    <!-- ⚠️ ModalError -->
    <ModalError
      :visible="modalVisible"
      :title="modalTitle"
      :message="modalMessage"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useSupabaseUser } from "#imports"
import ModalError from "@/components/modalError.vue";

const router = useRouter()
const user = useSupabaseUser()

// 🧾 Estado del formulario
const form = reactive({
  id_paciente: "",
  id_usuario: 0,
  tipo: "",
  descripcion: "",
  fecha_inicio: new Date().toISOString().substr(0, 10),
  costo: "",
  estado: "",
  gravedad: ""
})

const pacientes = ref([])
const usuarioNombre = ref("")

// 🧩 ModalError
const modalVisible = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === "✅ Éxito") {
    router.push("/tratamientos")
  }
}

onMounted(async () => {
  pacientes.value = await $fetch("/api/pacientes")
  if (user.value?.id) {
    const usuarioData = await $fetch(`/api/user/${user.value.id}`)
    form.id_usuario = usuarioData.id_usuario
    usuarioNombre.value = usuarioData.nombre
  }
})

// 🔍 Validar descripción
const validarDescripcion = (texto) => {
  const ofensivas = ["tonto", "idiota", "imbecil", "maldito"]
  const sqlMaliciosas = /(drop\s|delete\s|insert\s|update\s|select\s|\<script|\<\/script)/i
  if (sqlMaliciosas.test(texto)) return "No se permiten posibles inyecciones SQL o scripts."
  if (ofensivas.some((palabra) => texto.toLowerCase().includes(palabra)))
    return "Evita usar palabras ofensivas."
  if (/(.)\1{4,}/.test(texto)) return "El texto contiene repeticiones sospechosas."
  if (texto.length < 10) return "La descripción debe tener al menos 10 caracteres."
  if (texto.length > 500) return "La descripción no puede superar los 500 caracteres."
  return null
}

// 💾 Guardar tratamiento
const guardarTratamiento = async () => {
  const hoy = new Date()
  const fechaInicio = new Date(form.fecha_inicio)
  const limite = new Date()
  limite.setDate(hoy.getDate() + 20)

  if (!form.id_paciente) return mostrarError("Debe seleccionar un paciente.")
  if (!form.tipo) return mostrarError("Debe seleccionar un tipo de tratamiento.")
  if (fechaInicio < hoy.setHours(0, 0, 0, 0))
    return mostrarError("La fecha de inicio no puede ser anterior a hoy.")
  if (fechaInicio > limite)
    return mostrarError("La fecha de inicio no puede ser superior a 20 días desde hoy.")

  if (!form.costo || isNaN(form.costo))
    return mostrarError("Debe ingresar un costo válido.")
  if (form.costo < 10 || form.costo > 1500)
    return mostrarError("El costo debe estar entre 10.00 y 1500.00 Bs.")
  if (!/^\d+(\.\d{1,2})?$/.test(form.costo))
    return mostrarError("El costo debe tener como máximo 2 decimales.")

  if (!form.estado) return mostrarError("Debe seleccionar un estado.")
  if (!form.gravedad) return mostrarError("Debe seleccionar una gravedad.")

  const errorDesc = validarDescripcion(form.descripcion)
  if (errorDesc) return mostrarError(errorDesc)

  try {
    await $fetch("/api/tratamientos", { method: "POST", body: form })
    modalTitle.value = "✅ Éxito"
    modalMessage.value = "Tratamiento guardado correctamente."
    modalVisible.value = true
  } catch {
    mostrarError("No se pudo guardar el tratamiento.")
  }
}

function mostrarError(msg) {
  modalTitle.value = "⚠️ Error"
  modalMessage.value = msg
  modalVisible.value = true
}
</script>
