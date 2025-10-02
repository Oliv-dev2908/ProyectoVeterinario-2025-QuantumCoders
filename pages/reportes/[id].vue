<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Reporte Completo - {{ paciente.nombre }}</h1>

    <!-- Filtros -->
    <div class="flex gap-4 mb-6">
      <label>
        Desde:
        <input type="date" v-model="filtros.desde" class="border p-2" />
      </label>
      <label>
        Hasta:
        <input type="date" v-model="filtros.hasta" class="border p-2" />
      </label>
      <button @click="cargarReportes" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Filtrar
      </button>
    </div>

    <!-- Cirugías -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-2">Cirugías</h2>
      <ul>
        <li v-for="c in cirugias" :key="c.id_cirugia" class="border p-2 rounded mb-1">
          {{ c.descripcion }} - {{ formatearFecha(c.fecha) }}
        </li>
      </ul>
    </div>

    <!-- Tratamientos -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-2">Tratamientos</h2>
      <ul>
        <li v-for="t in tratamientos" :key="t.id_tratamiento" class="border p-2 rounded mb-1">
          {{ t.descripcion }} - {{ formatearFecha(t.fecha_inicio) }} → {{ formatearFecha(t.fecha_fin) }}
        </li>
      </ul>
    </div>

    <!-- Fisioterapias -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-2">Fisioterapias</h2>
      <ul>
        <li v-for="f in fisioterapias" :key="f.id_fisioterapia" class="border p-2 rounded mb-1">
          {{ f.procedimiento }} - {{ formatearFecha(f.fecha) }}
        </li>
      </ul>
    </div>

    <button @click="imprimirReporte" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
      Imprimir Reporte
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "#imports";

const route = useRoute();
const pacienteId = route.params.id;

const paciente = ref({});
const cirugias = ref([]);
const tratamientos = ref([]);
const fisioterapias = ref([]);

const filtros = ref({
  desde: "",
  hasta: ""
});

onMounted(async () => {
  await cargarReportes();
});

const cargarReportes = async () => {
  // 🔹 Traer paciente
  paciente.value = await $fetch(`/api/pacientes/${pacienteId}`);

  // 🔹 Traer cirugías
  cirugias.value = await $fetch(`/api/cirugias/paciente/${pacienteId}?desde=${filtros.desde}&hasta=${filtros.hasta}`);

  // 🔹 Traer tratamientos
  tratamientos.value = await $fetch(`/api/tratamientos/paciente/${pacienteId}?desde=${filtros.desde}&hasta=${filtros.hasta}`);

  // 🔹 Traer fisioterapias
  fisioterapias.value = await $fetch(`/api/fisioterapias/paciente/${pacienteId}?desde=${filtros.desde}&hasta=${filtros.hasta}`);
};

// 🔹 Formatear fecha
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "—";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
};

// 🔹 Imprimir todo el reporte
const imprimirReporte = () => {
  let contenido = `
    <html>
    <head><title>Reporte Completo - ${paciente.value.nombre}</title></head>
    <body>
      <h1>Paciente: ${paciente.value.nombre}</h1>

      <h2>Cirugías</h2>
      <ul>${cirugias.value.map(c => `<li>${c.descripcion} - ${formatearFecha(c.fecha)}</li>`).join("")}</ul>

      <h2>Tratamientos</h2>
      <ul>${tratamientos.value.map(t => `<li>${t.descripcion} - ${formatearFecha(t.fecha_inicio)} → ${formatearFecha(t.fecha_fin)}</li>`).join("")}</ul>

      <h2>Fisioterapias</h2>
      <ul>${fisioterapias.value.map(f => `<li>${f.procedimiento} - ${formatearFecha(f.fecha)}</li>`).join("")}</ul>
    </body>
    </html>
  `;
  const ventana = window.open("", "_blank", "width=900,height=700");
  ventana.document.write(contenido);
  ventana.document.close();
  ventana.focus();
  ventana.print();
};
</script>
