<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative"
  >
    <!-- 🔙 Botón regresar -->
    <button
      @click="router.push('/pacientes')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver a Pacientes
    </button>

    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🩺 Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">🐶 Nuevo Paciente</h1>
        <p class="text-gray-500 text-sm mt-1">
          Registra un nuevo paciente en el sistema veterinario
        </p>
      </div>

      <!-- 🐾 Tarjeta del formulario -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarPaciente" class="space-y-6">
          <!-- 🧍 Cliente -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">👤 Cliente</label>
            <select
              v-model="paciente.id_cliente"
              required
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
            >
              <option value="" disabled>Selecciona un cliente</option>
              <option
                v-for="c in clientes"
                :key="c.id_cliente"
                :value="c.id_cliente"
              >
                {{ c.nombres }} {{ c.apellidos }}
              </option>
            </select>
          </div>

          <!-- Campos principales -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">🐾 Nombre</label>
              <input
                type="text"
                v-model="paciente.nombre"
                placeholder="Ej. Rocky"
                required
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🐕 Especie</label>
              <input
                type="text"
                v-model="paciente.especie"
                required
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🐩 Raza</label>
              <input
                type="text"
                v-model="paciente.raza"
                required
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🎂 Edad</label>
              <input
                type="number"
                v-model="paciente.edad"
                required
                min="0"
                max="25"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>
          </div>

          <!-- Más detalles -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">⚥ Sexo</label>
              <select
                v-model="paciente.sexo"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              >
                <option :value="true">Macho</option>
                <option :value="false">Hembra</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🎨 Color</label>
              <input
                type="text"
                v-model="paciente.color"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">📏 Tamaño (cm)</label>
              <input
                type="number"
                v-model="paciente.tamanocm"
                min="0"
                max="120"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">❤️ Estado Reproductivo</label>
              <input
                type="text"
                v-model="paciente.estado_reproductivo"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>
          </div>

          <!-- Opciones adicionales -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">🤰 Gestación</label>
              <select
                v-model="paciente.gestacion"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              >
                <option :value="true">Sí</option>
                <option :value="false">No</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🍖 Alimentación</label>
              <input
                type="text"
                v-model="paciente.alimentacion"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🩺 Cirugías Previas</label>
              <input
                type="text"
                v-model="paciente.cirugiasprevias"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">⚕️ Estado</label>
              <input
                type="text"
                v-model="paciente.estado"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>
          </div>

          <!-- Otros datos -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">⚖️ Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                v-model="paciente.peso"
                min="0.1"
                max="110"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">📷 Foto (URL)</label>
              <input
                type="text"
                v-model="paciente.foto_url"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              />
            </div>
          </div>

          <!-- 💾 Botón guardar -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
            >
              Crear Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <ModalError
    :visible="modalVisible"
    :title="modalTitle"
    :message="modalMessage"
    @close="handleModalClose"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ModalError from "@/components/modalError.vue";

const router = useRouter();
const clientes = ref([]);

const paciente = ref({
  id_cliente: null,
  nombre: "",
  especie: "",
  raza: "",
  edad: null,
  sexo: true,
  color: "",
  tamanocm: null,
  estado_reproductivo: "",
  gestacion: false,
  alimentacion: "",
  cirugiasprevias: "",
  estado: "",
  peso: null,
  foto_url: "",
});

const modalVisible = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

const handleModalClose = () => {
  modalVisible.value = false;
  if (modalTitle.value === "✅ Éxito") {
    router.push("/pacientes");
  }
};

onMounted(async () => {
  try {
    clientes.value = await $fetch("/api/clientes");
  } catch (e) {
    mostrarError("No se pudieron cargar los clientes.");
  }
});

const contienePatronesProhibidos = (texto) => {
  const patrones = [
    /select|insert|delete|update|drop|alter|--|;/i,
    /(script|<|>)/i,
    /(puta|mierda|idiota|imbecil|maldito)/i,
    /(.)\1{3,}/,
  ];
  return patrones.some((p) => p.test(texto));
};

const validarTexto = (campo, nombre, min, max) => {
  if (!campo || campo.trim().length < min || campo.trim().length > max)
    return `${nombre} debe tener entre ${min} y ${max} caracteres.`;
  if (contienePatronesProhibidos(campo))
    return `${nombre} contiene texto no permitido.`;
  return null;
};

const guardarPaciente = async () => {
  const p = paciente.value;

  if (!p.id_cliente)
    return mostrarError("El campo Cliente no puede estar vacío.");

  const errores = [
    validarTexto(p.nombre, "Nombre", 2, 40),
    validarTexto(p.especie, "Especie", 3, 30),
    validarTexto(p.raza, "Raza", 2, 30),
    p.edad < 0 || p.edad > 25 ? "La edad debe estar entre 0 y 25 años." : null,
    validarTexto(p.color, "Color", 3, 20),
    p.tamanocm < 0 || p.tamanocm > 120
      ? "El tamaño debe estar entre 0 y 120 cm."
      : null,
    validarTexto(p.estado_reproductivo, "Estado reproductivo", 3, 30),
    validarTexto(p.alimentacion, "Alimentación", 3, 50),
    p.peso < 0.1 || p.peso > 110
      ? "El peso debe estar entre 0.1 y 110 kg."
      : null,
  ].filter(Boolean);

  if (errores.length > 0) return mostrarError(errores[0]);

  try {
    await $fetch("/api/pacientes", { method: "POST", body: p });
    modalTitle.value = "✅ Éxito";
    modalMessage.value = "Paciente guardado correctamente.";
  } catch (err) {
    modalTitle.value = "❌ Error";
    modalMessage.value = err.data?.error || err.message;
  } finally {
    modalVisible.value = true;
  }
};

const mostrarError = (mensaje) => {
  modalTitle.value = "⚠️ Validación";
  modalMessage.value = mensaje;
  modalVisible.value = true;
};
</script>
