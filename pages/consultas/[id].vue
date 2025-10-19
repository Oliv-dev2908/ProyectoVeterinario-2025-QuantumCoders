<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button
      @click="router.push('/consultas')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver a Consultas
    </button>

    <!-- Tarjeta central -->
    <div class="w-full max-w-3xl p-8 ml-65">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">✏️ Editar Consulta</h1>
        <p class="text-gray-500 text-sm mt-1">Actualiza los datos de la consulta</p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="actualizarConsulta" class="space-y-6">
          <!-- Paciente -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🐾 Paciente</label>
            <select v-model="form.id_paciente"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="">Seleccione un paciente</option>
              <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <!-- Médico -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">👩‍⚕️ Médico</label>
            <input type="text" v-model="nombreUsuario" disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
          </div>

          <!-- Fecha -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha de consulta</label>
            <input type="datetime-local" v-model="form.fecha" disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
          </div>

          <!-- Motivo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">💬 Motivo</label>
            <textarea v-model="form.motivo" placeholder="Describe el motivo de la consulta"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Signos clínicos -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">⚕️ Signos clínicos</label>
            <textarea v-model="form.signosclinicos" placeholder="Ej: fiebre, tos..."
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Curso -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🔁 Curso</label>
            <textarea v-model="form.curso" placeholder="Evolución del cuadro clínico"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Diagnóstico presuntivo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🧠 Diagnóstico presuntivo</label>
            <textarea v-model="form.diagnosticopresuntivo"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Observaciones -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🧾 Observaciones</label>
            <textarea v-model="form.observaciones"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Próxima consulta -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📆 Fecha próxima consulta (opcional)</label>
            <input type="datetime-local" v-model="form.fechaproxconsulta"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Condición -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">❤️ Condición</label>
            <input type="text" v-model="form.condicion" placeholder="Ej: estable, crítico..."
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Botón actualizar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Actualizar Consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "#imports"
import { useSupabaseUser } from "#imports"

const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()

const form = ref({
  id_consulta: 0,
  id_paciente: "",
  id_usuario: 0,
  id_cita: 0,
  fecha: "",
  motivo: "",
  signosclinicos: "",
  curso: "",
  diagnosticopresuntivo: "",
  observaciones: "",
  fechaproxconsulta: "",
  condicion: ""
})

const pacientes = ref([])
const nombreUsuario = ref("Cargando...")

onMounted(async () => {
  const id = route.params.id
  try {
    pacientes.value = await $fetch("/api/pacientes")
    const data = await $fetch(`/api/consultas/${id}`)
    form.value = { ...data, id_cita: data.id_cita || null }

    if (user.value?.id) {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.value.id_usuario = usuarioData.id_usuario
      nombreUsuario.value = usuarioData.nombre || "Usuario desconocido"
    } else {
      nombreUsuario.value = "No logueado"
    }
  } catch (err) {
    console.error("Error cargando datos de la consulta:", err)
    alert("No se pudo cargar la consulta.")
  }
})

const actualizarConsulta = async () => {
  try {
    const body = { ...form.value }

    await $fetch(`/api/consultas/${form.value.id_consulta}`, { method: "PUT", body })

    if (form.value.fechaproxconsulta) {
      if (form.value.id_cita) {
        await $fetch(`/api/citas/${form.value.id_cita}`, {
          method: "PUT",
          body: {
            id_paciente: form.value.id_paciente,
            fecha_hora: form.value.fechaproxconsulta,
            motivo: form.value.motivo || "Consulta de seguimiento",
            estado: "pendiente",
            recordatorio_enviado: false
          }
        })
      } else {
        const nuevaCita = await $fetch("/api/citas", {
          method: "POST",
          body: {
            id_paciente: form.value.id_paciente,
            fecha_hora: form.value.fechaproxconsulta,
            motivo: form.value.motivo || "Consulta de seguimiento",
            estado: "pendiente",
            recordatorio_enviado: false,
            id_consulta: form.value.id_consulta
          }
        })
        form.value.id_cita = nuevaCita.id_cita
        await $fetch(`/api/consultas/${form.value.id_consulta}`, {
          method: "PUT",
          body: { id_cita: nuevaCita.id_cita }
        })
      }
    }

    alert("✅ Consulta y cita actualizadas correctamente.")
    router.push("/consultas")
  } catch (err) {
    console.error("Error al actualizar consulta/cita:", err)
    alert("No se pudo actualizar la consulta o la cita.")
  }
}
</script>
