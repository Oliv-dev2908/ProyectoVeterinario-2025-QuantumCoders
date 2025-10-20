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
              <th class="p-3">ID Paciente</th>
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
              <td class="p-3 font-medium">{{ cita.id_paciente }}</td>
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
                  class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-300 focus:outline-none"
                  :disabled="cita.recordatorio_enviado"
                ></textarea>
              </td>

              <!-- ⚙️ Botón de acción -->
              <td class="p-3 text-center">
                <button
                  class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-xl shadow hover:scale-105 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="cita.recordatorio_enviado"
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
</template>

<script setup>
import { ref, onMounted } from 'vue'

const citas = ref([])

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

// 📲 Enviar recordatorio por WhatsApp
const enviarRecordatorio = async (cita) => {
  try {
    if (!cita.telefono_dueño) {
      alert('No hay teléfono del dueño disponible')
      return
    }

    const { data, error } = await $fetch('/api/whatsapp/send', {
      method: 'POST',
      body: {
        phone: cita.telefono_dueño,
        message: cita.mensaje
      }
    }).catch(err => ({ error: err }))

    if (error || data?.error) {
      alert('No se pudo enviar el mensaje')
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

    alert('Recordatorio enviado y registrado con éxito ✅')
  } catch (err) {
    console.error(err)
    alert('Error al enviar recordatorio')
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
          recordatorio_enviado: enviado
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
</style>
