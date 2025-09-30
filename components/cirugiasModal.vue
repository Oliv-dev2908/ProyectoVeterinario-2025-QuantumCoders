<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded shadow max-w-lg w-full relative">
            <button @click="close" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
            <h2 class="text-2xl font-bold mb-4">Cirugías del Paciente</h2>

            <div v-if="loading" class="text-center">Cargando...</div>
            <div v-else>
                <p v-if="cirugias.length === 0" class="text-gray-600">No hay cirugías registradas para este paciente.
                </p>
                <ul v-else class="space-y-2">
                    <li v-for="c in cirugias" :key="c.id_cirugia" class="border p-2 rounded">
                        <p><strong>Fecha:</strong> {{ c.fecha }}</p>
                        <p><strong>Descripción:</strong> {{ c.descripcion }}</p>
                        <p><strong>Usuario que registró:</strong> {{ c.usuario_nombre }}</p>
                    </li>
                </ul>
            </div>
            <div class="flex justify-end mb-4">
                <button @click="imprimirCirugias" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Imprimir
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props correctos
const props = defineProps({
    pacienteId: Number,
    visible: Boolean,
    paciente: Object // <-- nuevo prop con info del paciente
})
const emit = defineEmits(['update:visible'])



const cirugias = ref([])
const loading = ref(false)

const fetchCirugias = async () => {
    if (!props.pacienteId) return
    loading.value = true
    try {
        cirugias.value = await $fetch(`/api/cirugias/paciente/${props.pacienteId}`)
    } catch (err) {
        console.error('Error cargando cirugías:', err)
        cirugias.value = []
    } finally {
        loading.value = false
    }
}

// Watchers usando props
watch(() => props.pacienteId, fetchCirugias)
watch(() => props.visible, val => {
    if (val) fetchCirugias()
})

const close = () => {
    emit('update:visible', false)
}

const imprimirCirugias = () => {
    if (!props.paciente || cirugias.value.length === 0) return;

    const paciente = props.paciente;
    let contenido = `
      <html>
      <head>
        <title>Registro de Cirugías - ${paciente.nombre}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1, h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Registro de Cirugías</h1>
        <h2>Paciente: ${paciente.nombre} (${paciente.especie} - ${paciente.raza})</h2>
        <p><strong>Edad:</strong> ${paciente.edad} años | <strong>Sexo:</strong> ${paciente.sexo ? 'Macho' : 'Hembra'}</p>
        <p><strong>Cliente:</strong> ${paciente.id_cliente}</p>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Registrado por</th>
            </tr>
          </thead>
          <tbody>
            ${cirugias.value.map(c => `
              <tr>
                <td>${c.fecha}</td>
                <td>${c.descripcion}</td>
                <td>${c.usuario_nombre}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const ventana = window.open('', '_blank', 'width=800,height=600');
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.focus();
    ventana.print();
}


</script>
