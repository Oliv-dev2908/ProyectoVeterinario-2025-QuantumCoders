<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <!-- Ajuste por sidebar -->
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">🐾 Clientes</h1>
          <p class="text-gray-500 text-sm mt-1">Gestión de clientes y dueños de mascotas</p>
        </div>

        <router-link to="/clientes/nuevo"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition">
          ➕ Nuevo Cliente
        </router-link>
      </div>

      <!-- 🔍 Buscador -->
      <div class="mb-6 max-w-md">
        <input v-model="busqueda" type="text" placeholder="🔍 Buscar cliente por nombre..." class="w-full px-4 py-2 rounded-xl border border-gray-300
           focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm" />
      </div>

      <!-- 🧾 Tabla -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm">
              <th class="p-3">Nombre</th>
              <th class="p-3">Teléfono</th>
              <th class="p-3">Dirección</th>
              <th class="p-3">Abandono</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clientes" :key="c.id_cliente" class="border-t hover:bg-teal-50 transition">
              <td class="p-3 font-medium">{{ c.nombres }} {{ c.apellidos }}</td>
              <td class="p-3">{{ c.telefono || '—' }}</td>
              <td class="p-3">{{ c.zona }}, {{ c.calle }} #{{ c.numero }}</td>
              <td class="p-3">
                <span v-if="c.prob_abandono !== null" :class="{
                  'text-green-600 font-bold': c.prob_abandono < 0.15,
                  'text-yellow-600 font-bold': c.prob_abandono >= 0.15 && c.prob_abandono < 0.35,
                  'text-red-600 font-bold': c.prob_abandono >= 0.35
                }">
                  {{ (c.prob_abandono * 100).toFixed(1) }}%
                </span>
                <span v-else>—</span>
              </td>

              <td class="p-3 flex justify-center gap-3">
                <button @click="abrirModal(c)" class="text-blue-600 hover:text-blue-800 font-medium">
                  👁️ Ver
                </button>
                <router-link :to="`/clientes/${c.id_cliente}`"
                  class="text-yellow-600 hover:text-yellow-800 font-medium">
                  ✏️ Editar
                </router-link>
                <button @click="eliminarCliente(c.id_cliente)" class="text-red-500 hover:text-red-700 font-medium">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>

            <tr v-if="clientes.length === 0">
              <td colspan="4" class="p-6 text-center text-gray-500">
                No hay clientes registrados aún 🐶
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 📄 Paginación -->
      <div class="flex justify-center items-center gap-4 mt-6">
        <button @click="pagina--, cargarClientes()" :disabled="pagina === 1"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
          ◀ Anterior
        </button>

        <span class="font-semibold text-gray-700">
          Página {{ pagina }} de {{ Math.ceil(total / limite) }}
        </span>

        <button @click="pagina++, cargarClientes()" :disabled="pagina >= Math.ceil(total / limite)"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
          Siguiente ▶
        </button>
      </div>

      <!-- ⚠️ Error -->
      <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>

      <!-- 💬 Modal Detalles -->
      <div v-if="modalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative">
          <button @click="cerrarModal" class="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl">
            ✖
          </button>

          <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">
            {{ clienteSeleccionado.nombres }} {{ clienteSeleccionado.apellidos }}
          </h2>
          <div class="space-y-2 text-gray-700">
            <p><strong>📞 Teléfono:</strong> {{ clienteSeleccionado.telefono || '—' }}</p>
            <p><strong>📍 Zona:</strong> {{ clienteSeleccionado.zona || '—' }}</p>
            <p><strong>🏠 Calle:</strong> {{ clienteSeleccionado.calle || '—' }}</p>
            <p><strong>🏘️ Número:</strong> {{ clienteSeleccionado.numero || '—' }}</p>
          </div>

          <div class="text-center mt-6">
            <button @click="cerrarModal"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 rounded-xl hover:scale-105 transition">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { clientesService } from "~/server/services/clientesService";

const clientes = ref([]);
const error = ref("");
const predicciones = ref([]);


const modalVisible = ref(false);
const clienteSeleccionado = ref({});


const pagina = ref(1);
const limite = 20;
const total = ref(0);
const busqueda = ref("");


const cargarClientes = async () => {
  try {
    // 👉 Obtener clientes
    let res = await $fetch("/api/clientes");

    // 👉 Obtener predicciones del modelo
    let respPred = await $fetch("/api/machine2");
    predicciones.value = respPred.predictions;

    // 👉 Mezclar datos: agregar prob_abandono a cada cliente
    const clientesConProb = res.map(c => {
      const pred = predicciones.value.find(p => p.id_cliente === c.id_cliente);
      return {
        ...c,
        prob_abandono: pred ? pred.prob_abandono : null
      };
    });

    // 👉 Aplicar búsqueda
    let filtrados = clientesConProb.filter(c =>
      `${c.nombres} ${c.apellidos}`.toLowerCase().includes(busqueda.value.toLowerCase())
    );

    total.value = filtrados.length;

    // 👉 Paginación
    const inicio = (pagina.value - 1) * limite;
    clientes.value = filtrados.slice(inicio, inicio + limite);

  } catch (e) {
    error.value = "Error al cargar clientes";
  }
};



watch(busqueda, () => {
  pagina.value = 1; // reinicia a la primera página al cambiar búsqueda
  cargarClientes();
});


onMounted(cargarClientes);

const abrirModal = (cliente) => {
  clienteSeleccionado.value = cliente;
  modalVisible.value = true;
};

const cerrarModal = () => {
  modalVisible.value = false;
  clienteSeleccionado.value = {};
};

const eliminarCliente = async (id) => {
  if (!confirm("¿Seguro quieres eliminar este cliente?")) return;
  try {
    await $fetch(`/api/clientes/${id}`, { method: "DELETE" });
    clientes.value = await $fetch("/api/clientes");
  } catch (e) {
    error.value = "Error al eliminar cliente";
  }
};
</script>
