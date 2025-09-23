<template>
    <div class="max-w-4xl mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Clientes</h1>

        <div v-for="c in clientes" :key="c.id_cliente"
            class="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
            <div>
                <p class="text-lg font-semibold">{{ c.nombres }} {{ c.apellidos }}</p>
                <p class="text-gray-600">{{ c.telefono }} | {{ c.zona }}, {{ c.calle }} #{{ c.numero }}</p>
            </div>
            <div class="flex gap-2">
                <button @click="abrirModal(c)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Ver Detalles
                </button>
                <router-link :to="`/clientes/${c.id_cliente}`"
                    class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">
                    Editar
                </router-link>
                <button @click="eliminarCliente(c.id_cliente)"
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                    Eliminar
                </button>

            </div>
        </div>

        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

        <!-- Modal -->
        <div v-if="modalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white p-6 rounded shadow max-w-md w-full relative">
                <button @click="cerrarModal"
                    class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
                <h2 class="text-2xl font-bold mb-4">{{ clienteSeleccionado.nombres }} {{ clienteSeleccionado.apellidos
                    }}</h2>
                <p><strong>Teléfono:</strong> {{ clienteSeleccionado.telefono }}</p>
                <p><strong>Zona:</strong> {{ clienteSeleccionado.zona }}</p>
                <p><strong>Calle:</strong> {{ clienteSeleccionado.calle }}</p>
                <p><strong>Número:</strong> {{ clienteSeleccionado.numero }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { clientesService } from "~/server/services/clientesService";

const clientes = ref([]);
const error = ref("");

const modalVisible = ref(false);
const clienteSeleccionado = ref({});

const cargarClientes = async () => {
    try {
        clientes.value = await clientesService.listarClientes();
    } catch (e) {
        error.value = "Error al cargar clientes";
    }
};

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
    // Recargar lista
    clientes.value = await $fetch("/api/clientes");
  } catch (e) {
    error.value = "Error al eliminar cliente";
  }
};
</script>
