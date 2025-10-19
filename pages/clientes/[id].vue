<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button
      @click="router.push('/clientes')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver a Clientes
    </button>

    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">✏️ Editar Cliente</h1>
        <p class="text-gray-500 text-sm mt-1">Modifica los datos del cliente</p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="editarCliente" class="space-y-6">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Nombres</label>
            <input v-model="cliente.nombres" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Apellidos</label>
            <input v-model="cliente.apellidos" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
            <input v-model="cliente.telefono" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Zona</label>
            <input v-model="cliente.zona" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Calle</label>
            <input v-model="cliente.calle" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Número</label>
            <input v-model="cliente.numero" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Botón actualizar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Actualizar Cliente
            </button>
          </div>

          <p v-if="mensaje" class="text-green-500">{{ mensaje }}</p>
          <p v-if="error" class="text-red-500">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { clientesService } from "~/server/services/clientesService";

const route = useRoute();
const router = useRouter();
const cliente = ref({});
const mensaje = ref("");
const error = ref("");
const clientes = ref([]);

onMounted(async () => {
  try {
    clientes.value = await clientesService.listarClientes();
    const data = await clientesService.obtenerCliente(route.params.id);
    cliente.value = { ...data };
  } catch (e) {
    error.value = "Error al cargar datos del cliente";
    console.error(e);
  }
});

const editarCliente = async () => {
  mensaje.value = "";
  error.value = "";

  const duplicado = clientes.value.find(c =>
    c.id_cliente !== cliente.value.id_cliente &&
    c.nombres.toLowerCase() === cliente.value.nombres.toLowerCase() &&
    c.apellidos.toLowerCase() === cliente.value.apellidos.toLowerCase() &&
    c.telefono === cliente.value.telefono
  );
  if (duplicado) {
    error.value = "Ya existe un cliente con esos datos.";
    return;
  }

  try {
    await clientesService.actualizarCliente(cliente.value.id_cliente, cliente.value);
    mensaje.value = "Cliente actualizado correctamente";
  } catch (e) {
    error.value = "Error al actualizar cliente";
    console.error(e);
  }
};
</script>
