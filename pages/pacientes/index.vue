<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">🐶 Pacientes</h1>
          <p class="text-gray-500 text-sm mt-1">Gestión integral de pacientes veterinarios</p>
        </div>

        <router-link
          to="/pacientes/nuevo"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          ➕ Nuevo Paciente
        </router-link>
      </div>

      <!-- 🧾 Tabla de pacientes -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm">
              <th class="p-3">ID</th>
              <th class="p-3">Nombre</th>
              <th class="p-3">Especie</th>
              <th class="p-3">Raza</th>
              <th class="p-3">Edad</th>
              <th class="p-3">Sexo</th>
              <th class="p-3">Cliente</th>
              <th class="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in pacientes"
              :key="p.id_paciente"
              class="border-t hover:bg-teal-50 transition"
            >
              <td class="p-3 font-medium">{{ p.id_paciente }}</td>
              <td class="p-3">{{ p.nombre }}</td>
              <td class="p-3">{{ p.especie }}</td>
              <td class="p-3">{{ p.raza }}</td>
              <td class="p-3">{{ p.edad }}</td>
              <td class="p-3">{{ p.sexo ? 'Macho' : 'Hembra' }}</td>
              <td class="p-3">{{ p.id_cliente }}</td>
              <td class="p-3 flex justify-center gap-2 flex-wrap">
                <button
                  @click="abrirModal(p)"
                  class="text-green-600 hover:text-green-800 font-medium"
                >
                  👁️ Ver
                </button>
                <router-link
                  :to="`/pacientes/${p.id_paciente}`"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ✏️ Editar
                </router-link>
                <router-link
                  :to="`/pacientes/${p.id_paciente}/archivos`"
                  class="text-purple-600 hover:text-purple-800 font-medium"
                >
                  📁 Expediente
                </router-link>
                <button
                  @click="irAReportes(p.id_paciente)"
                  class="text-teal-600 hover:text-teal-800 font-medium"
                >
                  📊 Reportes
                </button>
                <button
                  @click="eliminarPaciente(p.id_paciente)"
                  class="text-red-500 hover:text-red-700 font-medium"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>

            <!-- Estado vacío -->
            <tr v-if="pacientes.length === 0">
              <td colspan="8" class="p-6 text-center text-gray-500">
                🐾 No hay pacientes registrados aún
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div
        v-if="modalVisible"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
      >
        <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200">
          <button
            @click="cerrarModal"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>

          <div class="flex flex-col items-center">
            <img
              :src="pacienteSeleccionado.foto_url"
              alt="Foto Mascota"
              class="w-32 h-32 object-cover rounded-full mb-4 shadow-md border"
            />
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              {{ pacienteSeleccionado.nombre }} - {{ pacienteSeleccionado.especie }}
            </h2>
          </div>

          <div class="space-y-1 text-gray-700 text-sm">
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

          <!-- Acciones en el modal -->
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <button
              @click="abrirModalCirugias(pacienteSeleccionado.id_paciente)"
              class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-5 py-2 rounded-lg shadow transition"
            >
              🩺 Cirugías
            </button>
            <button
              @click="abrirModalTratamientos(pacienteSeleccionado.id_paciente)"
              class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-5 py-2 rounded-lg shadow transition"
            >
              💊 Tratamientos
            </button>
            <button
              @click="abrirModalFisioterapias(pacienteSeleccionado.id_paciente)"
              class="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold px-5 py-2 rounded-lg shadow transition"
            >
              🐾 Fisioterapias
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "#imports";
import { pacientesService } from "~/server/services/pacientesService";
import CirugiasModal from "~/components/cirugiasModal.vue";
import TratamientosModal from "~/components/tratamientosModal.vue";

const router = useRouter();

const pacientes = ref([]);
const error = ref("");

const modalVisible = ref(false);
const pacienteSeleccionado = ref({});

const cirugiasModalVisible = ref(false);
const pacienteIdCirugias = ref(null);

const tratamientosModalVisible = ref(false);
const pacienteIdTratamientos = ref(null);

const fisioterapiaModalVisible = ref(false);
const pacienteIdFisioterapias = ref(null);

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

const abrirModalCirugias = (idPaciente) => {
  pacienteIdCirugias.value = idPaciente;
  cirugiasModalVisible.value = true;
};

const abrirModalTratamientos = (idPaciente) => {
  pacienteIdTratamientos.value = idPaciente;
  tratamientosModalVisible.value = true;
};

const abrirModalFisioterapias = (idPaciente) => {
  pacienteIdFisioterapias.value = idPaciente;
  fisioterapiaModalVisible.value = true;
};

const irAReportes = (idPaciente) => {
  router.push(`/reportes/${idPaciente}`);
};
</script>
