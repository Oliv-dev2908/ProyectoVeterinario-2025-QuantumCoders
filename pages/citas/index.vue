<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex">
    <!-- Ajuste por sidebar -->
    <div class="flex-1 p-8 ml-55">
      <!-- 🐾 Encabezado -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">📅 Citas Pendientes</h1>
          <p class="text-gray-500 text-sm mt-1">Gestión y recordatorios de citas veterinarias</p>
        </div>
      </div>

      <!-- 🧾 Tabla -->
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <table class="min-w-full text-left text-gray-700">
          <thead>
            <tr class="bg-teal-100 text-gray-700 uppercase text-sm font-semibold tracking-wide">
              <th class="p-3">Nombre Mascota</th>
              <th class="p-3">Dueño</th>
              <th class="p-3">Teléfono</th>
              <th class="p-3">Motivo</th>
              <th class="p-3">Fecha y Hora</th>
              <th class="p-3">Estado</th>
              <th class="p-3">Recordatorio</th>
              <th class="p-3 text-center">Acción</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="cita in citas"
              :key="cita.id_cita"
              class="border-t hover:bg-teal-50 transition"
            >
              <td class="p-3">{{ cita.nombre_mascota }}</td>
              <td class="p-3">{{ cita.nombre_dueño }}</td>
              <td class="p-3">{{ cita.telefono_dueño || "—" }}</td>
              <td class="p-3">{{ cita.motivo }}</td>
              <td class="p-3">{{ formatFecha(cita.fecha_hora) }}</td>
              <td class="p-3">{{ cita.estado }}</td>

              <!-- 📩 Mensaje del recordatorio -->
              <td class="p-3">
                <textarea
                  v-model="cita.mensaje"
                  rows="2"
                  maxlength="200"
                  @blur="validarMensaje(cita)"
                  class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-300 focus:outline-none"
                  :disabled="cita.recordatorio_enviado"
                  :class="{ 'border-red-500': cita.mensajeError }"
                ></textarea>
                <p v-if="cita.mensajeError" class="text-red-500 text-xs mt-1">{{ cita.mensajeError }}</p>
                <p class="text-gray-400 text-xs mt-1">{{ cita.mensaje?.length || 0 }}/200 caracteres</p>
              </td>

              <!-- ⚙️ Botón de acción -->
              <td class="p-3 text-center">
                <button
                  class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-xl shadow hover:scale-105 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="cita.recordatorio_enviado || cita.mensajeError"
                  @click="enviarRecordatorio(cita)"
                >
                  {{ cita.recordatorio_enviado ? "Enviado" : "Enviar" }}
                </button>
              </td>
            </tr>

            <!-- 🐶 Estado vacío -->
            <tr v-if="citas.length === 0">
              <td colspan="9" class="p-6 text-center text-gray-500">
                No hay citas pendientes por ahora 🐾
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Modal de error -->
  <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="modalVisible = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModalError from "@/components/modalError.vue"

const citas = ref([])
const modalVisible = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")

// 📅 Formatear fecha
const formatFecha = (fechaStr) => {
  if (!fechaStr) return '—'
  return new Date(fechaStr).toLocaleString('es-BO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 🔍 Contar emojis en el texto
const contarEmojis = (texto) => {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23FF}\u{24C2}\u{25AA}\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{1F004}\u{1F170}-\u{1F251}]/gu
  const matches = texto.match(emojiRegex)
  return matches ? matches.length : 0
}

// 🚫 Palabras ofensivas
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
  )
  return palabrasOfensivas.test(texto)
}

// 🔒 Patrones maliciosos (SQL Injection, XSS)
const contienePatronesMaliciosos = (texto) => {
  const patrones = [
    /select|insert|delete|update|drop|alter|union|--|;/i, // SQL Injection
    /(script|<|>)/i, // XSS básico
    /(.)\1{5,}/ // Más de 5 caracteres repetidos (más permisivo que antes)
  ]
  return patrones.some((p) => p.test(texto))
}

// ✅ Validar mensaje
const validarMensaje = (cita) => {
  const mensaje = cita.mensaje?.trim() || ''
  
  // Resetear error
  cita.mensajeError = null

  // Validar que no esté vacío
  if (!mensaje || mensaje.length === 0) {
    cita.mensajeError = "El mensaje no puede estar vacío"
    return false
  }

  // Validar longitud mínima
  if (mensaje.length < 10) {
    cita.mensajeError = "El mensaje debe tener al menos 10 caracteres"
    return false
  }

  // Validar longitud máxima
  if (mensaje.length > 200) {
    cita.mensajeError = "El mensaje no puede exceder 200 caracteres"
    return false
  }

  // Validar emojis (máximo 1)
  const cantidadEmojis = contarEmojis(mensaje)
  if (cantidadEmojis > 1) {
    cita.mensajeError = "Solo se permite 1 emoji en el mensaje"
    return false
  }

  // Validar palabras ofensivas
  if (contieneOfensas(mensaje)) {
    cita.mensajeError = "El mensaje contiene palabras ofensivas o inapropiadas"
    return false
  }

  // Validar patrones maliciosos
  if (contienePatronesMaliciosos(mensaje)) {
    cita.mensajeError = "El mensaje contiene caracteres no permitidos o patrones sospechosos"
    return false
  }

  return true
}

// 📲 Enviar recordatorio por WhatsApp
const enviarRecordatorio = async (cita) => {
  try {
    // Validar mensaje antes de enviar
    if (!validarMensaje(cita)) {
      modalTitle.value = "⚠️ Error de Validación"
      modalMessage.value = cita.mensajeError
      modalVisible.value = true
      return
    }

    if (!cita.telefono_dueño) {
      modalTitle.value = "⚠️ Error"
      modalMessage.value = "No hay teléfono del dueño disponible"
      modalVisible.value = true
      return
    }

    const { data, error } = await $fetch('/api/whatsapp/send', {
      method: 'POST',
      body: {
        phone: cita.telefono_dueño,
        message: cita.mensaje.trim()
      }
    }).catch(err => ({ error: err }))

    if (error || data?.error) {
      modalTitle.value = "❌ Error"
      modalMessage.value = "No se pudo enviar el mensaje"
      modalVisible.value = true
      console.error(error || data.error)
      return
    }

    cita.recordatorio_enviado = true

    await $fetch('/api/recordatorios', {
      method: 'POST',
      body: {
        id_cita: cita.id_cita,
        fecha_envio: new Date().toISOString(),
        medio: 'whatsapp',
        enviado: true
      }
    }).catch(err => console.error('Error registrando recordatorio:', err))

    modalTitle.value = "✅ Éxito"
    modalMessage.value = "Recordatorio enviado y registrado con éxito"
    modalVisible.value = true
  } catch (err) {
    console.error(err)
    modalTitle.value = "❌ Error"
    modalMessage.value = "Error al enviar recordatorio"
    modalVisible.value = true
  }
}

// 🔄 Cargar citas
const cargarCitas = async () => {
  try {
    const citasApi = await $fetch('/api/citas')
    const recordatorios = await $fetch('/api/recordatorios')

    const citasCompletas = await Promise.all(
      citasApi.map(async (cita) => {
        const mascota = await $fetch(`/api/pacientes/${cita.id_paciente}`)
        const dueño = await $fetch(`/api/clientes/${mascota.id_cliente}`)

        const enviado = recordatorios.some(r => r.id_cita === cita.id_cita && r.enviado)

        const mensajeBase = `Hola ${dueño.nombres}! Le recordamos su cita para "${mascota.nombre}" el ${formatFecha(cita.fecha_hora)}.`

        return {
          ...cita,
          nombre_mascota: mascota.nombre || 'Desconocido',
          nombre_dueño: dueño.nombres || 'Desconocido',
          telefono_dueño: dueño.telefono || null,
          mensajePredeterminado: mensajeBase,
          mensaje: mensajeBase,
          recordatorio_enviado: enviado,
          mensajeError: null
        }
      })
    )

    citas.value = citasCompletas
  } catch (err) {
    console.error('Error cargando citas:', err)
    citas.value = []
  }
}

onMounted(cargarCitas)
</script>

<style scoped>
textarea {
  resize: none;
  transition: all 0.3s ease;
}
textarea:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
}
textarea.border-red-500 {
  border-color: #ef4444 !important;
}
</style>