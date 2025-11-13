<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-8 relative overflow-hidden">
    <!-- volver -->

    <div class="flex justify-end gap-4 mb-6">
        <button @click="router.push('/realizarCitas')"
          class="bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-semibold px-6 py-2 rounded-xl shadow hover:scale-105 hover:shadow-lg transition">
          🗓️ Calendario
        </button>
        <button @click="router.push('/citas')"
          class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold px-6 py-2 rounded-xl shadow hover:scale-105 hover:shadow-lg transition">
          📋 Citas
        </button>
      </div>

    <h1 class="text-4xl font-extrabold text-emerald-800 mb-10 text-center drop-shadow">📅 Gestión de Citas</h1>

    <!-- Calendario -->
    <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-emerald-100">
      <FullCalendar :options="calendarOptions" class="rounded-2xl" />
    </div>

    <!-- Modal: Nueva Cita (fecha bloqueada, solo hora editable) -->
    <transition name="fade">
      <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div class="bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl p-6 w-[420px] shadow-2xl border border-emerald-200">
          <h2 class="text-2xl font-bold text-emerald-800 mb-4 text-center">🐾 Nueva Cita</h2>

          <form @submit.prevent="agendarCita" class="flex flex-col gap-4">
            <!-- Fecha (bloqueada) -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">Fecha</label>
              <input
                type="date"
                v-model="nuevaCita.fecha"
                readonly
                class="w-full border border-emerald-200 rounded-xl px-3 py-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <!-- Hora -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">Hora (09:00 - 21:00)</label>
              <input
                v-model="nuevaCita.hora"
                type="time"
                min="09:00"
                max="21:00"
                required
                class="w-full border border-emerald-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
              <p v-if="horaInvalida" class="text-red-600 text-sm mt-1">La hora debe estar entre 09:00 y 21:00 y no puede ser pasada.</p>
            </div>

            <!-- Paciente -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">Paciente</label>
              <select
                v-model="nuevaCita.id_paciente"
                required
                class="w-full border border-emerald-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              >
                <option value="" disabled>Selecciona un paciente</option>
                <option v-for="p in pacientes" :key="p.id_paciente" :value="p.id_paciente">{{ p.nombre }}</option>
              </select>
            </div>

            <!-- Motivo -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">Motivo</label>
              <input
                v-model.trim="nuevaCita.motivo"
                type="text"
                required
                maxlength="200"
                class="w-full border border-emerald-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
                placeholder="Motivo de la cita"
              />
            </div>

            <div class="flex justify-end gap-3 mt-4">
              <button type="button" @click="cerrarModal" class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow-sm">Cancelar</button>
              <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal: Detalle Cita -->
    <transition name="fade">
      <div v-if="mostrarDetalle" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div class="bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl p-6 w-[420px] shadow-2xl border border-emerald-200">
          <h2 class="text-2xl font-bold text-emerald-800 mb-4 text-center">📖 Detalle de Cita</h2>

          <div class="text-emerald-800 space-y-3">
            <p><span class="font-semibold">🐶 Paciente:</span> {{ detalleCita.pacienteNombre }}</p>
            <p><span class="font-semibold">💬 Motivo:</span> {{ detalleCita.motivo }}</p>
            <p><span class="font-semibold">📅 Fecha y hora:</span> {{ formatearFecha(detalleCita.fecha_hora) }}</p>
            <p><span class="font-semibold">🔖 Estado:</span>
              <span :class="estadoClase(detalleCita.estado)">{{ detalleCita.estado }}</span>
            </p>
            <p><span class="font-semibold">📨 Recordatorio:</span> {{ detalleCita.recordatorio_enviado ? 'Enviado' : 'No enviado' }}</p>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button @click="mostrarDetalle = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium">Cerrar</button>
            <button v-if="detalleCita.estado === 'pendiente'" @click="abrirConsulta(detalleCita)" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-semibold">Completar Cita</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal: Formulario de Consulta (completo) -->
    <transition name="fade">
      <div v-if="mostrarConsulta" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div class="bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl p-6 w-[720px] shadow-2xl border border-emerald-200 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold text-emerald-800 mb-4 text-center">🩺 Registrar Consulta</h2>

          <form @submit.prevent="registrarConsulta" class="space-y-4">
            <!-- Paciente (bloqueado) -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">🐾 Paciente</label>
              <input type="text" :value="consultaForm.pacienteNombre" disabled class="w-full border border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
            </div>

            <!-- Médico (bloqueado) -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">👩‍⚕️ Médico</label>
              <input type="text" :value="nombreUsuario" disabled class="w-full border border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
            </div>

            <!-- Fecha (bloqueada) -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">📅 Fecha de consulta</label>
              <input type="datetime-local" v-model="consultaForm.fecha" disabled class="w-full border border-gray-300 rounded-xl p-3 bg-gray-100 text-gray-600 cursor-not-allowed" />
            </div>

            <!-- Motivo -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">💬 Motivo</label>
              <textarea v-model="consultaForm.motivo" @blur="validarCampo('motivo')" rows="2" class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400"></textarea>
            </div>

            <!-- Signos clínicos -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">⚕️ Signos clínicos</label>
              <textarea v-model="consultaForm.signosclinicos" @blur="validarCampo('signosclinicos')" rows="2" class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400"></textarea>
            </div>

            <!-- Curso -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">🔁 Curso</label>
              <textarea v-model="consultaForm.curso" @blur="validarCampo('curso')" rows="2" class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400"></textarea>
            </div>

            <!-- Diagnóstico presuntivo -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">🧠 Diagnóstico presuntivo</label>
              <textarea v-model="consultaForm.diagnosticopresuntivo" @blur="validarCampo('diagnosticopresuntivo')" rows="2" class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400"></textarea>
            </div>

            <!-- Observaciones -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">🧾 Observaciones</label>
              <textarea v-model="consultaForm.observaciones" @blur="validarCampo('observaciones')" rows="2" class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400"></textarea>
            </div>

            <!-- Próxima consulta -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">📆 Fecha próxima consulta (opcional)</label>
              <input type="datetime-local" v-model="consultaForm.fechaproxconsulta" @blur="validarCampo('fechaproxconsulta')" class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400" />
              <p class="text-sm text-gray-500 mt-1">Si dejas vacío, no se crea próxima cita.</p>
            </div>

            <!-- Condición -->
            <div>
              <label class="block text-emerald-700 font-semibold mb-1">❤️ Condición</label>
              <input type="text" v-model="consultaForm.condicion" @blur="validarCampo('condicion')" placeholder="Ej: estable, crítico..." class="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400" />
            </div>

            <div class="flex justify-end gap-3 mt-4">
              <button type="button" @click="cancelarConsulta" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700">Cancelar</button>
              <button type="submit" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">Guardar Consulta</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

<ModalError
  :visible="modalVisible"
  :title="modalTitle"
  :message="modalMessage"
  @close="handleModalClose"
/>

<!-- Simple toast --> <div v-if="toast.message" :class="['fixed bottom-6 right-6 rounded-xl px-4 py-3 text-white shadow-lg', toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500']"> {{ toast.message }} </div>

  </div>
</template>

<script setup>
/*
  realizarCitas.vue
  - Implementa el flujo: citas -> consultas (1:1)
  - Requiere endpoints:
    GET  /api/citas
    POST /api/citas
    PUT  /api/citas/:id_cita
    GET  /api/pacientes
    POST /api/consultas
  - Requiere useSupabaseUser() y /api/user/:supabaseId que retorne { id_usuario, nombre }
*/

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseUser } from '#imports' // si en tu proyecto lo tienes así
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ModalError from '@/components/modalError.vue'


const router = useRouter()
const user = useSupabaseUser()
const modalVisible = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

// estados
const citas = ref([])
const pacientes = ref([])
const mostrarModal = ref(false)
const mostrarDetalle = ref(false)
const mostrarConsulta = ref(false)
const detalleCita = ref({})
const horaInvalida = ref(false)
const nombreUsuario = ref('Cargando...')
const toast = ref({ message: '', type: 'success' })
let toastTimeout = null

const mostrarError = (mensaje) => {
  modalTitle.value = "⚠️ Validación";
  modalMessage.value = mensaje;
  modalVisible.value = true;
};

function handleModalClose() {
  modalVisible.value = false
}

// nueva cita (fecha bloqueada)
const nuevaCita = ref({
  id_paciente: '',
  motivo: '',
  fecha: '', // yyyy-mm-dd
  hora: ''   // HH:MM
})

// formulario de consulta (completo)
const consultaForm = ref({
  id_paciente: null,
  id_usuario: null,
  id_cita: null,
  motivo: '',
  signosclinicos: '',
  curso: '',
  fechaproxconsulta: null,
  diagnosticopresuntivo: '',
  observaciones: '',
  fecha: '', // datetime-local
  condicion: '',
  id_consulta: null
})

// campos modificados para validación condicionada
const camposModificados = ref({
  signosclinicos: false,
  curso: false,
  diagnosticopresuntivo: false,
  observaciones: false,
  condicion: false
})

// ---------- FullCalendar options ----------
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: 'es',
  selectable: true,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  events: [],
  dateClick: (info) => {
    // info.dateStr => "YYYY-MM-DD"
    abrirModalNuevaCita(info.dateStr)
  },
  eventClick: (info) => {
    const id = info.event.id
    const cita = citas.value.find(c => String(c.id_cita) === String(id))
    if (cita) {
      const paciente = pacientes.value.find(p => p.id_paciente === cita.id_paciente)
      detalleCita.value = { ...cita, pacienteNombre: paciente ? paciente.nombre : 'Desconocido' }
      mostrarDetalle.value = true
    }
  }
})

// ---------- Utilidades de validación (reutilizadas del flujo consultas) ----------
const contienePatronesProhibidos = (texto) => {
  if (!texto) return false
  const patrones = [
    /select|insert|delete|update|drop|alter|union|--|;/i,
    /(script|<|>)/i,
    /(.)\1{4,}/,
    /[!@#$%^&*()_+=\[\]{};':"\\|,.<>?\/~`¿¡]/i
  ]
  return patrones.some(p => p.test(texto))
}
const contarNumeros = (texto) => {
  const numeros = texto ? texto.match(/\d/g) : null
  return numeros ? numeros.length : 0
}
const contieneOfensas = (texto) => {
  if (!texto) return false
  const palabrasOfensivas = new RegExp("\\b(" + [
    "idiota","tonto","estupido","imbecil","burro","bobo","tarado","mongol","retrasado","animal","bruto",
    "baboso","pendejo","gilipollas","pelotudo","boludo","mierda","maldito","malparido","culero","cabr[oó]n",
    "zorra","puta","puto","maric[oó]n","marica","maricona","negro","negrata","gordo","cerdo","perra","perro",
    "infeliz","babosa","asqueroso","asquerosa","menso","estupida","idiotez","inutil","zopenco","tarada",
    "huevon","huev[oó]n","hueva","huevada","cojudo","pajero","verga","vergazo","chingar","chingada","chingado",
    "ching[oó]n","chingona","malnacido","desgraciado","imb[eé]cil","bastardo","est[uú]pido"
  ].join("|") + ")\\b","i")
  return palabrasOfensivas.test(texto)
}
const validarTexto = (texto, nombre, min, max) => {
  if (texto === null || texto === undefined) return null

  if (!texto || texto.trim().length === 0) {
    mostrarError(`${nombre} no puede contener solo espacios en blanco.`)
    return false
  }

  if (texto.trim().length < min || texto.trim().length > max) {
    mostrarError(`${nombre} debe tener entre ${min} y ${max} caracteres.`)
    return false
  }

  if (contarNumeros(texto) > 3) {
    mostrarError(`${nombre} no puede contener más de 3 números.`)
    return false
  }

  if (contienePatronesProhibidos(texto)) {
    mostrarError(`${nombre} contiene caracteres no permitidos.`)
    return false
  }

  if (contieneOfensas(texto)) {
    mostrarError(`${nombre} contiene palabras ofensivas.`)
    return false
  }

  return true
}


// ---------- Cargar datos iniciales ----------
const cargarPacientes = async () => {
  try {
    pacientes.value = await $fetch('/api/pacientes')
  } catch (err) {
    console.error('Error cargando pacientes', err)
  }
}

const cargarUsuario = async () => {
  try {
    if (user?.value?.id) {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      consultaForm.value.id_usuario = usuarioData.id_usuario
      nombreUsuario.value = usuarioData.nombre || 'Usuario'
    } else {
      nombreUsuario.value = 'No logueado'
    }
  } catch (err) {
    console.error('Error cargando usuario', err)
    nombreUsuario.value = 'Usuario'
  }
}

// Marca citas pasadas pendientes como incompletas y carga eventos
const cargarCitas = async () => {
  try {
    const resp = await $fetch('/api/citas')
    citas.value = Array.isArray(resp) ? resp : []
    const ahora = new Date()
    // marcar en backend las pendientes pasadas
    for (const cita of citas.value) {
      const fechaCita = new Date(cita.fecha_hora)
      if (fechaCita < ahora && cita.estado === 'pendiente') {
        try {
          await $fetch(`/api/citas/${cita.id_cita}`, { method: 'PUT', body: { ...cita, estado: 'incompleta' } })
          cita.estado = 'incompleta'
        } catch (err) {
          console.error('Error marcando incompleta', err)
        }
      }
    }
    // actualizar eventos
    calendarOptions.value.events = citas.value.map(cita => ({
      id: cita.id_cita,
      title: cita.motivo,
      start: cita.fecha_hora,
      backgroundColor: cita.estado === 'pendiente' ? '#6ee7b7' : cita.estado === 'completada' ? '#34d399' : '#f87171',
      borderColor: '#059669',
      extendedProps: { ...cita }
    }))
  } catch (err) {
    console.error('Error cargando citas', err)
  }
}

// ---------- Abrir modal nueva cita (fecha bloqueada) ----------
const abrirModalNuevaCita = (fechaStr) => {
  // fechaStr tiene formato "YYYY-MM-DD"
  // bloquear si fecha pasada
  const hoy = new Date()
  const fechaClick = new Date(fechaStr + 'T00:00:00')
  // comparar por fecha (sin hora)
  if (fechaClick.setHours(0,0,0,0) < new Date(hoy).setHours(0,0,0,0)) {
    toastShow('No puedes crear citas en fechas pasadas', 'error')
    return
  }
  nuevaCita.value = { id_paciente: '', motivo: '', fecha: fechaStr, hora: '' }
  mostrarModal.value = true
}

// ---------- Validar hora antes de guardar ----------
const validarHoraCita = () => {
  if (!nuevaCita.value.hora) return true
  const [h, m] = nuevaCita.value.hora.split(':').map(Number)
  if (h < 9 || h > 21) return false
  // si la fecha es hoy, no permitir hora pasada
  const ahora = new Date()
  const fechaLocal = new Date(`${nuevaCita.value.fecha}T${nuevaCita.value.hora}:00`)
  if (fechaLocal < ahora) return false
  return true
}

// ---------- Agendar cita (POST /api/citas) ----------
const agendarCita = async () => {
  try {
    if (!nuevaCita.value.id_paciente || !nuevaCita.value.motivo || !nuevaCita.value.hora) {
      toastShow('Completa todos los campos', 'error')
      return
    }
    if (!validarHoraCita()) {
      horaInvalida.value = true
      toastShow('Hora inválida: debe ser entre 09:00 y 21:00 y no en el pasado', 'error')
      return
    }
    horaInvalida.value = false
    // construir ISO en UTC para enviar (convertir fecha+hora local a ISO)
    const localDate = new Date(`${nuevaCita.value.fecha}T${nuevaCita.value.hora}:00`)
    const fechaISO = localDate.toISOString() // backend espera iso z
    const body = {
      id_paciente: nuevaCita.value.id_paciente,
      motivo: nuevaCita.value.motivo,
      fecha_hora: fechaISO,
      estado: 'pendiente',
      recordatorio_enviado: false,
      id_consulta: null
    }
    await $fetch('/api/citas', { method: 'POST', body })
    mostrarModal.value = false
    toastShow('Cita agendada correctamente', 'success')
    await cargarCitas()
  } catch (err) {
    console.error('Error agendar cita', err)
    toastShow('Error al agendar la cita', 'error')
  }
}

const cerrarModal = () => {
  mostrarModal.value = false
  nuevaCita.value = { id_paciente: '', motivo: '', fecha: '', hora: '' }
}

// ---------- Abrir formulario de consulta (completar cita) ----------
const abrirConsulta = (cita) => {
  // preparar formulario con datos de la cita
  consultaForm.value.id_cita = cita.id_cita
  consultaForm.value.id_paciente = cita.id_paciente
  consultaForm.value.motivo = cita.motivo || ''
  consultaForm.value.signosclinicos = cita.signosclinicos || ''
  consultaForm.value.curso = cita.curso || ''
  consultaForm.value.diagnosticopresuntivo = cita.diagnosticopresuntivo || ''
  consultaForm.value.observaciones = cita.observaciones || ''
  consultaForm.value.condicion = cita.condicion || ''
  // fecha actual en timezone del usuario (datetime-local)
  const now = new Date()
  const isoLocal = toDatetimeLocal(now)
  consultaForm.value.fecha = isoLocal
  consultaForm.value.pacienteNombre = pacientes.value.find(p => p.id_paciente === cita.id_paciente)?.nombre || 'Desconocido'
  // id_usuario ya cargado en cargarUsuario()
  mostrarDetalle.value = false
  mostrarConsulta.value = true
  // reset campos modificados
  camposModificados.value = { signosclinicos: false, curso: false, diagnosticopresuntivo: false, observaciones: false, condicion: false }
}

// convertir Date a string para input datetime-local (yyyy-mm-ddThh:mm)
const toDatetimeLocal = (d) => {
  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const min = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

// ---------- Validación campos consulta (reutiliza validarTexto) ----------
const validarCampo = (campo) => {
  const f = consultaForm.value
  let error = null
  if (['signosclinicos','curso','diagnosticopresuntivo','observaciones','condicion'].includes(campo)) {
    camposModificados.value[campo] = true
  }
  switch (campo) {
    case 'motivo':
      error = validarTexto(f.motivo, 'Motivo', 5, 300)
      break
    case 'signosclinicos':
      if (camposModificados.value.signosclinicos && f.signosclinicos) error = validarTexto(f.signosclinicos, 'Signos clínicos', 5, 500)
      break
    case 'curso':
      if (camposModificados.value.curso && f.curso) error = validarTexto(f.curso, 'Curso', 3, 500)
      break
    case 'diagnosticopresuntivo':
      if (camposModificados.value.diagnosticopresuntivo && f.diagnosticopresuntivo) error = validarTexto(f.diagnosticopresuntivo, 'Diagnóstico presuntivo', 3, 500)
      break
    case 'observaciones':
      if (camposModificados.value.observaciones && f.observaciones) error = validarTexto(f.observaciones, 'Observaciones', 3, 500)
      break
    case 'condicion':
      if (camposModificados.value.condicion && f.condicion) error = validarTexto(f.condicion, 'Condición', 3, 100)
      break
    case 'fechaproxconsulta':
      if (f.fechaproxconsulta) {
        const fechaConsulta = new Date(f.fecha)
        const fechaProx = new Date(f.fechaproxconsulta)
        const diferenciaDias = (fechaProx - fechaConsulta) / (1000*60*60*24)
        const hora = fechaProx.getHours() + fechaProx.getMinutes()/60
        if (fechaProx < fechaConsulta) mostrarError('La fecha de próxima consulta no puede ser anterior a la fecha actual.')
        else if (diferenciaDias > 20) mostrarError ('La fecha de próxima consulta no puede superar 20 días desde hoy.')
        else if (hora < 9 || hora > 21) mostrarError ('La hora de próxima consulta debe estar entre 09:00 y 21:00.')
      }
      break
  }
  if (error) {
    toastShow(error, 'error')
  }
}

// ---------- Registrar consulta (POST /api/consultas + PATCH cita + crear próxima cita si aplica) ----------
const registrarConsulta = async () => {
  try {
    const f = consultaForm.value
    // validaciones mínimas
    if (!f.id_paciente) { toastShow('Falta paciente', 'error'); return }
    if (!f.id_usuario) { toastShow('Usuario no identificado', 'error'); return }
    if (!f.id_cita) { toastShow('Cita no identificada', 'error'); return }
    if (!f.motivo || f.motivo.trim().length < 5) { toastShow('Motivo demasiado corto', 'error'); return }

    // Validaciones condicionales usando validarTexto
    const errores = [ validarTexto(f.motivo, 'Motivo', 5, 300) ]
    if (camposModificados.value.signosclinicos && f.signosclinicos) errores.push(validarTexto(f.signosclinicos,'Signos clínicos',5,500))
    if (camposModificados.value.curso && f.curso) errores.push(validarTexto(f.curso,'Curso',3,500))
    if (camposModificados.value.diagnosticopresuntivo && f.diagnosticopresuntivo) errores.push(validarTexto(f.diagnosticopresuntivo,'Diagnóstico presuntivo',3,500))
    if (camposModificados.value.observaciones && f.observaciones) errores.push(validarTexto(f.observaciones,'Observaciones',3,500))
    if (camposModificados.value.condicion && f.condicion) errores.push(validarTexto(f.condicion,'Condición',3,100))
    const err = errores.find(e => e)
    if (err) { toastShow(err,'error'); return }

    // preparar body para consultas
    const body = {
      id_paciente: f.id_paciente,
      id_usuario: f.id_usuario,
      id_cita: f.id_cita,
      motivo: f.motivo,
      signosclinicos: f.signosclinicos || '',
      curso: f.curso || '',
      fechaproxconsulta: f.fechaproxconsulta || null,
      diagnosticopresuntivo: f.diagnosticopresuntivo || '',
      observaciones: f.observaciones || '',
      fecha: new Date(f.fecha).toISOString(),
      condicion: f.condicion || ''
    }

    // POST consulta
    const nuevaConsulta = await $fetch('/api/consultas', { method: 'POST', body })

    // PATCH cita: id_consulta y estado=completada
    await $fetch(`/api/citas/${f.id_cita}`, { method: 'PUT', body: { id_consulta: nuevaConsulta.id_consulta, estado: 'completada' } })

    // Si hay fechaproxconsulta crear nueva cita asociada
    if (f.fechaproxconsulta) {
      const fechaProxISO = new Date(f.fechaproxconsulta).toISOString()
      const nuevaCitaBody = {
        id_paciente: f.id_paciente,
        id_consulta: nuevaConsulta.id_consulta,
        fecha_hora: fechaProxISO,
        motivo: f.motivo || 'Revisión programada',
        estado: 'pendiente',
        recordatorio_enviado: false
      }
      const created = await $fetch('/api/citas', { method: 'POST', body: nuevaCitaBody })
      // actualizamos la consulta registrada con id_cita creado
      await $fetch(`/api/consultas/${nuevaConsulta.id_consulta}`, { method: 'PUT', body: { id_cita: created.id_cita } })
    }

    toastShow('Consulta guardada y cita completada', 'success')
    mostrarConsulta.value = false
    await cargarCitas()
  } catch (err) {
    console.error('Error registrando consulta', err)
    toastShow('Error al guardar la consulta', 'error')
  }
}

const cancelarConsulta = () => {
  mostrarConsulta.value = false
}

// ---------- Helpers ----------
const estadoClase = (estado) => {
  if (estado === 'pendiente') return 'text-yellow-700 font-semibold'
  if (estado === 'completada') return 'text-green-700 font-semibold'
  if (estado === 'incompleta') return 'text-red-700 font-semibold'
  return ''
}

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const toastShow = (message, type = 'success', ms = 3500) => {
  clearTimeout(toastTimeout)
  toast.value = { message, type }
  toastTimeout = setTimeout(() => { toast.value = { message: '', type: 'success' } }, ms)
}

// ---------- Lifecycle ----------
onMounted(async () => {
  await cargarUsuario()
  await cargarPacientes()
  await cargarCitas()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* FullCalendar tweaks (colores compatibles con tailwind) */
.fc {
  --fc-border-color: #d1d5db;
  --fc-button-bg-color: #10b981;
  --fc-button-border-color: #10b981;
  --fc-button-hover-bg-color: #059669;
  --fc-button-hover-border-color: #059669;
  --fc-today-bg-color: #d1fae5;
  border-radius: 1rem;
  padding: 1rem;
}
</style>
