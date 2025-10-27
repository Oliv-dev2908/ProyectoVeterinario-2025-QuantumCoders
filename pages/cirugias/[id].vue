<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- Ajuste por sidebar -->
    <div class="w-full max-w-2xl p-8 ml-65">
      <!-- 🔙 Botón regresar fijo en esquina superior izquierda -->
      <button @click="router.push('/cirugias')"
        class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50">
        ← Volver a Cirugías
      </button>
      <!-- 🩺 Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">✏️ Editar Cirugía</h1>
        <p class="text-gray-500 text-sm mt-1">
          Modifica los datos del procedimiento quirúrgico veterinario
        </p>
      </div>

      <!-- 🐶 Tarjeta del formulario -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="actualizarCirugia" class="space-y-6">
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

          <!-- 📅 Fecha -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha</label>
            <input type="date" v-model="form.fecha" @blur="validarCampo('fecha')" :readonly="!fechaEditable"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition cursor-pointer" />
            <p v-if="!fechaEditable" class="text-sm text-gray-500 mt-1">
              La fecha ya pasó, no se puede modificar.
            </p>
          </div>


          <!-- 🩹 Descripción -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🩹 Descripción</label>
            <textarea v-model="form.descripcion" rows="4" @blur="validarCampo('descripcion')"
              placeholder="Describe brevemente la cirugía realizada..."
              class="w-full border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- 💾 Botón actualizar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Actualizar Cirugía
            </button>
          </div>
        </form>

        <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModalError from '../../components/modalError.vue'

const route = useRoute()
const router = useRouter()

const modalVisible = ref(false)
const modalMessage = ref('')
const modalTitle = ref('')
const fechaEditable = ref(false)

const form = ref({
  id_paciente: '',
  fecha: new Date().toISOString().substr(0, 10),
  descripcion: ''
})

const pacientes = ref([])

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
  if (campo !== 'fecha') return
  if (!fechaEditable.value) return // no validar si no se puede editar

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fechaSeleccionada = new Date(form.value.fecha)
  fechaSeleccionada.setHours(0, 0, 0, 0)

  const veinteDiasDespues = new Date(hoy)
  veinteDiasDespues.setDate(veinteDiasDespues.getDate() + 20)

  if (fechaSeleccionada < hoy) {
    mostrarError('La fecha no puede ser anterior a hoy.')
    return
  }
  if (fechaSeleccionada > veinteDiasDespues) {
    mostrarError('La cirugía no puede programarse más de 20 días en el futuro.')
    return
  }
}

// Mostrar modal de error
const mostrarError = (mensaje) => {
  modalTitle.value = "⚠️ Validación";
  modalMessage.value = mensaje;
  modalVisible.value = true;
};

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === '✅ Éxito') {
    router.push('/cirugias')
  }
}

onMounted(async () => {
  try {
    pacientes.value = await $fetch('/api/pacientes')
    const data = await $fetch(`/api/cirugias/${route.params.id}`)
    form.value = {
      id_paciente: data.id_paciente,
      fecha: data.fecha,
      descripcion: data.descripcion
    }

    // Determinar si se puede editar la fecha
    const fechaCirugia = new Date(data.fecha)
    fechaCirugia.setHours(0, 0, 0, 0)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    fechaEditable.value = fechaCirugia > hoy

  } catch (err) {
    console.error('Error cargando datos:', err)
    mostrarError('No se pudieron cargar los datos.')
  }
})

const actualizarCirugia = async () => {
  // Validación paciente
  if (!form.value.id_paciente) {
    mostrarError('Debe seleccionar un paciente.')
    return
  }

  // Validación fecha
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaSeleccionada = new Date(form.value.fecha);
  fechaSeleccionada.setHours(0, 0, 0, 0);
  const veinteDiasDespues = new Date(hoy);
  const veinteDiasAntes = new Date(hoy);
  veinteDiasDespues.setDate(veinteDiasDespues.getDate() + 20);
  veinteDiasAntes.setDate(veinteDiasDespues.getDate() - 20);

  if (fechaSeleccionada <= veinteDiasAntes) {
    mostrarError('La fecha ya ha pasado mas de 20 dias, no se puede modificar')
    return
  }
  if (fechaSeleccionada >= veinteDiasDespues) {
    mostrarError('La cirugía no puede programarse más de 20 días en el futuro.')
    return
  }

  // Validación descripción
  if (!form.value.descripcion || form.value.descripcion.trim() === '') {
    mostrarError('La descripción no puede estar vacía.')
    return
  }

  const error = validarTexto(form.value.descripcion, "Descripción", 10, 200);
  if (error) {
    mostrarError(error)
    return
  }

  // Limpiar espacios en blanco
  form.value.descripcion = form.value.descripcion.trim();

  // Guardar cambios
  try {
    await $fetch(`/api/cirugias/${route.params.id}`, {
      method: 'PUT',
      body: form.value
    })
    modalTitle.value = '✅ Éxito'
    modalMessage.value = 'Cirugía actualizada exitosamente.'
    modalVisible.value = true
  } catch (err) {
    console.error('Error actualizando cirugía:', err)
    modalTitle.value = '❌ Error'
    modalMessage.value = 'Error actualizando cirugía: ' + (err.data?.error || err.message)
    modalVisible.value = true
  }
}
</script>