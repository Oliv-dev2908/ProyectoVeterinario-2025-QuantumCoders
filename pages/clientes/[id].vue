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
          <!-- Nombres -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Nombres</label>
            <input v-model="cliente.nombres" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <!-- Apellidos -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Apellidos</label>
            <input v-model="cliente.apellidos" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
            <div class="flex gap-2">
              <input type="text" value="+591" disabled
                class="w-20 border-gray-300 rounded-xl p-3 bg-gray-200 text-gray-700 cursor-not-allowed" />
              <input v-model="cliente.telefonoNum" type="text" placeholder="6XXXXXXX o 7XXXXXXX"
                class="flex-1 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                required />
            </div>
          </div>

          <!-- Zona -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Zona</label>
            <input v-model="cliente.zona" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Calle -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Calle</label>
            <input v-model="cliente.calle" type="text"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Número -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Número</label>
            <input v-model="cliente.numero" type="number" min="0" max="999999" placeholder="ej. 2355"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Botón actualizar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Actualizar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de error/éxito -->
    <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { clientesService } from "~/server/services/clientesService";
import ModalError from "~/components/ModalError.vue";

const route = useRoute();
const router = useRouter();
const cliente = ref({ nombres: "", apellidos: "", telefono: "", telefonoNum: "", zona: "", calle: "", numero: "" });
const clientes = ref([]);

const modalVisible = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

// Cargar cliente y lista de clientes
onMounted(async () => {
  try {
    clientes.value = await clientesService.listarClientes();
    const data = await clientesService.obtenerCliente(route.params.id);
    // Separar prefijo +591 del input editable
    cliente.value = { ...data, telefonoNum: data.telefono?.replace("+591", "") || "" };
  } catch (e) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "Error al cargar datos del cliente";
    modalVisible.value = true;
    console.error(e);
  }
});

const handleModalClose = () => {
  modalVisible.value = false;
  if (modalTitle.value === '✅ Éxito') {
    router.push('/clientes');
  }
};

// Validaciones
const contenidoValido = (texto) => {
  const ofensivo = /(malapalabra1|malapalabra2|<script>|DROP\s+TABLE|--|;)/i;
  const repetido = /(.)\1{3,}/; 
  return !ofensivo.test(texto) && !repetido.test(texto);
};

const validarTelefono = (tel) => /^[67]\d{7}$/.test(tel);
const validarNumeroCasa = (num) => /^\d{1,6}$/.test(num);

// Función para editar cliente
const editarCliente = async () => {
  // Validaciones de texto
  for (let campo of ["nombres", "apellidos", "zona", "calle"]) {
    if (!contenidoValido(cliente.value[campo])) {
      modalTitle.value = "❌ Error";
      modalMessage.value = `El campo "${campo}" contiene texto inválido o ofensivo`;
      modalVisible.value = true;
      return;
    }
  }

  // Validación teléfono
  if (!validarTelefono(cliente.value.telefonoNum)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "El teléfono debe empezar con 6 o 7 y tener 8 dígitos";
    modalVisible.value = true;
    return;
  }

  // Validación número de casa
  if (!validarNumeroCasa(cliente.value.numero)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "El número de casa solo puede tener entre 1 y 6 dígitos";
    modalVisible.value = true;
    return;
  }

  // Verificar duplicados
  const telefonoCompleto = "+591" + cliente.value.telefonoNum;
  const duplicado = clientes.value.find(c =>
    c.id_cliente !== cliente.value.id_cliente &&
    c.nombres.toLowerCase() === cliente.value.nombres.toLowerCase() &&
    c.apellidos.toLowerCase() === cliente.value.apellidos.toLowerCase() &&
    c.telefono === telefonoCompleto
  );

  if (duplicado) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "Ya existe un cliente con esos datos.";
    modalVisible.value = true;
    return;
  }

  // Actualizar cliente
  const clienteEnviar = { ...cliente.value, telefono: telefonoCompleto };

  try {
    await clientesService.actualizarCliente(cliente.value.id_cliente, clienteEnviar);
    modalTitle.value = "✅ Éxito";
    modalMessage.value = "Cliente actualizado correctamente";
    modalVisible.value = true;
  } catch (e) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "Error al actualizar cliente";
    modalVisible.value = true;
    console.error(e);
  }
};
</script>
