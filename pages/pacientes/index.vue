<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">🐶 Pacientes</h1>
          <p class="text-gray-500 text-sm mt-1">Gestión integral de pacientes veterinarios</p>
        </div>

        <router-link to="/pacientes/nuevo"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition">
          ➕ Nuevo Paciente
        </router-link>
      </div>

      <!-- 🔍 Barra de búsqueda -->
<div class="mb-6">
  <input
    v-model="busqueda"
    type="text"
    placeholder="🔍 Buscar mascota por nombre..."
    class="w-full max-w-md px-4 py-2 rounded-xl border border-gray-300
           focus:outline-none focus:ring-2 focus:ring-teal-400
           shadow-sm transition"
  />
</div>


      <!-- 🧾 Tabla de pacientes -->
      <div v-if="cargando" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
      <div v-else class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm">
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
            <tr v-for="p in pacientesFiltrados" :key="p.id_paciente" class="border-t hover:bg-teal-50 transition">
              <td class="p-3">{{ p.nombre }}</td>
              <td class="p-3">{{ p.especie }}</td>
              <td class="p-3">{{ p.raza }}</td>
              <td class="p-3">{{ p.edad }}</td>
              <td class="p-3">{{ p.sexo ? 'Macho' : 'Hembra' }}</td>
              <td class="p-3">{{ p.cliente_nombre + " " + p.cliente_apellido }}</td>
              <td class="p-3 flex justify-center gap-2 flex-wrap">
                <button @click="abrirModal(p)" class="text-green-600 hover:text-green-800 font-medium">
                  👁️ Ver
                </button>
                <router-link :to="`/pacientes/${p.id_paciente}`" class="text-blue-600 hover:text-blue-800 font-medium">
                  ✏️ Editar
                </router-link>
                <router-link :to="`/pacientes/${p.id_paciente}/archivos`"
                  class="text-purple-600 hover:text-purple-800 font-medium">
                  📁 Expediente
                </router-link>
                <button @click="irAReportes(p.id_paciente)" class="text-teal-600 hover:text-teal-800 font-medium">
                  📊 Reportes
                </button>
                <button @click="abrirModalConfirm(p)" class="text-red-500 hover:text-red-700 font-medium">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>

            <!-- Estado vacío -->
            <tr v-if="pacientesFiltrados.length === 0">
  <td colspan="8" class="p-6 text-center text-gray-500">
    🐾 No se encontraron pacientes
  </td>
</tr>

          </tbody>
        </table>
      </div>

      <!-- 📄 Paginación -->
      <div class="flex justify-center items-center gap-4 mt-6">
        <button @click="pagina--, cargarPacientes()" :disabled="pagina === 1"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
          ◀ Anterior
        </button>

        <span class="font-semibold text-gray-700">
          Página {{ pagina }} de {{ Math.ceil(total / limite) }}
        </span>

        <button @click="pagina++, cargarPacientes()" :disabled="pagina >= Math.ceil(total / limite)"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">
          Siguiente ▶
        </button>
      </div>


      <!-- Modal -->
      <div v-if="modalVisible"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
        <div class="relative bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200">
          <button @click="cerrarModal"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none">
            &times;
          </button>

          <div class="flex flex-col items-center">
            <img :src="pacienteSeleccionado.foto_url" alt="Foto Mascota"
              class="w-32 h-32 object-cover rounded-full mb-4 shadow-md border" />
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
            <p><strong>Cliente:</strong> {{ pacienteSeleccionado.cliente_nombre + " " +
              pacienteSeleccionado.cliente_apellido }}</p>
          </div>

          <!-- Acciones en el modal -->
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <button @click="abrirModalCirugias(pacienteSeleccionado.id_paciente)"
              class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-5 py-2 rounded-lg shadow transition">
              🩺 Cirugías
            </button>
            <button @click="abrirModalTratamientos(pacienteSeleccionado.id_paciente)"
              class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-5 py-2 rounded-lg shadow transition">
              💊 Tratamientos
            </button>
            <button @click="abrirModalFisioterapias(pacienteSeleccionado.id_paciente)"
              class="bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold px-5 py-2 rounded-lg shadow transition">
              🐾 Fisioterapias
            </button>
          </div>
        </div>
      </div>
      <CirugiasModal :pacienteId="pacienteIdCirugias" v-model:visible="cirugiasModalVisible"
        :paciente="pacienteSeleccionado" />

      <!-- Modal de tratamientos -->
      <TratamientosModal :pacienteId="pacienteIdTratamientos" v-model:visible="tratamientosModalVisible"
        :paciente="pacienteSeleccionado" />

      <!-- Modal de fisioterapias -->
      <FisioterapiasModal :pacienteId="pacienteIdFisioterapias" v-model:visible="fisioterapiaModalVisible"
        :paciente="pacienteSeleccionado" />
    </div>

    <ConfirmacionModal v-model="showConfirm" :itemName="pacienteSeleccionado?.nombre" title="Eliminar paciente"
      message="¿Estás seguro de eliminar este paciente? Esto eliminara todos los datos asociados con el paciente"
      @confirm="confirmarEliminarPaciente">
    </ConfirmacionModal>

    <ExitoModal v-model="showExito" title="Paciente eliminado" message="El paciente ha sido eliminado exitosamente" />

  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "#imports";
import { pacientesService } from "~/server/services/pacientesService";
import CirugiasModal from '~/components/cirugiasModal.vue';
import TratamientosModal from '~/components/tratamientosModal.vue';
import FisioterapiasModal from '~/components/fisioterapiasModal.vue';
import ConfirmacionModal from "@/components/confirmacionModal.vue"
import ExitoModal from "@/components/exitoModal.vue";


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

const showConfirm = ref(false);
const showExito = ref(false);

const busqueda = ref("");

// 🔍 Filtrar pacientes por nombre
const pacientesFiltrados = computed(() => {
  if (!busqueda.value) return pacientes.value;

  return pacientes.value.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  );
});



const cargarPacientes = async () => {
  cargando.value = true; // empieza a cargar
  try {
    const pacientesApi = await $fetch("/api/pacientes");

    const pacientesConCliente = await Promise.all(
      pacientesApi.map(async (p) => {
        try {
          const cliente = await $fetch(`/api/clientes/${p.id_cliente}`);
          return {
            ...p,
            cliente_nombre: cliente?.nombres || "Sin asignar",
            cliente_apellido: cliente?.apellidos || "Sin asignar",
          };
        } catch {
          return { ...p, cliente_nombre: "Sin asignar", cliente_apellido: "" };
        }
      })
    );

    // Filtrado
    let filtrados = pacientesConCliente.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      `${p.cliente_nombre} ${p.cliente_apellido}`.toLowerCase().includes(busqueda.value.toLowerCase())
    );

    total.value = filtrados.length;

    // Paginación
    const inicio = (pagina.value - 1) * limite;
    pacientes.value = filtrados.slice(inicio, inicio + limite);

  } catch (err) {
    console.error("Error cargando pacientes:", err);
    error.value = "Error al cargar pacientes";
    pacientes.value = [];
  } finally {
    cargando.value = false; // termina de cargar
  }
};

watch(busqueda, () => {
  pagina.value = 1; // reinicia a la primera página al cambiar búsqueda
  cargarPacientes();
});

onMounted(cargarPacientes);

const abrirModal = (paciente) => {
  pacienteSeleccionado.value = paciente;
  modalVisible.value = true;
};

const abrirModalConfirm = (paciente) => {
  pacienteSeleccionado.value = paciente
  showConfirm.value = true
}


const cerrarModal = () => {
  modalVisible.value = false;
  pacienteSeleccionado.value = {};
};

const confirmarEliminarPaciente = async () => {
  if (!pacienteSeleccionado.value?.id_paciente) return;
  try {
    await pacientesService.eliminarPaciente(pacienteSeleccionado.value.id_paciente);
    await cargarPacientes();
    showConfirm.value = false;
    pacienteSeleccionado.value = {};
    showExito.value = true; // ✅ Mostrar modal de éxito
  } catch (e) {
    error.value = "Error al eliminar paciente";
    console.error(e);
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
