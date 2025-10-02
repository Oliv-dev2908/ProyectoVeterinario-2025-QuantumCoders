<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Editar Tratamiento</h1>
    <form @submit.prevent="actualizarTratamiento">
      <!-- Paciente -->
      <label class="block mb-2">Paciente</label>
      <select v-model="form.id_paciente" class="border p-2 w-full mb-4">
        <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
          {{ p.nombre }}
        </option>
      </select>

      <!-- Usuario (solo lectura) -->
      <label class="block mb-2">Usuario</label>
      <input type="text" :value="usuarioNombre" disabled class="border p-2 w-full mb-4 bg-gray-100" />

      <!-- Fechas -->
      <label class="block mb-2">Fecha Inicio</label>
      <input type="date" v-model="form.fecha_inicio" class="border p-2 w-full mb-4" />

      <label class="block mb-2">Fecha Fin</label>
      <input type="date" v-model="form.fecha_fin" class="border p-2 w-full mb-4" />

      <!-- Descripción -->
      <label class="block mb-2">Descripción</label>
      <textarea v-model="form.descripcion" class="border p-2 w-full mb-4"></textarea>

      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Actualizar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"

const route = useRoute()
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
    alert("Tratamiento actualizado!")
    navigateTo("/tratamientos")
  } catch (err) {
    console.error("Error actualizando tratamiento:", err)
    alert("Error: " + (err.data?.error || err.message))
  }
}
</script>
