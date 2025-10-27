<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button @click="router.push('/fisioterapias')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50">
      ← Volver a Fisioterapias
    </button>

    <!-- Tarjeta central -->
    <div class="w-full max-w-3xl p-8 ml-65">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">🧘‍♂️ Nueva Fisioterapia</h1>
        <p class="text-gray-500 text-sm mt-1">Registra una nueva sesión de fisioterapia</p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarFisioterapia" class="space-y-6">
          <!-- Paciente -->
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

          <!-- Usuario -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Usuario</label>
            <input type="text" :value="usuarioNombre" disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
          </div>

          <!-- Fecha -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Fecha</label>
            <input type="date" v-model="form.fecha" @blur="validarCampo('fecha')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Procedimiento -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Procedimiento</label>
            <textarea v-model="form.procedimiento" @blur="validarCampo('procedimiento')"
              placeholder="Describe el procedimiento"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Botón guardar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Guardar Fisioterapia
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 🧩 Modal de errores -->
    <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue"
import { useSupabaseUser, useRouter } from "#imports"
import ModalError from "@/components/modalError.vue"

const router = useRouter()
const user = useSupabaseUser()

// 🧠 Formulario reactivo
const form = reactive({
  id_paciente: "",
  id_usuario: 0,
  fecha: new Date().toISOString().substr(0, 10),
  procedimiento: ""
})

// 📋 Datos
const pacientes = ref([])
const usuarioNombre = ref("")

// 💬 Modal de errores
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
    case 'procedimiento':
      error = validarTexto(form.procedimiento, "Procedimiento", 10, 200);
      break;
    case 'fecha':
      const hoy = new Date()
      const fechaSeleccionada = new Date(form.fecha)
      const diferenciaDias = (fechaSeleccionada - hoy) / (1000 * 60 * 60 * 24)

      if (fechaSeleccionada < new Date(hoy.toISOString().substr(0, 10))) {
        return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser anterior a hoy.")
      }

      if (diferenciaDias > 20) {
        return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser más de 20 días en el futuro.")
      }
      break;
  }

  if (error) {
    mostrarModal("⚠️ Validación", error);
  }
};

// Mostrar modal
const mostrarModal = (titulo, mensaje) => {
  modalTitle.value = titulo
  modalMessage.value = mensaje
  modalVisible.value = true
}

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === "✅ Éxito") {
    router.push("/fisioterapias")
  }
}

// 🚀 Cargar datos iniciales
onMounted(async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")

    if (user.value?.id) {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.id_usuario = usuarioData.id_usuario
      usuarioNombre.value = usuarioData.nombre
    } else {
      mostrarModal("⚠️ Error", "Usuario no logueado")
    }
  } catch (err) {
    console.error("Error cargando datos:", err)
    mostrarModal("❌ Error", "No se pudieron cargar los datos del formulario.")
  }
})

watch(
  () => user.value,
  async (u) => {
    if (u?.id) {
      const usuarioData = await $fetch(`/api/user/${u.id}`)
      form.id_usuario = usuarioData.id_usuario
      usuarioNombre.value = usuarioData.nombre
    }
  },
  { immediate: true }
)

// 💾 Guardar fisioterapia
const guardarFisioterapia = async () => {
  // Validación paciente
  if (!form.id_paciente) {
    mostrarModal("⚠️ Atención", "Debe seleccionar un paciente.")
    return
  }

  // Validación de fecha
  const hoy = new Date()
  const fechaSeleccionada = new Date(form.fecha)
  const diferenciaDias = (fechaSeleccionada - hoy) / (1000 * 60 * 60 * 24)

  if (fechaSeleccionada < new Date(hoy.toISOString().substr(0, 10))) {
    return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser anterior a hoy.")
  }

  if (diferenciaDias > 20) {
    return mostrarModal("⚠️ Fecha inválida", "La fecha no puede ser más de 20 días en el futuro.")
  }

  // Validación procedimiento
  if (!form.procedimiento || form.procedimiento.trim() === '') {
    mostrarModal("⚠️ Atención", "Debe ingresar una descripción del procedimiento.")
    return
  }

  const error = validarTexto(form.procedimiento, "Procedimiento", 10, 200);
  if (error) {
    mostrarModal("⚠️ Validación", error)
    return
  }

  // Limpiar espacios en blanco
  form.procedimiento = form.procedimiento.trim();

  try {
    await $fetch("/api/fisioterapias", { method: "POST", body: form })
    mostrarModal("✅ Éxito", "Fisioterapia guardada correctamente.")
  } catch (err) {
    console.error("Error guardando fisioterapia:", err)
    mostrarModal("❌ Error", "Ocurrió un error al guardar la fisioterapia.")
  }
}
</script>