<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4">Editar Paciente</h1>

    <form @submit.prevent="editarPaciente" class="space-y-4">

      <div>
        <label class="block font-medium">Nombre</label>
        <input type="text" v-model="paciente.nombre" required class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Especie</label>
        <input type="text" v-model="paciente.especie" required class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Raza</label>
        <input type="text" v-model="paciente.raza" class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Edad</label>
        <input type="number" v-model="paciente.edad" class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Sexo</label>
        <select v-model="paciente.sexo" class="border p-2 w-full rounded">
          <option :value="true">Macho</option>
          <option :value="false">Hembra</option>
        </select>
      </div>

      <div>
        <label class="block font-medium">Color</label>
        <input type="text" v-model="paciente.color" class="border p-2 w-full rounded" />
      </div>

      <div>
        <label class="block font-medium">Cliente</label>
        <select v-model="paciente.id_cliente" class="border p-2 w-full rounded">
          <option v-for="cliente in clientes" :key="cliente.id_cliente" :value="cliente.id_cliente">
            {{ cliente.nombres }} {{ cliente.apellidos }}
          </option>
        </select>
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
import { pacientesService } from "~/server/services/pacientesService";
import { clientesService } from "~/server/services/clientesService";

const route = useRoute();
const paciente = ref({});
const clientes = ref([]);
const mensaje = ref("");
const error = ref("");

onMounted(async () => {
  try {
    paciente.value = await pacientesService.obtenerPaciente(route.params.id);
    clientes.value = await clientesService.listarClientes();
  } catch (e) {
    error.value = "Error al cargar datos del paciente";
    console.error(e);
  }
});

const editarPaciente = async () => {
  mensaje.value = "";
  error.value = "";

  try {
    await pacientesService.actualizarPaciente(route.params.id, paciente.value);
    mensaje.value = "Paciente actualizado correctamente";
  } catch (e) {
    error.value = "Error al actualizar paciente";
    console.error(e);
  }
};
</script>
