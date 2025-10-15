<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Nueva Consulta</h1>

    <form @submit.prevent="guardarConsulta">
      <label>Paciente</label>
      <select v-model="form.paciente_id" class="border p-2 w-full mb-4">
        <option v-for="p in pacientes" :key="p.id" :value="p.id">{{ p.nombre }}</option>
      </select>

      <label>Fecha</label>
      <input type="datetime-local" v-model="form.fecha" class="border p-2 w-full mb-4" />

      <label>Motivo</label>
      <textarea v-model="form.motivo" class="border p-2 w-full mb-4"></textarea>

      <label>Observaciones</label>
      <textarea v-model="form.observaciones" class="border p-2 w-full mb-4"></textarea>

      <label>Próxima cita (opcional)</label>
      <input type="datetime-local" v-model="form.proxima_cita" class="border p-2 w-full mb-4" />

      <button class="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'

const { createConsulta } = useConsultas()
const pacientes = ref([])

const form = ref({
  paciente_id: '',
  fecha: '',
  motivo: '',
  observaciones: '',
  proxima_cita: ''
})

onMounted(async () => {
  const { data } = await useFetch('/api/pacientes')
  pacientes.value = data.value
})

const guardarConsulta = async () => {
  await createConsulta(form.value)
  if (form.value.proxima_cita) {
    await $fetch('/api/citas', { method: 'POST', body: { paciente_id: form.value.paciente_id, fecha: form.value.proxima_cita } })
  }
  // redirigir a index
  window.location.href = '/consultas'
}
</script>
