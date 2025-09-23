<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-xl font-bold mb-4">Nuevo Cliente</h1>

    <form @submit.prevent="guardarCliente" class="space-y-4">
      <div>
        <label class="block font-semibold">Nombres</label>
        <input v-model="cliente.nombres" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block font-semibold">Apellidos</label>
        <input v-model="cliente.apellidos" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block font-semibold">Teléfono</label>
        <input v-model="cliente.telefono" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block font-semibold">Zona</label>
        <input v-model="cliente.zona" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block font-semibold">Calle</label>
        <input v-model="cliente.calle" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div>
        <label class="block font-semibold">Número</label>
        <input v-model="cliente.numero" type="text" class="w-full border p-2 rounded" required />
      </div>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>

      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      <p v-if="exito" class="text-green-500 mt-2">Cliente registrado correctamente</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { clientesService } from "~/server/services/clientesService";

const cliente = ref({
  nombres: "",
  apellidos: "",
  telefono: "",
  zona: "",
  calle: "",
  numero: "",
});

const error = ref("");
const exito = ref(false);
const clientes = ref([]);

// Traer todos los clientes para validar duplicados
onMounted(async () => {
  try {
    clientes.value = await clientesService.listarClientes();
  } catch (e) {
    console.error("Error al cargar clientes", e);
  }
});

const guardarCliente = async () => {
  error.value = "";
  exito.value = false;

  // Validar duplicados
  const duplicado = clientes.value.find(c =>
    c.nombres.toLowerCase() === cliente.value.nombres.toLowerCase() &&
    c.apellidos.toLowerCase() === cliente.value.apellidos.toLowerCase() &&
    c.telefono === cliente.value.telefono
  );

  if (duplicado) {
    error.value = "Ya existe un cliente con esos datos. Verifica duplicados.";
    return;
  }

  try {
    await clientesService.crearCliente(cliente.value);
    exito.value = true;
    // limpiar formulario
    cliente.value = {
      nombres: "",
      apellidos: "",
      telefono: "",
      zona: "",
      calle: "",
      numero: "",
    };
  } catch (e) {
    error.value = "Error al registrar cliente";
    console.error(e);
  }
};
</script>
