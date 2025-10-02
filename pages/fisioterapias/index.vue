<template>
    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Fisioterapias</h1>

        <NuxtLink to="/fisioterapias/nuevo" class="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4 inline-block">
            ➕ Nueva Fisioterapia
        </NuxtLink>

        <div v-for="f in fisioterapias" :key="f.id_fisioterapia"
            class="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
            <div>
                <p class="text-lg font-semibold">
                    🐾 Paciente: {{ f.nombre_paciente }}
                </p>
                <p class="text-gray-700">
                    👨‍⚕️ Usuario: {{ f.nombre_usuario }}
                </p>
                <p class="text-gray-600">{{ f.procedimiento }}</p>
                <p class="text-sm text-gray-500">
                    📅 {{ f.fecha }}
                </p>
            </div>
            <div class="flex gap-2">
                <NuxtLink :to="`/fisioterapias/${f.id_fisioterapia}`" class="px-3 py-1 bg-green-500 text-white rounded">
                    Editar
                </NuxtLink>
                <button @click="eliminar(f.id_fisioterapia)"
                    class="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const fisioterapias = ref([])
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

  // Cargar fisioterapias
  const f = await $fetch("/api/fisioterapias")

  // Enriquecer fisioterapias con nombres de paciente y usuario
  fisioterapias.value = f.map(fisio => {
    const paciente = pacientes.value.find(pa => pa.id_paciente === fisio.id_paciente)
    const usuario = usuarios.value.find(us => us.id_usuario === fisio.id_usuario)

    return {
      ...fisio,
      nombre_paciente: paciente ? paciente.nombre : "Desconocido",
      nombre_usuario: usuario ? usuario.nombre : "Desconocido",
    }
  })
})

const eliminar = async (id) => {
  if (confirm("¿Seguro que deseas eliminar esta fisioterapia?")) {
    await $fetch(`/api/fisioterapias/${id}`, { method: "DELETE" })
    fisioterapias.value = fisioterapias.value.filter(f => f.id_fisioterapia !== id)
  }
}
</script>
