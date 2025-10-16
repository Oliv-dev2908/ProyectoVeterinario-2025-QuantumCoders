<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Nueva Consulta</h1>

    <form @submit.prevent="guardarConsulta">
      <!-- 🐾 Paciente -->
      <label class="block mb-1">🐾 Paciente</label>
      <select v-model="form.id_paciente" class="border p-2 w-full mb-4">
        <option value="">Seleccione un paciente</option>
        <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
          {{ p.nombre }}
        </option>
      </select>

      <!-- 👩‍⚕️ Médico / Usuario -->
      <label class="block mb-1">👩‍⚕️ Médico</label>
      <input type="text" v-model="nombreUsuario"
        class="border p-2 w-full mb-4 bg-gray-100 text-gray-600 cursor-not-allowed" disabled />

      <!-- 📅 Fecha de la consulta -->
      <label class="block mb-1">📅 Fecha de consulta</label>
      <input type="datetime-local" v-model="form.fecha"
        class="border p-2 w-full mb-4 bg-gray-100 text-gray-600 cursor-not-allowed" disabled />

      <!-- 💬 Motivo -->
      <label class="block mb-1">💬 Motivo</label>
      <textarea v-model="form.motivo" class="border p-2 w-full mb-4"
        placeholder="Describe el motivo de la consulta"></textarea>

      <!-- ⚕️ Signos clínicos -->
      <label class="block mb-1">⚕️ Signos clínicos</label>
      <textarea v-model="form.signosclinicos" class="border p-2 w-full mb-4"
        placeholder="Ejemplo: fiebre, tos, falta de apetito..."></textarea>

      <!-- 🔁 Curso -->
      <label class="block mb-1">🔁 Curso</label>
      <textarea v-model="form.curso" class="border p-2 w-full mb-4"
        placeholder="Evolución del cuadro clínico"></textarea>

      <!-- 🧠 Diagnóstico presuntivo -->
      <label class="block mb-1">🧠 Diagnóstico presuntivo</label>
      <textarea v-model="form.diagnosticopresuntivo" class="border p-2 w-full mb-4"></textarea>

      <!-- 🧾 Observaciones -->
      <label class="block mb-1">🧾 Observaciones</label>
      <textarea v-model="form.observaciones" class="border p-2 w-full mb-4"></textarea>

      <!-- 📆 Próxima consulta -->
      <label class="block mb-1">📆 Fecha próxima consulta (opcional)</label>
      <input type="datetime-local" v-model="form.fechaproxconsulta" class="border p-2 w-full mb-4" />

      <!-- ❤️ Condición -->
      <label class="block mb-1">❤️ Condición</label>
      <input type="text" v-model="form.condicion" class="border p-2 w-full mb-4"
        placeholder="Ejemplo: estable, crítico, en recuperación..." />

      <!-- Botón -->
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Guardar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useSupabaseUser } from "#imports"

const pacientes = ref([])
const user = useSupabaseUser()
const nombreUsuario = ref("Cargando...")

const form = ref({
  id_paciente: "",
  id_usuario: 0,
  motivo: "",
  signosclinicos: "",
  curso: "",
  fechaproxconsulta: "",
  diagnosticopresuntivo: "",
  observaciones: "",
  fecha: "",
  condicion: ""
})

// 🔄 Cargar pacientes y usuario
onMounted(async () => {
  try {
    // Cargar pacientes
    pacientes.value = await $fetch("/api/pacientes")

    const now = new Date()
    const boliviaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/La_Paz" })
    )
    // Formato YYYY-MM-DDTHH:mm
    const yyyy = boliviaTime.getFullYear()
    const mm = String(boliviaTime.getMonth() + 1).padStart(2, "0")
    const dd = String(boliviaTime.getDate()).padStart(2, "0")
    const hh = String(boliviaTime.getHours()).padStart(2, "0")
    const min = String(boliviaTime.getMinutes()).padStart(2, "0")
    form.value.fecha = `${yyyy}-${mm}-${dd}T${hh}:${min}`


    // Obtener usuario logueado
    if (user.value?.id) {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.value.id_usuario = usuarioData.id_usuario
      nombreUsuario.value = usuarioData.nombre || "Usuario desconocido"
      console.log("🩺 ID usuario:", form.value.id_usuario)
    } else {
      nombreUsuario.value = "No logueado"
      alert("Usuario no logueado.")
    }
  } catch (err) {
    console.error("❌ Error cargando datos:", err)
    alert("Error al cargar datos del formulario.")
  }
})

// 💾 Guardar consulta
const guardarConsulta = async () => {
  try {
    const consultaBody = { ...form.value }
    if (!consultaBody.fechaproxconsulta) delete consultaBody.fechaproxconsulta

    // 1️⃣ Crear consulta
    const nuevaConsulta = await $fetch("/api/consultas", {
      method: "POST",
      body: consultaBody
    })

    // 2️⃣ Si hay próxima consulta, crear cita
    if (form.value.fechaproxconsulta) {
      const nuevaCita = await $fetch("/api/citas", {
        method: "POST",
        body: {
          id_paciente: form.value.id_paciente,
          fecha_hora: form.value.fechaproxconsulta,
          motivo: form.value.motivo || "Consulta de seguimiento",
          estado: "pendiente",
          recordatorio_enviado: false,
          id_consulta: nuevaConsulta.id_consulta // <--- relacionamos cita con consulta
        }
      })

      // 3️⃣ Actualizar consulta con el id_cita generado
      await $fetch(`/api/consultas/${nuevaConsulta.id_consulta}`, {
        method: "PUT",
        body: { id_cita: nuevaCita.id_cita }
      })
    }


    alert("✅ Consulta registrada correctamente.")
    window.location.href = "/consultas"
  } catch (err) {
    console.error("❌ Error al crear consulta:", err)
    alert("Error al guardar la consulta.")
  }
}

</script>
