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
        <h1 class="text-3xl font-bold text-gray-800">🧘‍♂️ Editar Fisioterapia</h1>
        <p class="text-gray-500 text-sm mt-1">
          Modifica los datos de la fisioterapia seleccionada
        </p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="actualizarFisioterapia" class="space-y-6">
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
            <label class="block font-medium mb-1 text-gray-700">👩‍⚕️ Usuario</label>
            <input type="text" v-model="nombreUsuario"
              class="w-full border-gray-300 rounded-lg shadow-sm p-2 bg-gray-100 cursor-not-allowed" readonly />
          </div>

          <!-- Fecha -->
          <div>
            <label class="block font-medium mb-1 text-gray-700">📅 Fecha</label>
            <input type="date" v-model="form.fecha" :readonly="fechaYaPasada" :min="hoyFormateado"
              :max="fechaMaxFormateada" class="w-full border-gray-300 rounded-lg shadow-sm p-2 
           bg-gray-100 transition" />
          </div>


          <!-- Procedimiento -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Procedimiento</label>
            <textarea v-model="form.procedimiento" @blur="validarCampo('procedimiento')"
              placeholder="Describe el procedimiento"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Botón actualizar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Actualizar Fisioterapia
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de error -->
    <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import { useRoute, useRouter } from "#imports"
import ModalError from "~/components/modalError.vue"

const route = useRoute()
const router = useRouter()
const usuarios = ref([])
const nombreUsuario = ref("")
const form = reactive({
  id_paciente: "",
  id_usuario: "",
  fecha: "",
  procedimiento: ""
})

const pacientes = ref([])

// 🔹 Estado del modal
const modalVisible = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const fechaMax = new Date(hoy);
fechaMax.setDate(fechaMax.getDate() + 20);

// Computeds para usar en el input
const hoyFormateado = computed(() => hoy.toISOString().substr(0, 10));
const fechaMaxFormateada = computed(() => fechaMax.toISOString().substr(0, 10));
const fechaYaPasada = computed(() => {
  if (!form.fecha) return false;
  const fechaSeleccionada = new Date(form.fecha);
  fechaSeleccionada.setHours(0, 0, 0, 0);
  return fechaSeleccionada <= hoy;
});

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
  }

  if (error) {
    mostrarModal("⚠️ Validación", error);
  }
};

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === "✅ Éxito") {
    router.push("/fisioterapias")
  }
}

const mostrarModal = (titulo, mensaje) => {
  modalTitle.value = titulo
  modalMessage.value = mensaje
  modalVisible.value = true
}

const cargarDatos = async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")
    usuarios.value = await $fetch("/api/user")

    const data = await $fetch(`/api/fisioterapias/${route.params.id}`)
    Object.assign(form, data)

    // buscar el nombre del usuario
    const usuario = usuarios.value.find((u) => u.id_usuario === data.id_usuario)
    nombreUsuario.value = usuario ? usuario.nombre : "Desconocido"
  } catch (err) {
    console.error("Error al cargar fisioterapia:", err)
    mostrarModal("❌ Error", "No se pudieron cargar los datos de la fisioterapia.")
  }
}

onMounted(cargarDatos)

const actualizarFisioterapia = async () => {
  // 🔹 Validaciones de campos requeridos
  if (!form.id_paciente || !form.procedimiento || !form.fecha) {
    mostrarModal("⚠️ Campos incompletos", "Por favor completa todos los campos obligatorios.")
    return
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
    await $fetch(`/api/fisioterapias/${route.params.id}`, {
      method: "PUT",
      body: form
    })

    mostrarModal("✅ Éxito", "Fisioterapia actualizada correctamente.")
  } catch (err) {
    mostrarModal("❌ Error", "Error al actualizar la fisioterapia: " + (err.data?.error || err.message))
  }
}
</script>