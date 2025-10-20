<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar fijo en esquina superior izquierda -->
    <button
      @click="router.push('/pacientes')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver a Pacientes
    </button>

    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-4xl p-8 ml-65">
      <!-- 🩺 Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">📄 Reporte Completo</h1>
        <p class="text-gray-500 text-sm mt-1">
          Historial completo de procedimientos y tratamientos de <strong>{{ paciente.nombre }}</strong>
        </p>
      </div>

      <!-- 🧾 Contenedor principal -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200 space-y-8">
        <!-- 📅 Filtros -->
        <div class="flex flex-col sm:flex-row sm:items-end gap-4">
          <div class="flex-1">
            <label class="block text-gray-700 font-medium mb-1">📆 Desde</label>
            <input type="date" v-model="filtros.desde"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div class="flex-1">
            <label class="block text-gray-700 font-medium mb-1">📅 Hasta</label>
            <input type="date" v-model="filtros.hasta"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <button
            @click="cargarReportes"
            class="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
          >
            Filtrar
          </button>
        </div>

        <!-- 🩺 Cirugías -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">🩺 Cirugías</h2>
          <div v-if="cirugias.length" class="space-y-2">
            <div v-for="c in cirugias" :key="c.id_cirugia"
              class="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
              <p class="font-medium text-gray-800">{{ c.descripcion }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ formatearFecha(c.fecha) }}</p>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm italic">Sin cirugías registradas.</p>
        </div>

        <!-- 💊 Tratamientos -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">💊 Tratamientos</h2>
          <div v-if="tratamientos.length" class="space-y-2">
            <div v-for="t in tratamientos" :key="t.id_tratamiento"
              class="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
              <p class="font-medium text-gray-800">{{ t.descripcion }}</p>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatearFecha(t.fecha_inicio) }} → {{ formatearFecha(t.fecha_fin) }}
              </p>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm italic">Sin tratamientos registrados.</p>
        </div>

        <!-- 🐕‍🦺 Fisioterapias -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">🐕‍🦺 Fisioterapias</h2>
          <div v-if="fisioterapias.length" class="space-y-2">
            <div v-for="f in fisioterapias" :key="f.id_fisioterapia"
              class="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
              <p class="font-medium text-gray-800">{{ f.procedimiento }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ formatearFecha(f.fecha) }}</p>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm italic">Sin fisioterapias registradas.</p>
        </div>

        <!-- 🖨️ Botón imprimir -->
        <div class="flex justify-end pt-4">
          <button
            @click="imprimirReporte"
            class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
          >
            🖨️ Imprimir Reporte
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
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
  paciente.value = await $fetch(`/api/pacientes/${pacienteId}`);
  cirugias.value = await $fetch(`/api/cirugias/paciente/${pacienteId}?desde=${filtros.value.desde}&hasta=${filtros.value.hasta}`);
  tratamientos.value = await $fetch(`/api/tratamientos/paciente/${pacienteId}?desde=${filtros.value.desde}&hasta=${filtros.value.hasta}`);
  fisioterapias.value = await $fetch(`/api/fisioterapias/paciente/${pacienteId}?desde=${filtros.value.desde}&hasta=${filtros.value.hasta}`);
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "—";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit" });
};

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
