<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
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
        <h1 class="text-3xl font-bold text-gray-800">✏️ Editar Tratamiento</h1>
        <p class="text-gray-500 text-sm mt-1">
          Modifica los datos del tratamiento
        </p>
      </div>

      <!-- 🐶 Tarjeta del formulario -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="editarTratamiento" class="space-y-6">
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
            <label class="block text-gray-700 font-medium mb-2">👤 Usuario que registró</label>
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
            <input
              v-model="form.tipo"
              type="text"
              placeholder="Ej: Desparasitación, Vacunación..."
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>

          <!-- 📅 Fecha inicio -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha Inicio</label>
            <input
              type="date"
              v-model="form.fecha_inicio"
              disabled
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
          </div>

          <!-- 💰 Costo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">💰 Costo (Bs)</label>
            <input
              v-model.number="form.costo"
              type="number"
              step="0.01"
              min="10"
              max="1500"
              placeholder="Ej: 80.00"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            />
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
              Guardar Cambios
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
import { ref, reactive, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import ModalError from "@/components/modalError.vue";

const router = useRouter()
const route = useRoute()

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
const usuarios = ref([])
const modalVisible = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === "✅ Éxito") router.push("/tratamientos")
}

const mostrarError = (msg) => {
  modalTitle.value = "⚠️ Error"
  modalMessage.value = msg
  modalVisible.value = true
}

// Cargar datos iniciales
onMounted(async () => {
  pacientes.value = await $fetch("/api/pacientes")
  usuarios.value = await $fetch("/api/user")

  const data = await $fetch(`/api/tratamientos/${route.params.id}`)
  Object.assign(form, data)

  const usuario = usuarios.value.find(u => u.id_usuario === form.id_usuario)
  usuarioNombre.value = usuario ? usuario.nombre : "Desconocido"
})

// Validaciones
const validarDescripcion = (texto) => {
  const ofensivas = ["tonto","idiota","imbecil","maldito"]
  const sqlMaliciosas = /(drop\s|delete\s|insert\s|update\s|select\s|\<script|\<\/script)/i
  if (sqlMaliciosas.test(texto)) return "No se permiten posibles inyecciones SQL o scripts."
  if (ofensivas.some(p => texto.toLowerCase().includes(p))) return "Evita usar palabras ofensivas."
  if (/(.)\1{4,}/.test(texto)) return "El texto contiene repeticiones sospechosas."
  if (texto.length < 10) return "La descripción debe tener al menos 10 caracteres."
  if (texto.length > 500) return "La descripción no puede superar los 500 caracteres."
  return null
}

const editarTratamiento = async () => {
  const hoy = new Date()
  const fechaInicio = new Date(form.fecha_inicio)
  const limite = new Date()
  limite.setDate(hoy.getDate() + 20)

  if (!form.id_paciente) return mostrarError("Debe seleccionar un paciente.")
  if (!form.tipo || form.tipo.trim().length < 3) return mostrarError("Debe ingresar un tipo de tratamiento válido (mínimo 3 caracteres).")
  if (!form.costo || isNaN(form.costo) || form.costo < 10 || form.costo > 1500) return mostrarError("El costo debe estar entre 10 y 1500 Bs.")
  if (!/^\d+(\.\d{1,2})?$/.test(form.costo)) return mostrarError("El costo debe tener como máximo 2 decimales.")
  if (!form.estado) return mostrarError("Debe seleccionar un estado.")
  if (!form.gravedad) return mostrarError("Debe seleccionar una gravedad.")
  const errorDesc = validarDescripcion(form.descripcion)
  if (errorDesc) return mostrarError(errorDesc)

  try {
    await $fetch(`/api/tratamientos/${route.params.id}`, { method: "PUT", body: form })
    modalTitle.value = "✅ Éxito"
    modalMessage.value = "Tratamiento actualizado correctamente."
    modalVisible.value = true
  } catch {
    mostrarError("No se pudo actualizar el tratamiento.")
  }
}
</script>
