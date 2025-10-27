<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button @click="router.push('/pacientes')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50">
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
            <select v-model="paciente.id_cliente" required
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="" disabled>Selecciona un cliente</option>
              <option v-for="c in clientes" :key="c.id_cliente" :value="c.id_cliente">
                {{ c.nombres }} {{ c.apellidos }}
              </option>
            </select>
          </div>

          <!-- Campos principales -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">🐾 Nombre</label>
              <input type="text" v-model="paciente.nombre" @blur="validarCampo('nombre')" placeholder="Ej. Rocky"
                required
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🐕 Especie</label>
              <select v-model="paciente.especie" @blur="validarCampo('especie')" required
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
                <option value="" disabled>Selecciona una especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Conejo">Conejo</option>
                <option value="Hamster">Hamster</option>
                <option value="Ave">Ave</option>
                <option value="Reptil">Reptil</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🐩 Raza</label>
              <input type="text" v-model="paciente.raza" @blur="validarCampo('raza')" required
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🎂 Edad</label>
              <input type="number" v-model="paciente.edad" @blur="validarCampo('edad')" required min="0" max="25"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>
          </div>

          <!-- Más detalles -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">⚥ Sexo</label>
              <select v-model="paciente.sexo"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
                <option :value="true">Macho</option>
                <option :value="false">Hembra</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🎨 Color</label>
              <input type="text" v-model="paciente.color" @blur="validarCampo('color')"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">📏 Tamaño (cm)</label>
              <input type="number" v-model="paciente.tamanocm" @blur="validarCampo('tamanocm')" min="0" max="120"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">❤️ Estado Reproductivo</label>
              <input type="text" v-model="paciente.estado_reproductivo" @blur="validarCampo('estado_reproductivo')"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>
          </div>

          <!-- Opciones adicionales -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">🤰 Gestación</label>
              <select v-model="paciente.gestacion"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
                <option :value="true">Sí</option>
                <option :value="false">No</option>
              </select>
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🍖 Alimentación</label>
              <input type="text" v-model="paciente.alimentacion" @blur="validarCampo('alimentacion')"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">🩺 Cirugías Previas</label>
              <input type="text" v-model="paciente.cirugiasprevias" @blur="validarCampo('cirugiasprevias')"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">⚕️ Estado</label>
              <input type="text" v-model="paciente.estado" @blur="validarCampo('estado')"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>
          </div>

          <!-- Otros datos -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">⚖️ Peso (kg)</label>
              <input type="number" step="0.1" v-model="paciente.peso" @blur="validarCampo('peso')" min="0.1" max="110"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">📷 Foto (URL)</label>
              <input type="text" v-model="paciente.foto_url"
                class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            </div>
          </div>

          <!-- 💾 Botón guardar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Crear Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />
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

// Rastrear qué campos opcionales han sido modificados
const camposModificados = ref({
  color: false,
  estado_reproductivo: false,
  alimentacion: false,
  cirugiasprevias: false,
  estado: false,
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
    /\b(select|insert|delete|update|drop|alter|create|union|exec|--)\b/i, // SQL común
    /<\s*(script|iframe|img|svg|object|embed|link|style)\b/i,            // tags HTML/JS peligrosos
    /\bon\w+\s*=/i,                                                     // handlers JS (onclick=, onerror=)
    /\b(javascript|vbscript|data):/i,                                   // esquemas peligrosos
    /(https?:\/\/[^\s]+)/i,                                             // URLs
    /\.\.\/|\/\.\./,                                                    // path traversal (../)
    /\b(puta|puto|mierda|idiota|imbecil|maldito|estupido|joder|coño|pendejo|zorra|bitch|fuck)\b/i, // malas palabras comunes
    /(.)\1{3,}/,                                                         // repeticiones sospechosas (aaaa, !!!!)
    /[<>;"'`]/,                                                          // caracteres problemáticos en XSS/atributos
    /\b\d{4,}\b/,                                                         // números largos (grupos de 4+ dígitos: tarjetas, IDs)
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23FF}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{1F004}\u{1F170}-\u{1F251}]/gu, // Emojis y símbolos raros
  ];

  return patrones.some((p) => p.test(texto));
};

const validarTexto = (campo, nombre, min, max) => {
  // Verificar si el campo está vacío o solo tiene espacios
  if (!campo || campo.trim().length === 0) {
    return `${nombre} no puede contener solo espacios en blanco.`;
  }

  if (campo.trim().length < min || campo.trim().length > max) {
    return `${nombre} debe tener entre ${min} y ${max} caracteres.`;
  }

  if (contienePatronesProhibidos(campo)) {
    return `${nombre} no puede contener números ni caracteres especiales.`;
  }

  return null;
};

const validarCampo = (campo) => {
  const p = paciente.value;
  let error = null;

  // Marcar campo como modificado si es opcional
  if (['color', 'estado_reproductivo', 'alimentacion', 'cirugiasprevias', 'estado'].includes(campo)) {
    if (p[campo] !== null && p[campo] !== undefined && p[campo] !== '') {
      camposModificados.value[campo] = true;
    }
  }

  switch (campo) {
    case 'nombre':
      error = validarTexto(p.nombre, "Nombre", 2, 40);
      break;
    case 'especie':
      if (!p.especie) error = "Debe seleccionar una especie.";
      break;
    case 'raza':
      error = validarTexto(p.raza, "Raza", 2, 30);
      break;
    case 'edad':
      if (p.edad === null || p.edad === '' || p.edad < 0 || p.edad > 30) {
        error = "La edad debe estar entre 0 y 30 años.";
      }
      break;
    case 'color':
      // Solo validar si el usuario escribió algo
      if (camposModificados.value.color && p.color !== null && p.color !== undefined) {
        error = validarTexto(p.color, "Color", 3, 20);
      }
      break;
    case 'tamanocm':
      if (p.tamanocm !== null && p.tamanocm !== '' && (p.tamanocm < 10 || p.tamanocm > 120)) {
        error = "El tamaño debe estar entre 10cm y 120cm.";
      }
      break;
    case 'estado_reproductivo':
      if (camposModificados.value.estado_reproductivo && p.estado_reproductivo !== null && p.estado_reproductivo !== undefined) {
        error = validarTexto(p.estado_reproductivo, "Estado Reproductivo", 3, 30);
      }
      break;
    case 'alimentacion':
      if (camposModificados.value.alimentacion && p.alimentacion !== null && p.alimentacion !== undefined) {
        error = validarTexto(p.alimentacion, "Alimentación", 3, 40);
      }
      break;
    case 'cirugiasprevias':
      if (camposModificados.value.cirugiasprevias && p.cirugiasprevias !== null && p.cirugiasprevias !== undefined) {
        error = validarTexto(p.cirugiasprevias, "Cirugías Previas", 3, 60);
      }
      break;
    case 'estado':
      if (camposModificados.value.estado && p.estado !== null && p.estado !== undefined) {
        error = validarTexto(p.estado, "Estado", 3, 40);
      }
      break;
    case 'peso':
      if (p.peso !== null && p.peso !== '' && (p.peso < 1 || p.peso > 110)) {
        error = "El peso debe estar entre 1kg y 110kg.";
      }
      break;
  }

  if (error) {
    mostrarError(error);
  }
};

// --- 💾 GUARDAR PACIENTE ---
const guardarPaciente = async () => {
  const p = paciente.value;

  // Campo obligatorio
  if (!p.id_cliente)
    return mostrarError("El campo Cliente no puede estar vacío.");

  // Validaciones obligatorias
  const errores = [
    validarTexto(p.nombre, "Nombre", 2, 40),
    !p.especie ? "Debe seleccionar una especie." : null,
    validarTexto(p.raza, "Raza", 2, 30),
    p.edad === null || p.edad < 0 || p.edad > 25
      ? "La edad debe estar entre 0 y 25 años."
      : null,
    p.tamanocm === null || p.tamanocm < 10 || p.tamanocm > 120
      ? "El tamaño del animal debe estar entre 10cm y 120cm."
      : null,
    p.peso === null || p.peso < 1 || p.peso > 110
      ? "El peso del animal debe estar entre 1kg y 110kg"
      : null,
  ];

  // Validaciones condicionales (solo si el campo fue modificado)
  if (camposModificados.value.color && p.color !== null && p.color !== undefined && p.color !== '') {
    errores.push(validarTexto(p.color, "Color", 3, 20));
  }
  if (camposModificados.value.estado_reproductivo && p.estado_reproductivo !== null && p.estado_reproductivo !== undefined && p.estado_reproductivo !== '') {
    errores.push(validarTexto(p.estado_reproductivo, "Estado Reproductivo", 3, 30));
  }
  if (camposModificados.value.alimentacion && p.alimentacion !== null && p.alimentacion !== undefined && p.alimentacion !== '') {
    errores.push(validarTexto(p.alimentacion, "Alimentación", 3, 40));
  }
  if (camposModificados.value.cirugiasprevias && p.cirugiasprevias !== null && p.cirugiasprevias !== undefined && p.cirugiasprevias !== '') {
    errores.push(validarTexto(p.cirugiasprevias, "Cirugías Previas", 3, 60));
  }
  if (camposModificados.value.estado && p.estado !== null && p.estado !== undefined && p.estado !== '') {
    errores.push(validarTexto(p.estado, "Estado", 3, 40));
  }

  // Limpiar campos opcionales que solo contienen espacios
  if (p.color && p.color.trim() === '') p.color = '';
  if (p.estado_reproductivo && p.estado_reproductivo.trim() === '') p.estado_reproductivo = '';
  if (p.alimentacion && p.alimentacion.trim() === '') p.alimentacion = '';
  if (p.cirugiasprevias && p.cirugiasprevias.trim() === '') p.cirugiasprevias = '';
  if (p.estado && p.estado.trim() === '') p.estado = '';

  // 🚫 Si hay errores, mostramos el primero
  const error = errores.find((e) => e);
  if (error) return mostrarError(error);

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

// Mostrar errores de validación
const mostrarError = (mensaje) => {
  modalTitle.value = "⚠️ Validación";
  modalMessage.value = mensaje;
  modalVisible.value = true;
};
</script>