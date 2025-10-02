<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Editar Cirugía</h1>
    <form @submit.prevent="actualizarCirugia">
      <label class="block mb-2">Paciente</label>
      <select v-model="form.id_paciente" class="border p-2 w-full mb-4">
        <option value="" disabled>Seleccione un paciente</option>
        <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">{{ p.nombre }}</option>
      </select>

      <label class="block mb-2">Fecha</label>
      <input type="date" v-model="form.fecha" class="border p-2 w-full mb-4" />

      <label class="block mb-2">Descripción</label>
      <textarea v-model="form.descripcion" class="border p-2 w-full mb-4"></textarea>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Actualizar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const form = ref({
  id_paciente: '',
  fecha: '',
  descripcion: ''
})
const pacientes = ref([])

onMounted(async () => {
  pacientes.value = await $fetch('/api/pacientes')
  const data = await $fetch(`/api/cirugias/${route.params.id}`)
  form.value = {
    id_paciente: data.id_paciente,
    fecha: data.fecha,
    descripcion: data.descripcion
  }
})

const actualizarCirugia = async () => {
  await $fetch(`/api/cirugias/${route.params.id}`, { method: 'PUT', body: form.value })
  alert('Cirugía actualizada!')
  router.push('/cirugias')
}
</script>
