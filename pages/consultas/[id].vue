<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button @click="router.push('/consultas')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50">
      ← Volver a Consultas
    </button>

    <!-- Tarjeta central -->
    <div class="w-full max-w-3xl p-8 ml-65">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">✏️ Editar Consulta</h1>
        <p class="text-gray-500 text-sm mt-1">Actualiza los datos de la consulta</p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="actualizarConsulta" class="space-y-6">
          <!-- Paciente -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🐾 Paciente</label>
            <select v-model="form.id_paciente"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="">Seleccione un paciente</option>
              <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">
                {{ p.nombre }}
              </option>
            </select>
          </div>

          <!-- Médico -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">👩‍⚕️ Médico</label>
            <input type="text" v-model="nombreUsuario" disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
          </div>

          <!-- Fecha -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📅 Fecha de consulta</label>
            <input type="datetime-local" v-model="form.fecha" disabled
              class="w-full border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
          </div>

          <!-- Motivo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">💬 Motivo</label>
            <textarea v-model="form.motivo" placeholder="Describe el motivo de la consulta"
              @blur="validarCampo('motivo')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Signos clínicos -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">⚕️ Signos clínicos</label>
            <textarea v-model="form.signosclinicos" placeholder="Ej: fiebre, tos..."
              @blur="validarCampo('signosclinicos')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Curso -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🔁 Curso</label>
            <textarea v-model="form.curso" placeholder="Evolución del cuadro clínico"
              @blur="validarCampo('curso')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Diagnóstico presuntivo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🧠 Diagnóstico presuntivo</label>
            <textarea v-model="form.diagnosticopresuntivo" @blur="validarCampo('diagnosticopresuntivo')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Observaciones -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🧾 Observaciones</label>
            <textarea v-model="form.observaciones" @blur="validarCampo('observaciones')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Próxima consulta -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📆 Fecha próxima consulta (opcional)</label>
            <input type="datetime-local" v-model="form.fechaproxconsulta" @blur="validarCampo('fechaproxconsulta')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Condición -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">❤️ Condición</label>
            <input type="text" v-model="form.condicion" placeholder="Ej: estable, crítico..."
              @blur="validarCampo('condicion')"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Botón actualizar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Actualizar Consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "#imports"
import { useSupabaseUser } from "#imports"
import ModalError from "@/components/modalError.vue"

const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const usuarios = ref([])

const pacientes = ref([])
const nombreUsuario = ref("Cargando...")

const form = ref({
  id_consulta: 0,
  id_paciente: "",
  id_usuario: 0,
  id_cita: 0,
  fecha: "",
  motivo: "",
  signosclinicos: "",
  curso: "",
  diagnosticopresuntivo: "",
  observaciones: "",
  fechaproxconsulta: "",
  condicion: ""
})

const modalVisible = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")

// Rastrear qué campos opcionales han sido modificados
const camposModificados = ref({
  signosclinicos: false,
  curso: false,
  diagnosticopresuntivo: false,
  observaciones: false,
  condicion: false,
});

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === "✅ Éxito") router.push("/consultas")
}

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
  // Verificar si el campo está vacío o solo tiene espacios
  if (!campo || campo.trim().length === 0) {
    return `${nombre} no puede contener solo espacios en blanco.`;
  }

  if (campo.trim().length < min || campo.trim().length > max) {
    return `${nombre} debe tener entre ${min} y ${max} caracteres.`;
  }

  // Validar cantidad de números
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
  const f = form.value;
  let error = null;

  // Marcar campo como modificado si es opcional
  if (['signosclinicos', 'curso', 'diagnosticopresuntivo', 'observaciones', 'condicion'].includes(campo)) {
    if (f[campo] !== null && f[campo] !== undefined && f[campo] !== '') {
      camposModificados.value[campo] = true;
    }
  }

  switch (campo) {
    case 'motivo':
      error = validarTexto(f.motivo, "Motivo", 10, 200);
      break;
    case 'signosclinicos':
      if (camposModificados.value.signosclinicos && f.signosclinicos !== null && f.signosclinicos !== undefined) {
        error = validarTexto(f.signosclinicos, "Signos clínicos", 10, 200);
      }
      break;
    case 'curso':
      if (camposModificados.value.curso && f.curso !== null && f.curso !== undefined) {
        error = validarTexto(f.curso, "Curso", 10, 200);
      }
      break;
    case 'diagnosticopresuntivo':
      if (camposModificados.value.diagnosticopresuntivo && f.diagnosticopresuntivo !== null && f.diagnosticopresuntivo !== undefined) {
        error = validarTexto(f.diagnosticopresuntivo, "Diagnóstico presuntivo", 10, 200);
      }
      break;
    case 'observaciones':
      if (camposModificados.value.observaciones && f.observaciones !== null && f.observaciones !== undefined) {
        error = validarTexto(f.observaciones, "Observaciones", 10, 200);
      }
      break;
    case 'condicion':
      if (camposModificados.value.condicion && f.condicion !== null && f.condicion !== undefined) {
        error = validarTexto(f.condicion, "Condición", 10, 200);
      }
      break;
    case 'fechaproxconsulta':
      if (f.fechaproxconsulta) {
        const fechaConsulta = new Date(f.fecha);
        const fechaProx = new Date(f.fechaproxconsulta);
        const diferenciaDias = (fechaProx - fechaConsulta) / (1000 * 60 * 60 * 24);
        const hora = fechaProx.getHours() + fechaProx.getMinutes() / 60;

        if (fechaProx < fechaConsulta) {
          error = "La fecha de próxima consulta no puede ser anterior a la fecha actual.";
        } else if (diferenciaDias > 20) {
          error = "La fecha de próxima consulta no puede superar 20 días desde hoy.";
        } else if (hora < 9 || hora > 21) {
          error = "La hora de próxima consulta debe estar entre 09:00 y 21:00.";
        }
      }
      break;
  }

  if (error) {
    mostrarError(error);
  }
};

// Mostrar modal de error
const mostrarError = (mensaje) => {
  modalTitle.value = "⚠️ Validación";
  modalMessage.value = mensaje;
  modalVisible.value = true;
};

onMounted(async () => {
  const id = route.params.id
  try {
    // Cargar pacientes y usuarios
    pacientes.value = await $fetch("/api/pacientes")
    usuarios.value = await $fetch("/api/user")

    // Cargar consulta actual
    const data = await $fetch(`/api/consultas/${id}`)
    form.value = {
      ...data,
      id_cita: data.id_cita || null,
      fecha: new Date(data.fecha).toISOString().slice(0, 16),
      fechaproxconsulta: data.fechaproxconsulta
        ? new Date(data.fechaproxconsulta).toISOString().slice(0, 16)
        : ""
    }

    // Marcar campos opcionales que ya tienen contenido como modificados
    if (data.signosclinicos) camposModificados.value.signosclinicos = true;
    if (data.curso) camposModificados.value.curso = true;
    if (data.diagnosticopresuntivo) camposModificados.value.diagnosticopresuntivo = true;
    if (data.observaciones) camposModificados.value.observaciones = true;
    if (data.condicion) camposModificados.value.condicion = true;

    // Buscar nombre del usuario que registró la consulta
    const usuario = usuarios.value.find(
      (u) => u.id_usuario === data.id_usuario
    )
    nombreUsuario.value = usuario ? usuario.nombre : "Desconocido"

  } catch (err) {
    console.error("Error cargando consulta:", err)
    modalTitle.value = "⚠️ Error"
    modalMessage.value = "No se pudo cargar la consulta."
    modalVisible.value = true
  }
})

const actualizarConsulta = async () => {
  try {
    const f = form.value;

    // Validaciones obligatorias
    if (!f.id_paciente) {
      return mostrarError("Debe seleccionar un paciente.");
    }

    if (!f.motivo || f.motivo.trim() === '') {
      return mostrarError("El motivo no puede estar vacío.");
    }

    // Validaciones de campos obligatorios
    const errores = [
      validarTexto(f.motivo, "Motivo", 10, 200),
    ];

    // Validaciones condicionales (solo si el campo fue modificado)
    if (camposModificados.value.signosclinicos && f.signosclinicos !== null && f.signosclinicos !== undefined && f.signosclinicos !== '') {
      errores.push(validarTexto(f.signosclinicos, "Signos clínicos", 10, 200));
    }
    if (camposModificados.value.curso && f.curso !== null && f.curso !== undefined && f.curso !== '') {
      errores.push(validarTexto(f.curso, "Curso", 10, 200));
    }
    if (camposModificados.value.diagnosticopresuntivo && f.diagnosticopresuntivo !== null && f.diagnosticopresuntivo !== undefined && f.diagnosticopresuntivo !== '') {
      errores.push(validarTexto(f.diagnosticopresuntivo, "Diagnóstico presuntivo", 10, 200));
    }
    if (camposModificados.value.observaciones && f.observaciones !== null && f.observaciones !== undefined && f.observaciones !== '') {
      errores.push(validarTexto(f.observaciones, "Observaciones", 10, 200));
    }
    if (camposModificados.value.condicion && f.condicion !== null && f.condicion !== undefined && f.condicion !== '') {
      errores.push(validarTexto(f.condicion, "Condición", 10, 200));
    }

    // Limpiar campos opcionales que solo contienen espacios
    if (f.signosclinicos && f.signosclinicos.trim() === '') f.signosclinicos = '';
    if (f.curso && f.curso.trim() === '') f.curso = '';
    if (f.diagnosticopresuntivo && f.diagnosticopresuntivo.trim() === '') f.diagnosticopresuntivo = '';
    if (f.observaciones && f.observaciones.trim() === '') f.observaciones = '';
    if (f.condicion && f.condicion.trim() === '') f.condicion = '';

    // Validación fecha próxima consulta
    if (f.fechaproxconsulta) {
      const fechaConsulta = new Date(f.fecha);
      const fechaProx = new Date(f.fechaproxconsulta);
      const diferenciaDias = (fechaProx - fechaConsulta) / (1000 * 60 * 60 * 24);
      const hora = fechaProx.getHours() + fechaProx.getMinutes() / 60;

      if (fechaProx < fechaConsulta) {
        return mostrarError("La fecha de próxima consulta no puede ser anterior a la fecha actual.");
      }

      if (diferenciaDias > 20) {
        return mostrarError("La fecha de próxima consulta no puede superar 20 días desde hoy.");
      }

      if (hora < 9 || hora > 21) {
        return mostrarError("La hora de próxima consulta debe estar entre 09:00 y 21:00.");
      }
    }

    // Si hay errores, mostramos el primero
    const error = errores.find((e) => e);
    if (error) return mostrarError(error);

    // Actualizar consulta
    const body = { ...f }
    await $fetch(`/api/consultas/${f.id_consulta}`, { method: "PUT", body })

    // Crear o actualizar cita
    if (f.fechaproxconsulta) {
      if (f.id_cita) {
        await $fetch(`/api/citas/${f.id_cita}`, {
          method: "PUT",
          body: {
            id_paciente: f.id_paciente,
            fecha_hora: f.fechaproxconsulta,
            motivo: f.motivo || "Consulta de seguimiento",
            estado: "pendiente",
            recordatorio_enviado: false
          }
        })
      } else {
        const nuevaCita = await $fetch("/api/citas", {
          method: "POST",
          body: {
            id_paciente: f.id_paciente,
            fecha_hora: f.fechaproxconsulta,
            motivo: f.motivo || "Consulta de seguimiento",
            estado: "pendiente",
            recordatorio_enviado: false,
            id_consulta: f.id_consulta
          }
        })
        await $fetch(`/api/consultas/${f.id_consulta}`, {
          method: "PUT",
          body: { id_cita: nuevaCita.id_cita }
        })
      }
    }

    modalTitle.value = "✅ Éxito"
    modalMessage.value = "Consulta actualizada correctamente."
    modalVisible.value = true
  } catch (err) {
    console.error("Error al actualizar:", err)
    modalTitle.value = "⚠️ Error"
    modalMessage.value = "No se pudo actualizar la consulta."
    modalVisible.value = true
  }
}
</script>
