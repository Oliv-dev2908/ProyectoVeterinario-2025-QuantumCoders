<template>
    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Consultas</h1>

        <NuxtLink to="/consultas/nuevo" class="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4 inline-block">
            ➕ Nueva Consulta
        </NuxtLink>

        <div v-for="c in consultas" :key="`${c.id_paciente}-${c.fecha}`"
            class="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
            <div>
                <p class="text-lg font-semibold">
                    🐾 Paciente: {{ c.nombre_paciente }}
                </p>
                <p class="text-gray-700">
                    👨‍⚕️ Usuario: {{ c.nombre_usuario }}
                </p>
                <p class="text-gray-600">📌 Motivo: {{ c.motivo }}</p>
                <p class="text-sm text-gray-500">
                    📅 Fecha: {{ new Date(c.fecha).toLocaleString() }}
                </p>
                <p v-if="c.fechaproxconsulta" class="text-sm text-blue-500">
                    🗓 Próxima cita: {{ new Date(c.fechaproxconsulta).toLocaleString() }}
                </p>
            </div>
            <div class="flex gap-2">
                <NuxtLink :to="`/consultas/${c.id_paciente}`" class="px-3 py-1 bg-green-500 text-white rounded">
                    Ver/Editar
                </NuxtLink>
                <button @click="eliminar(c.id_paciente, c.fecha)"
                    class="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const consultas = ref([])
const pacientes = ref([])
const usuarios = ref([])

const cargarPacientes = async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")
  } catch (e) {
    console.error("Error al cargar pacientes", e)
  }
}

const cargarUsuarios = async () => {
  try {
    usuarios.value = await $fetch("/api/user")
  } catch (err) {
    console.error("Error cargando usuarios:", err)
  }
}

onMounted(async () => {
  // Cargar pacientes y usuarios
  await Promise.all([cargarPacientes(), cargarUsuarios()])

  // Cargar consultas
  const f = await $fetch("/api/consultas")

  // Enriquecer consultas con nombres de paciente y usuario
  consultas.value = f.map(c => {
    const paciente = pacientes.value.find(pa => pa.id_paciente === c.id_paciente)
    const usuario = usuarios.value.find(us => us.id_usuario === c.id_usuario)

    return {
      ...c,
      nombre_paciente: paciente ? paciente.nombre : "Desconocido",
      nombre_usuario: usuario ? usuario.nombre : "Desconocido",
    }
  })
})

const eliminar = async (id_paciente, fecha) => {
  if (confirm("¿Seguro que deseas eliminar esta consulta?")) {
    await $fetch(`/api/consultas/${id_paciente}`, { 
        method: "DELETE",
        body: { fecha } // enviamos la fecha para identificar correctamente la consulta
    })
    consultas.value = consultas.value.filter(c => !(c.id_paciente === id_paciente && c.fecha === fecha))
  }
}
</script>
