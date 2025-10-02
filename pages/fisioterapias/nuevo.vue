<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Nueva Fisioterapia</h1>
    <form @submit.prevent="guardarFisioterapia">
      <!-- Paciente -->
      <label class="block mb-2">Paciente</label>
      <select v-model="form.id_paciente" class="border p-2 w-full mb-4">
        <option value="" disabled>Seleccione un paciente</option>
        <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
          {{ p.nombre }}
        </option>
      </select>

      <!-- Usuario (solo mostrar el nombre, no editable) -->
      <label class="block mb-2">Usuario</label>
      <input type="text" :value="usuarioNombre" disabled class="border p-2 w-full mb-4 bg-gray-100" />

      <!-- Fecha -->
      <label class="block mb-2">Fecha</label>
      <input type="date" v-model="form.fecha" class="border p-2 w-full mb-4" />

      <!-- Procedimiento -->
      <label class="block mb-2">Procedimiento</label>
      <textarea v-model="form.procedimiento" class="border p-2 w-full mb-4"></textarea>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue"
import { useSupabaseUser } from "#imports"

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

const guardarFisioterapia = async () => {
  if (!form.id_usuario || !form.id_paciente || !form.procedimiento) {
    alert("Faltan datos para crear la fisioterapia")
    return
  }

  try {
    await $fetch("/api/fisioterapias", { method: "POST", body: form })
    alert("Fisioterapia guardada!")
    navigateTo("/fisioterapias")
  } catch (err) {
    console.error("Error guardando fisioterapia:", err)
    alert("Error: " + (err.data?.error || err.message))
  }
}
</script>
