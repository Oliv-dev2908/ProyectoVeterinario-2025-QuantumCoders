<template>
    <div class="max-w-xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Editar Consulta</h1>

        <form @submit.prevent="actualizarConsulta">
            <!-- 🐾 Paciente -->
            <label>🐾 Paciente</label>
            <select v-model="form.id_paciente" class="border p-2 w-full mb-4">
                <option value="">Seleccione un paciente</option>
                <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
                    {{ p.nombre }}
                </option>
            </select>

            <!-- 👩‍⚕️ Médico -->
            <label>👩‍⚕️ Médico</label>
            <input type="text" v-model="nombreUsuario"
                class="border p-2 w-full mb-4 bg-gray-100 text-gray-600 cursor-not-allowed" disabled />

            <!-- 📅 Fecha -->
            <label>📅 Fecha de consulta</label>
            <input type="datetime-local" v-model="form.fecha"
                class="border p-2 w-full mb-4 bg-gray-100 text-gray-600 cursor-not-allowed" disabled />

            <!-- 💬 Motivo -->
            <label>💬 Motivo</label>
            <textarea v-model="form.motivo" class="border p-2 w-full mb-4"></textarea>

            <!-- ⚕️ Signos clínicos -->
            <label>⚕️ Signos clínicos</label>
            <textarea v-model="form.signosclinicos" class="border p-2 w-full mb-4"></textarea>

            <!-- 🔁 Curso -->
            <label>🔁 Curso</label>
            <textarea v-model="form.curso" class="border p-2 w-full mb-4"></textarea>

            <!-- 🧠 Diagnóstico presuntivo -->
            <label>🧠 Diagnóstico presuntivo</label>
            <textarea v-model="form.diagnosticopresuntivo" class="border p-2 w-full mb-4"></textarea>

            <!-- 🧾 Observaciones -->
            <label>🧾 Observaciones</label>
            <textarea v-model="form.observaciones" class="border p-2 w-full mb-4"></textarea>

            <!-- 📆 Próxima consulta -->
            <label>📆 Fecha próxima consulta (opcional)</label>
            <input type="datetime-local" v-model="form.fechaproxconsulta" class="border p-2 w-full mb-4" />

            <!-- ❤️ Condición -->
            <label>❤️ Condición</label>
            <input type="text" v-model="form.condicion" class="border p-2 w-full mb-4" />

            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Actualizar
            </button>
        </form>
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
        // 1️⃣ Cargar pacientes
        pacientes.value = await $fetch("/api/pacientes")

        // 2️⃣ Traer datos de la consulta + cita desde la API que ya tienes
        const data = await $fetch(`/api/consultas/${id}`)
        form.value = { ...data, id_cita: data.id_cita || null }

        // 3️⃣ Obtener nombre de usuario logueado
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

    // 1️⃣ Actualizar la consulta
    await $fetch(`/api/consultas/${form.value.id_consulta}`, {
      method: "PUT",
      body
    })

    // 2️⃣ Actualizar o crear cita según corresponda
    if (form.value.fechaproxconsulta) {
      if (form.value.id_cita) {
        // Ya existe la cita: actualizarla
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
        // Antes no había cita, ahora se agregó fecha: crearla
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

        // Guardamos el id_cita generado en la consulta
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
