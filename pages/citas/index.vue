<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Citas Pendientes</h1>

    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">ID Paciente</th>
          <th class="p-2 border">Nombre Mascota</th>
          <th class="p-2 border">Dueño</th>
          <th class="p-2 border">Teléfono</th>
          <th class="p-2 border">Motivo</th>
          <th class="p-2 border">Fecha y Hora</th>
          <th class="p-2 border">Estado</th>
          <th class="p-2 border">Recordatorio</th>
          <th class="p-2 border">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cita in citas" :key="cita.id_cita" class="text-center">
          <td class="p-2 border">{{ cita.id_paciente }}</td>
          <td class="p-2 border">{{ cita.nombre_mascota }}</td>
          <td class="p-2 border">{{ cita.nombre_dueño }}</td>
          <td class="p-2 border">{{ cita.telefono_dueño }}</td>
          <td class="p-2 border">{{ cita.motivo }}</td>
          <td class="p-2 border">{{ formatFecha(cita.fecha_hora) }}</td>
          <td class="p-2 border">{{ cita.estado }}</td>
          <td class="p-2 border">
            <textarea 
              v-model="cita.mensaje" 
              class="w-full border p-1" 
              rows="2"
            >{{ cita.mensajePredeterminado }}</textarea>
          </td>
          <td class="p-2 border">
            <button 
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              :disabled="cita.recordatorio_enviado"
              @click="enviarRecordatorio(cita)"
            >
              {{ cita.recordatorio_enviado ? "Enviado" : "Enviar" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const citas = ref([])

// Formatear fecha
const formatFecha = (fechaStr) => new Date(fechaStr).toLocaleString()

// Enviar recordatorio por WhatsApp
const enviarRecordatorio = async (cita) => {
  try {
    if (!cita.telefono_dueño) {
      alert("No hay teléfono del dueño disponible")
      return
    }

    // 1️⃣ Enviar mensaje por WhatsApp
    const { data, error } = await $fetch('/api/whatsapp/send', {
      method: 'POST',
      body: {
        phone: cita.telefono_dueño,
        message: cita.mensaje
      }
    }).catch(err => ({ error: err }))

    if (error || data?.error) {
      alert("No se pudo enviar el mensaje")
      console.error(error || data.error)
      return
    }

    // 2️⃣ Actualizar la tabla local de citas
    cita.recordatorio_enviado = true

    // 3️⃣ Registrar el recordatorio en la API /api/recordatorios
    await $fetch('/api/recordatorios', {
      method: 'POST',
      body: {
        id_cita: cita.id_cita,
        fecha_envio: new Date().toISOString(),
        medio: 'whatsapp',
        enviado: true
      }
    }).catch(err => {
      console.error("Error registrando recordatorio:", err)
    })

    alert("Recordatorio enviado y registrado con éxito!")
  } catch (err) {
    console.error(err)
    alert("Error al enviar recordatorio")
  }
}

// Cargar citas y enriquecer con mascota, dueño y estado de recordatorio
const cargarCitas = async () => {
  try {
    const citasApi = await $fetch('/api/citas') // trae solo citas
    const recordatorios = await $fetch('/api/recordatorios') // todos los recordatorios enviados

    const citasCompletas = await Promise.all(
      citasApi.map(async (cita) => {
        // Traer mascota
        const mascota = await $fetch(`/api/pacientes/${cita.id_paciente}`)
        // Traer dueño
        const dueño = await $fetch(`/api/clientes/${mascota.id_cliente}`)

        // Verificar si ya se envió un recordatorio
        const enviado = recordatorios.some(r => r.id_cita === cita.id_cita && r.enviado)

        return {
          ...cita,
          nombre_mascota: mascota.nombre || "Desconocido",
          nombre_dueño: dueño.nombres || "Desconocido",
          telefono_dueño: dueño.telefono || null,
          mensajePredeterminado: `Hola ${dueño.nombres}! Le recordamos su cita para "${mascota.nombre}" el ${formatFecha(cita.fecha_hora)}.`,
          mensaje: `Hola ${dueño.nombres}! Le recordamos su cita para "${mascota.nombre}" el ${formatFecha(cita.fecha_hora)}.`,
          recordatorio_enviado: enviado
        }
      })
    )
    citas.value = citasCompletas
  } catch (err) {
    console.error("Error cargando citas:", err)
    citas.value = []
  }
}

onMounted(cargarCitas)
</script>


<style scoped>
textarea { resize: none; }
</style>
