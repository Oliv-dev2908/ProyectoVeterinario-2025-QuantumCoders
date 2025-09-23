<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Pacientes</h1>

    <div v-for="p in pacientes" :key="p.id_paciente"
      class="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">
      <div>
        <p class="text-lg font-semibold">{{ p.nombre }} - {{ p.especie }} ({{ p.raza }})</p>
        <p class="text-gray-600">Edad: {{ p.edad }} años | Sexo: {{ p.sexo ? 'Macho' : 'Hembra' }}</p>
      </div>
      <div class="flex gap-2">
        <button @click="abrirModal(p)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Ver Detalles
        </button>
        <router-link :to="`/pacientes/${p.id_paciente}`"
          class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">
          Editar
        </router-link>
        <button @click="eliminarPaciente(p.id_paciente)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
          Eliminar
        </button>
      </div>
    </div>

    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

    <!-- Modal -->
    <div v-if="modalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow max-w-md w-full relative">
        <button @click="cerrarModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>

        <div class="flex flex-col items-center">
          <img :src="pacienteSeleccionado.foto_url" alt="Foto Mascota"
            class="w-32 h-32 object-cover rounded-full mb-4" />
          <h2 class="text-2xl font-bold mb-2">{{ pacienteSeleccionado.nombre }} - {{ pacienteSeleccionado.especie }}
          </h2>
        </div>

        <p><strong>Raza:</strong> {{ pacienteSeleccionado.raza }}</p>
        <p><strong>Edad:</strong> {{ pacienteSeleccionado.edad }} años</p>
        <p><strong>Sexo:</strong> {{ pacienteSeleccionado.sexo ? 'Macho' : 'Hembra' }}</p>
        <p><strong>Color:</strong> {{ pacienteSeleccionado.color }}</p>
        <p><strong>Tamaño (cm):</strong> {{ pacienteSeleccionado.tamanocm }}</p>
        <p><strong>Estado reproductivo:</strong> {{ pacienteSeleccionado.estado_reproductivo }}</p>
        <p><strong>Gestación:</strong> {{ pacienteSeleccionado.gestacion ? 'Sí' : 'No' }}</p>
        <p><strong>Alimentación:</strong> {{ pacienteSeleccionado.alimentacion }}</p>
        <p><strong>Cirugías previas:</strong> {{ pacienteSeleccionado.cirugiasprevias }}</p>
        <p><strong>Estado de salud:</strong> {{ pacienteSeleccionado.estado }}</p>
        <p><strong>Estado corporal:</strong> {{ pacienteSeleccionado.estado_corporal }}</p>
        <p><strong>Peso:</strong> {{ pacienteSeleccionado.peso }} kg</p>
        <p><strong>Cliente:</strong> {{ pacienteSeleccionado.id_cliente }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { pacientesService } from "~/server/services/pacientesService";

const pacientes = ref([]);
const error = ref("");

const modalVisible = ref(false);
const pacienteSeleccionado = ref({});

const cargarPacientes = async () => {
  try {
    pacientes.value = await pacientesService.listarPacientes();
  } catch (e) {
    error.value = "Error al cargar pacientes";
  }
};

onMounted(cargarPacientes);

const abrirModal = (paciente) => {
  pacienteSeleccionado.value = paciente;
  modalVisible.value = true;
};

const cerrarModal = () => {
  modalVisible.value = false;
  pacienteSeleccionado.value = {};
};

const eliminarPaciente = async (id) => {
  if (!confirm("¿Seguro quieres eliminar este paciente?")) return;

  try {
    await $fetch(`/api/pacientes/${id}`, { method: "DELETE" });
    pacientes.value = await $fetch("/api/pacientes");
  } catch (e) {
    error.value = "Error al eliminar paciente";
  }
};
</script>
