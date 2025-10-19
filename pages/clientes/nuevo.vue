<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button
      @click="router.push('/clientes')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver a Clientes
    </button>

    <!-- Tarjeta central -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">➕ Nuevo Cliente</h1>
        <p class="text-gray-500 text-sm mt-1">Registra un nuevo cliente en el sistema</p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarCliente" class="space-y-6">
          <!-- Campos -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Nombres</label>
            <input v-model="cliente.nombres" type="text" placeholder="ej. Alberto"
              class="w-full border-black-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Apellidos</label>
            <input v-model="cliente.apellidos" type="text" placeholder="ej. Fernandez"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
            <input v-model="cliente.telefono" type="text" placeholder="+591 XXXXXXXX"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Zona</label>
            <input v-model="cliente.zona" type="text" placeholder="ej. Miraflores"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Calle</label>
            <input v-model="cliente.calle" type="text" placeholder="ej. Calle Hernando Siles"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Número</label>
            <input v-model="cliente.numero" type="text" placeholder="ej. #2355"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Botón guardar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Guardar Cliente
            </button>
          </div>

          <p v-if="error" class="text-red-500">{{ error }}</p>
          <p v-if="exito" class="text-green-500">Cliente registrado correctamente</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { clientesService } from "~/server/services/clientesService";

const router = useRouter();
const cliente = ref({ nombres: "", apellidos: "", telefono: "", zona: "", calle: "", numero: "" });
const error = ref("");
const exito = ref(false);
const clientes = ref([]);

onMounted(async () => {
  try {
    clientes.value = await clientesService.listarClientes();
  } catch (e) {
    console.error(e);
  }
});

const guardarCliente = async () => {
  error.value = "";
  exito.value = false;

  const duplicado = clientes.value.find(c =>
    c.nombres.toLowerCase() === cliente.value.nombres.toLowerCase() &&
    c.apellidos.toLowerCase() === cliente.value.apellidos.toLowerCase() &&
    c.telefono === cliente.value.telefono
  );
  if (duplicado) {
    error.value = "Ya existe un cliente con esos datos.";
    return;
  }

  try {
    await clientesService.crearCliente(cliente.value);
    exito.value = true;
    cliente.value = { nombres: "", apellidos: "", telefono: "", zona: "", calle: "", numero: "" };
  } catch (e) {
    error.value = "Error al registrar cliente";
  }
};
</script>
