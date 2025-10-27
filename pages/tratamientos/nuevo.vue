<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button @click="router.push('/tratamientos')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50">
      ← Volver a Tratamientos
    </button>

    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🩺 Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">➕ Nuevo Tratamiento</h1>
        <p class="text-gray-500 text-sm mt-1">
          Registra un nuevo tratamiento para un paciente
        </p>
      </div>

      <!-- 🐶 Tarjeta del formulario -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarTratamiento" class="space-y-6">
          <!-- 🐾 Paciente -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🐾 Paciente</label>
            <select v-model="form.id_paciente"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="" disabled>Seleccione un paciente</option>
              <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <!-- 👤 Usuario -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">👤 Usuario</label>
            <input type="text" :value="usuarioNombre" disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 cursor-not-allowed" />
          </div>

          <!-- 🧩 Tipo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🧩 Tipo de tratamiento</label>
            <select v-model="form.tipo"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="" disabled>Seleccione el tipo de tratamiento</option>
              <option value="Vacunación">Vacunación</option>
              <option value="Desparasitación">Desparasitación</option>
              <option value="Limpieza dental">Limpieza dental</option>
              <option value="Revisión general">Revisión general</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <!-- 📅 Fecha inicio -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha Inicio</label>
            <input type="date" v-model="form.fecha_inicio" @blur="validarCampo('fecha_inicio')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- 💰 Costo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">💰 Costo (Bs)</label>
            <input v-model="form.costo" type="number" step="0.01" placeholder="Ej: 80.00" min="10" max="1500"
              @blur="validarCampo('costo')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
            <p class="text-sm text-gray-500 mt-1">
              Monto entre 10.00 y 1500.00 Bs (máx. 2 decimales)
            </p>
          </div>

          <!-- ⚙️ Estado -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">⚙️ Estado</label>
            <select v-model="form.estado"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="" disabled>Seleccione el estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>

          <!-- 🚨 Gravedad -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🚨 Gravedad</label>
            <select v-model="form.gravedad"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="" disabled>Seleccione la gravedad</option>
              <option value="leve">Leve</option>
              <option value="moderada">Moderada</option>
              <option value="grave">Grave</option>
            </select>
          </div>

          <!-- 🩹 Descripción -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🩹 Descripción</label>
            <textarea v-model="form.descripcion" rows="4" @blur="validarCampo('descripcion')"
              placeholder="Describe brevemente el tratamiento..."
              class="w-full border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- 💾 Botón guardar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Guardar Tratamiento
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ⚠️ ModalError -->
    <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useSupabaseUser } from "#imports"
import ModalError from "@/components/modalError.vue";

const router = useRouter()
const user = useSupabaseUser()

// 🧾 Estado del formulario
const form = reactive({
  id_paciente: "",
  id_usuario: 0,
  tipo: "",
  descripcion: "",
  fecha_inicio: new Date().toISOString().substr(0, 10),
  costo: "",
  estado: "",
  gravedad: ""
})

const pacientes = ref([])
const usuarioNombre = ref("")

// 🧩 ModalError
const modalVisible = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")

// Patrones prohibidos
const contienePatronesProhibidos = (texto) => {
  const patrones = [
    /select|insert|delete|update|drop|alter|union|--|;/i, // SQL
    /(script|<|>)/i, // Inyección HTML/JS
    /(.)\1{4,}/, // Repeticiones sospechosas (5+ caracteres iguales)
    /[!@#$%^&*()_+=\[\]{};':"\\|,.<>?\/~`¿¡]/i, // Caracteres especiales
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23FF}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{1F004}\u{1F170}-\u{1F251}]/gu, // Emojis y símbolos raros
  ];
  return patrones.some((p) => p.test(texto));
};

// Validar cantidad de números
const contarNumeros = (texto) => {
  const numeros = texto.match(/\d/g);
  return numeros ? numeros.length : 0;
};

// Palabras ofensivas
const contieneOfensas = (texto) => {
  const palabrasOfensivas = new RegExp(
    "\\b(" +
    [
      "idiota", "tonto", "estupido", "imbecil", "burro", "bobo", "tarado", "mongol",
      "retrasado", "animal", "bruto", "baboso", "pendejo", "gilipollas", "pelotudo",
      "boludo", "mierda", "maldito", "malparido", "culero", "cabr[oó]n", "zorra",
      "puta", "puto", "putita", "putilla", "maric[oó]n", "marica", "maricona",
      "negro", "negrata", "gordo", "cerdo", "perra", "perro",
      "infeliz", "babosa", "asqueroso", "asquerosa", "menso", "estupida", "idiotez", "inutil",
      "zopenco", "tarada", "huevon", "huev[oó]n", "hueva", "huevada", "cojudo", "cojud@",
      "pajero", "pajera", "verga", "vergazo", "chingar", "chingada", "chingado", "ching[oó]n",
      "chingona", "malnacido", "malnacida", "desgraciado", "desgraciada", "imb[eé]cil",
      "bastardo", "bastarda", "est[uú]pido", "maldita sea", "vete a la mierda", "vete al diablo",
      "carajo", "joder", "hostia", "polla", "culo", "co[oó]", "cagada", "cagar", "me cago",
      "mierd@", "mierd4", "p3ndej", "imb3cil", "idi0ta", "t0nto", "put@", "estup1do", "imb3c1l"
    ].join("|") +
    ")\\b",
    "i"
  );
  return palabrasOfensivas.test(texto);
};

// Validar texto
const validarTexto = (campo, nombre, min, max) => {
  if (!campo || campo.trim().length === 0) {
    return `${nombre} no puede contener solo espacios en blanco.`;
  }

  if (campo.trim().length < min || campo.trim().length > max) {
    return `${nombre} debe tener entre ${min} y ${max} caracteres.`;
  }

  const cantidadNumeros = contarNumeros(campo);
  if (cantidadNumeros > 3) {
    return `${nombre} no puede contener más de 3 números.`;
  }

  if (contienePatronesProhibidos(campo)) {
    return `${nombre} contiene caracteres no permitidos, emojis o símbolos especiales.`;
  }

  if (contieneOfensas(campo)) {
    return `${nombre} contiene palabras ofensivas o inapropiadas.`;
  }

  return null;
};

// Validar campo individual
const validarCampo = (campo) => {
  let error = null;

  switch (campo) {
    case 'descripcion':
      error = validarTexto(form.descripcion, "Descripción", 10, 200);
      break;
    case 'fecha_inicio':
      const hoy = new Date()
      const fechaSeleccionada = new Date(form.fecha_inicio)
      const diferenciaDias = (fechaSeleccionada - hoy) / (1000 * 60 * 60 * 24)

      if (fechaSeleccionada < new Date(hoy.toISOString().substr(0, 10))) {
        return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser anterior a hoy.")
      }

      if (diferenciaDias > 5) {
        return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser más de 5 días en el futuro.")
      }
      break;
    case 'costo':
      if (!form.costo || isNaN(form.costo)) {
        error = "Debe ingresar un costo válido.";
      } else if (form.costo < 10 || form.costo > 1500) {
        error = "El costo debe estar entre 10.00 y 1500.00 Bs.";
      } else if (!/^\d+(\.\d{1,2})?$/.test(form.costo)) {
        error = "El costo debe tener como máximo 2 decimales.";
      }
      break;
  }

  if (error) {
    mostrarModal("⚠️ Validación", error);
  }
};

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === "✅ Éxito") {
    router.push("/tratamientos")
  }
}

const mostrarModal = (titulo, mensaje) => {
  modalTitle.value = titulo
  modalMessage.value = mensaje
  modalVisible.value = true
}

function mostrarError(msg) {
  modalTitle.value = "⚠️ Error"
  modalMessage.value = msg
  modalVisible.value = true
}

onMounted(async () => {
  pacientes.value = await $fetch("/api/pacientes")
  if (user.value?.id) {
    const usuarioData = await $fetch(`/api/user/${user.value.id}`)
    form.id_usuario = usuarioData.id_usuario
    usuarioNombre.value = usuarioData.nombre
  }
})

// 💾 Guardar tratamiento
const guardarTratamiento = async () => {
  const hoy = new Date()
  const fechaSeleccionada = new Date(form.fecha_inicio)
  const diferenciaDias = (fechaSeleccionada - hoy) / (1000 * 60 * 60 * 24)


  if (!form.id_paciente) return mostrarError("Debe seleccionar un paciente.")
  if (!form.tipo) return mostrarError("Debe seleccionar un tipo de tratamiento.")

  if (fechaSeleccionada < new Date(hoy.toISOString().substr(0, 10))) {
    return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser anterior a hoy.")
  }

  if (diferenciaDias > 5) {
    return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser más de 5 días en el futuro.")
  }

  if (!form.costo || isNaN(form.costo))
    return mostrarError("Debe ingresar un costo válido.")
  if (form.costo < 10 || form.costo > 1500)
    return mostrarError("El costo debe estar entre 10.00 y 1500.00 Bs.")
  if (!/^\d+(\.\d{1,2})?$/.test(form.costo))
    return mostrarError("El costo debe tener como máximo 2 decimales.")

  if (!form.estado) return mostrarError("Debe seleccionar un estado.")
  if (!form.gravedad) return mostrarError("Debe seleccionar una gravedad.")

  if (!form.descripcion || form.descripcion.trim() === '') {
    return mostrarError("La descripción no puede estar vacía.")
  }

  const error = validarTexto(form.descripcion, "Descripción", 10, 200);
  if (error) return mostrarError(error)

  // Limpiar espacios en blanco
  form.descripcion = form.descripcion.trim();

  try {
    await $fetch("/api/tratamientos", { method: "POST", body: form })
    modalTitle.value = "✅ Éxito"
    modalMessage.value = "Tratamiento guardado correctamente."
    modalVisible.value = true
  } catch {
    mostrarError("No se pudo guardar el tratamiento.")
  }
}
</script>