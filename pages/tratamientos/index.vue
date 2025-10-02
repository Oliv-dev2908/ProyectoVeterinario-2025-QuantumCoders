<template>
    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Tratamientos</h1>

        <NuxtLink to="/tratamientos/nuevo" class="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4 inline-block">
            ➕ Nuevo Tratamiento
        </NuxtLink>

        <div v-for="t in tratamientos" :key="t.id_tratamiento"
            class="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
            <div>
                <p class="text-lg font-semibold">
                    🐾 Paciente: {{ t.nombre_paciente }}
                </p>
                <p class="text-gray-700">
                    👨‍⚕️ Usuario: {{ t.nombre_usuario }}
                </p>
                <p class="text-gray-600">{{ t.descripcion }}</p>
                <p class="text-sm text-gray-500">
                    📅 {{ t.fecha_inicio }} → {{ t.fecha_fin }}
                </p>
            </div>
            <div class="flex gap-2">
                <NuxtLink :to="`/tratamientos/${t.id_tratamiento}`" class="px-3 py-1 bg-green-500 text-white rounded">
                    Editar</NuxtLink>
                <button @click="eliminar(t.id_tratamiento)"
                    class="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const tratamientos = ref([])
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

  // Cargar tratamientos
  const t = await $fetch("/api/tratamientos")

  // Enriquecer tratamientos
  tratamientos.value = t.map(trat => {
    const paciente = pacientes.value.find(pa => pa.id_paciente === trat.id_paciente)
    const usuario = usuarios.value.find(us => us.id_usuario === trat.id_usuario)

    return {
      ...trat,
      nombre_paciente: paciente ? paciente.nombre : "Desconocido",
      nombre_usuario: usuario ? usuario.nombre : "Desconocido",
    }
  })
})

const eliminar = async (id) => {
  if (confirm("¿Seguro que deseas eliminar este tratamiento?")) {
    await $fetch(`/api/tratamientos/${id}`, { method: "DELETE" })
    tratamientos.value = tratamientos.value.filter(t => t.id_tratamiento !== id)
  }
}
</script>
