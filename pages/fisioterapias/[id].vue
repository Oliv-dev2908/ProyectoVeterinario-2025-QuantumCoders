<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Editar Fisioterapia</h1>
    <form @submit.prevent="actualizarFisioterapia">
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

      <!-- Fecha -->
      <label class="block mb-2">Fecha</label>
      <input type="date" v-model="form.fecha" class="border p-2 w-full mb-4" />

      <!-- Procedimiento -->
      <label class="block mb-2">Procedimiento</label>
      <textarea v-model="form.procedimiento" class="border p-2 w-full mb-4"></textarea>

      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Actualizar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { useRoute, navigateTo } from "#imports"

const route = useRoute()

const form = reactive({
  id_paciente: "",
  id_usuario: "",
  fecha: "",
  procedimiento: ""
})

const pacientes = ref([])
const usuarioNombre = ref("")

onMounted(async () => {
  pacientes.value = await $fetch("/api/pacientes")

  // Obtener datos de la fisioterapia
  const data = await $fetch(`/api/fisioterapias/${route.params.id}`)
  Object.assign(form, data)

  // Obtener usuario para mostrar nombre
  const usuarioData = await $fetch(`/api/user/${form.id_usuario}`)
  usuarioNombre.value = usuarioData.nombre
})

const actualizarFisioterapia = async () => {
  try {
    await $fetch(`/api/fisioterapias/${route.params.id}`, { method: "PUT", body: form })
    alert("Fisioterapia actualizada!")
    navigateTo("/fisioterapias")
  } catch (err) {
    console.error("Error actualizando fisioterapia:", err)
    alert("Error: " + (err.data?.error || err.message))
  }
}
</script>
