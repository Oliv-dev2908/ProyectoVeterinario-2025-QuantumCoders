<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Nueva Cirugía</h1>
    <form @submit.prevent="guardarCirugia">
      <label class="block mb-2">Paciente</label>
      <select v-model="form.id_paciente" class="border p-2 w-full mb-4">
        <option value="" disabled>Seleccione un paciente</option>
        <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
          {{ p.nombre }}
        </option>
      </select>

      <label class="block mb-2">Fecha</label>
      <input type="date" v-model="form.fecha" class="border p-2 w-full mb-4" />

      <label class="block mb-2">Descripción</label>
      <textarea v-model="form.descripcion" class="border p-2 w-full mb-4"></textarea>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseUser } from '#imports'

const form = ref({
  id_paciente: '',
  id_usuario: 0,
  fecha: new Date().toISOString().substr(0, 10),
  descripcion: ''
})

const pacientes = ref([])
const user = useSupabaseUser()  // aquí tenemos el UUID de supabase

onMounted(async () => {
  // Traer pacientes
  pacientes.value = await $fetch('/api/pacientes')

  if (user.value?.id) {
    // Llamar a tu API de usuarios para obtener el id_usuario
    try {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.value.id_usuario = usuarioData.id_usuario
      console.log('ID de usuario para cirugía:', form.value.id_usuario)
    } catch (err) {
      console.error('Error obteniendo usuario:', err)
      alert('No se pudo obtener el ID del usuario')
    }
  } else {
    alert('Usuario no logueado')
  }
})

// Asignar id_usuario cuando el user.value esté disponible
watch(
  () => user.value,
  (u) => {
    if (u?.id_usuario) {
      form.value.id_usuario = u.id_usuario
      console.log('ID de usuario para cirugía:', form.value.id_usuario)
    }
  },
  { immediate: true }
)

const guardarCirugia = async () => {
  if (!form.value.id_usuario || !form.value.id_paciente || !form.value.descripcion) {
    alert('Faltan datos para crear la cirugía')
    return
  }

  try {
    console.log('Body a enviar:', form.value)
    const data = await $fetch('/api/cirugias', { method: 'POST', body: form.value })
    console.log('Cirugía creada:', data)
    alert('Cirugía guardada!')
    form.value.descripcion = ''
    form.value.id_paciente = ''
    form.value.fecha = new Date().toISOString().substr(0, 10)
  } catch (err) {
    console.error('Error guardando cirugía:', err)
    alert('Error guardando cirugía: ' + (err.data?.error || err.message))
  }
}
</script>

