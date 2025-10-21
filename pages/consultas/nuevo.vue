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
        <h1 class="text-3xl font-bold text-gray-800">➕ Nueva Consulta</h1>
        <p class="text-gray-500 text-sm mt-1">Registra una nueva consulta</p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarConsulta" class="space-y-6">
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
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Signos clínicos -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">⚕️ Signos clínicos</label>
            <textarea v-model="form.signosclinicos" placeholder="Ej: fiebre, tos..."
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Curso -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🔁 Curso</label>
            <textarea v-model="form.curso" placeholder="Evolución del cuadro clínico"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Diagnóstico presuntivo -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🧠 Diagnóstico presuntivo</label>
            <textarea v-model="form.diagnosticopresuntivo"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Observaciones -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">🧾 Observaciones</label>
            <textarea v-model="form.observaciones"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"></textarea>
          </div>

          <!-- Próxima consulta -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">📆 Fecha próxima consulta (opcional)</label>
            <input type="datetime-local" v-model="form.fechaproxconsulta"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Condición -->
          <div>
            <label class="block text-gray-700 font-medium mb-2">❤️ Condición</label>
            <input type="text" v-model="form.condicion" placeholder="Ej: estable, crítico..."
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <!-- Botón guardar -->
          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Guardar Consulta
            </button>
          </div>
        </form>

        <ModalError :visible="modalVisible" :title="modalTitle" :message="modalMessage" @close="handleModalClose" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "#imports"
import { useSupabaseUser } from "#imports"
import ModalError from "@/components/modalError.vue"

const router = useRouter()
const pacientes = ref([])
const user = useSupabaseUser()
const nombreUsuario = ref("Cargando...")

const form = ref({
  id_paciente: "",
  id_usuario: 0,
  motivo: "",
  signosclinicos: "",
  curso: "",
  fechaproxconsulta: "",
  diagnosticopresuntivo: "",
  observaciones: "",
  fecha: "",
  condicion: ""
})

const modalVisible = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === '✅ Éxito') {
    router.push('/consultas')
  }
}


const validarTexto = (texto) => {
  if (!texto) return { valido: true };

  // Patrones de inyección y XSS
  const patronesMaliciosos = [
    { regex: /select|insert|update|delete|drop|union|--/i, tipo: "SQL Injection" },
    { regex: /<script.*?>.*?<\/script>/i, tipo: "XSS" }
  ];

  for (let p of patronesMaliciosos) {
    if (p.regex.test(texto)) return { valido: false, tipo: p.tipo };
  }

  // Repeticiones
  const repetidos = /(.)\1{4,}/; // 5 caracteres iguales seguidos
  if (repetidos.test(texto)) return { valido: false, tipo: "Repetición excesiva de caracteres" };

  // Palabras ofensivas
  const palabrasOfensivas = new RegExp(
    "\\b(" +
    [
      "idiota", "tonto", "estupido", "imbecil", "burro", "bobo", "tarado", "mongol",
      "retrasado", "animal", "bruto", "baboso", "pendejo", "gilipollas", "pelotudo",
      "boludo", "mierda", "maldito", "malparido", "culero", "cabr[oó]n", "zorra",
      "puta", "puto", "putita", "putilla", "maric[oó]n", "marica", "maricona", "lesbiana",
      "gay", "homosexual", "negro", "negrata", "chino", "gordo", "cerdo", "perra", "perro",
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

  if (palabrasOfensivas.test(texto)) return { valido: false, tipo: "Palabra ofensiva o inapropiada" };

  return { valido: true };
};


onMounted(async () => {
  try {
    pacientes.value = await $fetch("/api/pacientes")

    const now = new Date()
    const boliviaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/La_Paz" }))
    const yyyy = boliviaTime.getFullYear()
    const mm = String(boliviaTime.getMonth() + 1).padStart(2, "0")
    const dd = String(boliviaTime.getDate()).padStart(2, "0")
    const hh = String(boliviaTime.getHours()).padStart(2, "0")
    const min = String(boliviaTime.getMinutes()).padStart(2, "0")
    form.value.fecha = `${yyyy}-${mm}-${dd}T${hh}:${min}`

    if (user.value?.id) {
      const usuarioData = await $fetch(`/api/user/${user.value.id}`)
      form.value.id_usuario = usuarioData.id_usuario
      nombreUsuario.value = usuarioData.nombre || "Usuario desconocido"
    } else {
      nombreUsuario.value = "No logueado"
    }
  } catch (err) {
    console.error("Error cargando datos:", err)
  }
})

const guardarConsulta = async () => {
  try {
    // Validaciones obligatorias
    if (!form.value.id_paciente) {
      modalTitle.value = "⚠️ Error"
      modalMessage.value = "Debe seleccionar un paciente."
      modalVisible.value = true
      return
    }

    if (!form.value.motivo) {
      modalTitle.value = "⚠️ Error"
      modalMessage.value = "El motivo no puede estar vacio."
      modalVisible.value = true
      return
    }

    // Validación campos de texto
    const camposTexto = ["motivo", "signosclinicos", "curso", "diagnosticopresuntivo", "observaciones", "condicion"];

    for (let campo of camposTexto) {
      const resultado = validarTexto(form.value[campo]);
      if (!resultado.valido) {
        modalTitle.value = "⚠️ Error";
        modalMessage.value = `El campo "${campo}" contiene contenido no permitido: ${resultado.tipo}.`;
        modalVisible.value = true;
        return;
      }
    }


    // Validación fecha próxima consulta
    if (form.value.fechaproxconsulta) {
      const fechaConsulta = new Date(form.value.fecha)
      const fechaProx = new Date(form.value.fechaproxconsulta)
      const diferenciaDias = (fechaProx - fechaConsulta) / (1000 * 60 * 60 * 24)
      const hora = fechaProx.getHours() + fechaProx.getMinutes() / 60

      if (fechaProx < fechaConsulta) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "La fecha de próxima consulta no puede ser anterior a la fecha de consulta actual."
        modalVisible.value = true
        return
      }

      if (diferenciaDias > 20) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "La fecha de próxima consulta no puede superar 20 días desde la fecha de consulta."
        modalVisible.value = true
        return
      }

      if (hora < 9 || hora > 21) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "La hora de próxima consulta debe estar entre 09:00 y 21:00."
        modalVisible.value = true
        return
      }
    }

    if (form.value.motivo.length < 10) {
      modalTitle.value = "⚠️ Error"
      modalMessage.value = "El motivo no puede tener menos de 10 caracteres"
      modalVisible.value = true
      return
    }

    if (form.value.motivo.length > 200) {
      modalTitle.value = "⚠️ Error"
      modalMessage.value = "El motivo no puede tener mas de 200 caracteres"
      modalVisible.value = true
      return
    }

    if (form.value.signosclinicos) {
      if (form.value.signosclinicos.length < 10) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "Los signos clinicos no puede tener menos de 10 caracteres"
        modalVisible.value = true
        return
      }

      if (form.value.motivo.length > 200) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "Los signos clinicos no puede tener mas de 200 caracteres"
        modalVisible.value = true
        return
      }
    }

    if (form.value.curso) {
      if (form.value.curso.length < 10) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "Curso no puede tener menos de 10 caracteres"
        modalVisible.value = true
        return
      }

      if (form.value.curso.length > 200) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "Curso no puede tener mas de 200 caracteres"
        modalVisible.value = true
        return
      }
    }

    if (form.value.diagnosticopresuntivo) {
      if (form.value.diagnosticopresuntivo.length < 10) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "Los diagnosticos presuntivos no puede tener menos de 10 caracteres"
        modalVisible.value = true
        return
      }

      if (form.value.diagnosticopresuntivo.length > 200) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "Los diagnosticos presuntivos no puede tener mas de 200 caracteres"
        modalVisible.value = true
        return
      }
    }

    if (form.value.observaciones) {
      if (form.value.observaciones.length < 10) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "Las observaciones no puede tener menos de 10 caracteres"
        modalVisible.value = true
        return
      }

      if (form.value.observaciones.length > 200) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "Las observaciones no puede tener mas de 200 caracteres"
        modalVisible.value = true
        return
      }
    }

    if (form.value.condicion) {
      if (form.value.condicion.length < 10) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "La condicion no puede tener menos de 10 caracteres"
        modalVisible.value = true
        return
      }

      if (form.value.condicion.length > 200) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "La condicion no puede tener mas de 200 caracteres"
        modalVisible.value = true
        return
      }
    }
    // Preparar envío
    const consultaBody = { ...form.value }
    if (!consultaBody.fechaproxconsulta) delete consultaBody.fechaproxconsulta

    const nuevaConsulta = await $fetch("/api/consultas", { method: "POST", body: consultaBody })

    // Crear cita si hay fecha próxima
    if (form.value.fechaproxconsulta) {
      const nuevaCita = await $fetch("/api/citas", {
        method: "POST",
        body: {
          id_paciente: form.value.id_paciente,
          fecha_hora: form.value.fechaproxconsulta,
          motivo: form.value.motivo || "Consulta de seguimiento",
          estado: "pendiente",
          recordatorio_enviado: false,
          id_consulta: nuevaConsulta.id_consulta
        }
      })
      await $fetch(`/api/consultas/${nuevaConsulta.id_consulta}`, {
        method: "PUT",
        body: { id_cita: nuevaCita.id_cita }
      })
    }

    modalTitle.value = "✅ Éxito"
    modalMessage.value = "Consulta registrada correctamente."
    modalVisible.value = true

  } catch (err) {
    console.error(err)
    modalTitle.value = "⚠️ Error"
    modalMessage.value = "Ocurrió un error al guardar la consulta."
    modalVisible.value = true
  }
}
</script>
