<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Editar Cliente</h1>

    <form @submit.prevent="editarCliente" class="space-y-4">

      <div>
        <label class="block font-medium">Nombres</label>
        <input type="text" v-model="cliente.nombres" required class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Apellidos</label>
        <input type="text" v-model="cliente.apellidos" required class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Teléfono</label>
        <input type="text" v-model="cliente.telefono" required class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Zona</label>
        <input type="text" v-model="cliente.zona" class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Calle</label>
        <input type="text" v-model="cliente.calle" class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Número</label>
        <input type="text" v-model="cliente.numero" class="border p-2 w-full rounded" />
      </div>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Guardar Cambios
      </button>

      <p v-if="mensaje" class="text-green-500">{{ mensaje }}</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { clientesService } from "~/server/services/clientesService";

const route = useRoute();
const cliente = ref({});
const mensaje = ref("");
const error = ref("");
const clientes = ref([]);

onMounted(async () => {
  try {
    cliente.value = await clientesService.obtenerCliente(route.params.id);
    clientes.value = await clientesService.listarClientes();
  } catch (e) {
    error.value = "Error al cargar datos del cliente";
    console.error(e);
  }
});

const editarCliente = async () => {
  mensaje.value = "";
  error.value = "";

  // Validar duplicados
  const duplicado = clientes.value.find(c =>
    c.id_cliente !== cliente.value.id_cliente &&
    c.nombres.toLowerCase() === cliente.value.nombres.toLowerCase() &&
    c.apellidos.toLowerCase() === cliente.value.apellidos.toLowerCase() &&
    c.telefono === cliente.value.telefono
  );

  if (duplicado) {
    error.value = "Ya existe un cliente con esos datos. Verifica duplicados.";
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

