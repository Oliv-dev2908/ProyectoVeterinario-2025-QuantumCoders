<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Cirugías</h1>
    <router-link to="/cirugias/nuevo" class="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block">Nueva Cirugía</router-link>

    <table class="w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">ID</th>
          <th class="p-2 border">Paciente</th>
          <th class="p-2 border">Usuario</th>
          <th class="p-2 border">Fecha</th>
          <th class="p-2 border">Descripción</th>
          <th class="p-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in cirugias" :key="c.id_cirugia">
          <td class="p-2 border">{{ c.id_cirugia }}</td>
          <td class="p-2 border">{{ c.nombre_paciente || c.id_paciente }}</td>
          <td class="p-2 border">{{ c.nombre_usuario || c.id_usuario }}</td>
          <td class="p-2 border">{{ c.fecha }}</td>
          <td class="p-2 border">{{ c.descripcion }}</td>
          <td class="p-2 border">
            <router-link :to="`/cirugias/${c.id_cirugia}`" class="text-blue-500 mr-2">Editar</router-link>
            <button @click="eliminarCirugia(c.id_cirugia)" class="text-red-500">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cirugias = ref([])

onMounted(async () => {
  cirugias.value = await $fetch('/api/cirugias')
})

const eliminarCirugia = async (id) => {
  if (!confirm('¿Desea eliminar esta cirugía?')) return
  await $fetch(`/api/cirugias/${id}`, { method: 'DELETE' })
  cirugias.value = cirugias.value.filter(c => c.id_cirugia !== id)
}
</script>
