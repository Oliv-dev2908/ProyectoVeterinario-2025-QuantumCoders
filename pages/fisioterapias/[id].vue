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
            <input type="date" v-model="form.fecha"
              class="w-full border-gray-300 rounded-lg shadow-sm p-2 bg-gray-100 cursor-not-allowed" readonly />
          </div>

          <!-- Procedimiento -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">Procedimiento</label>
            <textarea v-model="form.procedimiento" placeholder="Describe el procedimiento"
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
const usuarioNombre = ref("")

const cargarDatos = async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")
    usuarios.value = await $fetch("/api/user")

    const data = await $fetch(`/api/fisioterapias/${route.params.id}`)
    form.value = { ...data }

    // buscar el nombre del usuario
    const usuario = usuarios.value.find((u) => u.id_usuario === data.id_usuario)
    nombreUsuario.value = usuario ? usuario.nombre : "Desconocido"
  } catch (err) {
    console.error("Error al cargar fisioterapia:", err)
  }
}


// 🔹 Estado del modal
const modalVisible = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")

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

// 🔹 Validaciones ofensivas / SQL / repetitivas
const contieneContenidoProhibido = (texto) => {
  const sqlPattern =
    /\b(SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|CREATE|EXEC|UNION|--|;)\b/i
  const badWordsList = new RegExp(
    "\\b(" +
    [
      // 🧠 Lenguaje ofensivo general
      "idiota", "tonto", "estupido", "imbecil", "burro", "bobo", "tarado", "mongol",
      "retrasado", "animal", "bruto", "baboso", "pendejo", "gilipollas", "pelotudo",
      "boludo", "mierda", "maldito", "malparido", "culero", "cabrón", "cabron", "zorra",
      "puta", "puto", "putita", "putilla", "putilla", "maricon", "maricón", "marica",
      "maricona", "lesbiana", "gay", "homosexual", "negro", "negrata", "chino", "gordo",
      "cerdo", "perra", "perro", "infeliz", "babosa", "asqueroso", "asquerosa", "menso",
      "estupida", "idiotez", "inutil", "zopenco", "tarada", "huevon", "huevón", "hueva",
      "huevada", "cojudo", "cojud@", "pajero", "pajera", "verga", "vergazo", "chingar",
      "chingada", "chingado", "chingón", "chingona", "malnacido", "malnacida", "desgraciado",
      "desgraciada", "imbécil", "bastardo", "bastarda", "estúpido", "maldita sea",
      "vete a la mierda", "vete al diablo", "carajo", "joder", "hostia", "polla", "culo",
      "coño", "cagada", "cagar", "me cago", "mierd@", "mierd4", "p3ndej", "imb3cil", "idi0ta",
      "t0nto", "put@", "estup1do", "imb3c1l",

      // 💬 Palabras ofensivas en inglés
      "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cock", "cunt", "faggot",
      "slut", "whore", "retard", "stupid", "idiot", "moron", "dumbass", "jerk", "loser",
      "son of a bitch", "motherfucker", "bullshit", "suck my", "damn", "bloody hell",

      // 🧨 Patrones de ataques XSS o inyección
      "<script>", "<\\/script>", "javascript:", "onerror=", "onload=", "alert\\(", "prompt\\(",
      "confirm\\(", "document\\.cookie", "document\\.write", "<iframe", "<img", "<svg",
      "<embed", "<object", "<link", "<meta", "<base", "innerHTML", "eval\\(", "fetch\\(",
      "XMLHttpRequest", "window\\.location", "window\\.open", "<style>", "<marquee>",

      // 💣 SQL Injection y comandos peligrosos
      "DROP\\s+TABLE", "DELETE\\s+FROM", "INSERT\\s+INTO", "SELECT\\s+\\*", "UPDATE\\s+SET",
      "TRUNCATE", "ALTER\\s+TABLE", "CREATE\\s+DATABASE", "UNION\\s+SELECT", "OR\\s+1=1",
      "--", ";--", ";", "'\\s*--", "'\\s*#", "\"\\s*--", "\"\\s*#", "\\*\\/\\*", "xp_cmdshell",
      "exec\\s+", "execute\\s+", "sp_executesql", "information_schema", "sysobjects", "syscolumns",

      // ⚠️ Patrones sospechosos y repetitivos
      "/ {2,}/",
      "(.){50,}",   // cadenas excesivamente largas sin espacios (ataques de buffer)
      "(%27)|(')|(%2D%2D)|(--)|(%23)|(#)", // variantes de inyección
      "(\\b(select|update|delete|insert|drop|alter|create)\\b\\s+.+\\b(from|into|table)\\b)"
    ].join("|") +
    ")\\b",
    "i"
  );
  const repeticion = /(.)\1{4,}/ // 5 o más repeticiones

  if (sqlPattern.test(texto))
    return "El texto contiene código SQL no permitido."
  if (badWordsList.test(texto))
    return "El texto contiene lenguaje ofensivo o inapropiado."
  if (repeticion.test(texto))
    return "El texto contiene repeticiones sospechosas."

  return null
}

onMounted(async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")
    const data = await $fetch(`/api/fisioterapias/${route.params.id}`)
    Object.assign(form, data)
    const usuarioData = await $fetch(`/api/user/${form.id_usuario}`)
    usuarioNombre.value = usuarioData.nombre
    cargarDatos();
  } catch (err) {
    modalTitle.value = "❌ Error"
    modalMessage.value = "No se pudieron cargar los datos de la fisioterapia."
    modalVisible.value = true
  }
}
)

const actualizarFisioterapia = async () => {
  const hoy = new Date()
  const fechaSeleccionada = new Date(form.fecha)
  const maxFecha = new Date()
  maxFecha.setDate(hoy.getDate() + 20)

  // 🔹 Validaciones de campos requeridos
  if (!form.id_paciente || !form.procedimiento || !form.fecha) {
    modalTitle.value = "⚠️ Campos incompletos"
    modalMessage.value = "Por favor completa todos los campos obligatorios."
    modalVisible.value = true
    return
  }

  // 🔹 Validación de longitud mínima y máxima
  const texto = form.procedimiento.trim()
  if (texto.length < 10)
    return mostrarModal("⚠️ Texto demasiado corto", "El procedimiento debe tener al menos 10 caracteres.")
  if (texto.length > 200)
    return mostrarModal("⚠️ Texto demasiado largo", "El procedimiento no puede superar los 200 caracteres.")

  // 🔹 Validaciones de contenido ofensivo / SQL / repetitivo
  const errorProcedimiento = contieneContenidoProhibido(texto)
  if (errorProcedimiento) {
    modalTitle.value = "⚠️ Procedimiento inválido"
    modalMessage.value = errorProcedimiento
    modalVisible.value = true
    return
  }

  try {
    await $fetch(`/api/fisioterapias/${route.params.id}`, {
      method: "PUT",
      body: form
    })

    modalTitle.value = "✅ Éxito"
    modalMessage.value = "Fisioterapia actualizada correctamente."
    modalVisible.value = true
  } catch (err) {
    modalTitle.value = "❌ Error"
    modalMessage.value =
      "Error al actualizar la fisioterapia: " +
      (err.data?.error || err.message)
    modalVisible.value = true
  }
}
</script>
