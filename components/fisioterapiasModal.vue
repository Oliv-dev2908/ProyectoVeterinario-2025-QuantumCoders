<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow max-w-lg w-full relative">
      <button @click="close" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
      <h2 class="text-2xl font-bold mb-4">Fisioterapias del Paciente</h2>

      <div v-if="loading" class="text-center">Cargando...</div>
      <div v-else>
        <p v-if="fisioterapias.length === 0" class="text-gray-600">
          No hay fisioterapias registradas para este paciente.
        </p>
        <ul v-else class="space-y-2">
          <li v-for="f in fisioterapias" :key="f.id_fisioterapia" class="border p-2 rounded">
            <p><strong>Procedimiento:</strong> {{ f.procedimiento }}</p>
            <p><strong>Fecha:</strong> {{ formatearFecha(f.fecha) }}</p>
            <p><strong>Registrado por:</strong> {{ f.usuario_nombre }}</p>
          </li>
        </ul>
      </div>

      <div class="flex justify-end mt-4">
        <button @click="imprimirFisioterapias" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Imprimir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  pacienteId: Number,
  visible: Boolean,
  paciente: Object
});
const emit = defineEmits(["update:visible"]);

const fisioterapias = ref([]);
const loading = ref(false);

const fetchFisioterapias = async () => {
  if (!props.pacienteId) return;
  loading.value = true;
  try {
    fisioterapias.value = await $fetch(`/api/fisioterapias/paciente/${props.pacienteId}`);
  } catch (err) {
    console.error("Error cargando fisioterapias:", err);
    fisioterapias.value = [];
  } finally {
    loading.value = false;
  }
};

watch(() => props.pacienteId, fetchFisioterapias);
watch(() => props.visible, (val) => { if (val) fetchFisioterapias() });

const close = () => {
  emit("update:visible", false);
};

// 🔹 Función para formatear fecha en dd/mm/yyyy
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "—";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

const imprimirFisioterapias = () => {
  if (!props.paciente || fisioterapias.value.length === 0) return;

  const paciente = props.paciente;
  let contenido = `
    <html>
    <head>
      <title>Registro de Fisioterapias - ${paciente.nombre}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1, h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
      </style>
    </head>
    <body>
      <h1>Registro de Fisioterapias</h1>
      <h2>Paciente: ${paciente.nombre} (${paciente.especie} - ${paciente.raza})</h2>
      <p><strong>Edad:</strong> ${paciente.edad} años | <strong>Sexo:</strong> ${paciente.sexo ? "Macho" : "Hembra"}</p>
      <p><strong>Cliente:</strong> ${paciente.id_cliente}</p>
      <table>
        <thead>
          <tr>
            <th>Procedimiento</th>
            <th>Fecha</th>
            <th>Registrado por</th>
          </tr>
        </thead>
        <tbody>
          ${fisioterapias.value.map(f => `
            <tr>
              <td>${f.procedimiento}</td>
              <td>${formatearFecha(f.fecha)}</td>
              <td>${f.usuario_nombre}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const ventana = window.open("", "_blank", "width=800,height=600");
  ventana.document.write(contenido);
  ventana.document.close();
  ventana.focus();
  ventana.print();
};
</script>
