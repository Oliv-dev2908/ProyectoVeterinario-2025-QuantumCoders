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
const usuarios = ref([]) // 🔹 declarar usuarios

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

const handleModalClose = () => {
  modalVisible.value = false
  if (modalTitle.value === "✅ Éxito") router.push("/consultas")
}

onMounted(async () => {
  const id = route.params.id
  try {
    // Cargar pacientes y usuarios
    pacientes.value = await $fetch("/api/pacientes")
    usuarios.value = await $fetch("/api/user") // 🔹 añadimos esto

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

    // 🔹 Buscar nombre del usuario que registró la consulta
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

const actualizarConsulta = async () => {
  try {
    if (!form.value.id_paciente) {
      modalTitle.value = "⚠️ Error"
      modalMessage.value = "Debe seleccionar un paciente."
      modalVisible.value = true
      return
    }

    const camposTexto = ["motivo", "signosclinicos", "curso", "diagnosticopresuntivo", "observaciones", "condicion"]
    for (let campo of camposTexto) {
      const resultado = validarTexto(form.value[campo]);
      if (!resultado.valido) {
        modalTitle.value = "⚠️ Error";
        modalMessage.value = `El campo "${campo}" contiene contenido no permitido: ${resultado.tipo}.`;
        modalVisible.value = true;
        return;
      }
    }


    if (!form.value.motivo) {
      modalTitle.value = "⚠️ Error"
      modalMessage.value = "El motivo no puede estar vacio."
      modalVisible.value = true
      return
    }

    // Validar fecha próxima consulta
    if (form.value.fechaproxconsulta) {
      const fechaConsulta = new Date(form.value.fecha)
      const fechaProx = new Date(form.value.fechaproxconsulta)
      const diferenciaDias = (fechaProx - fechaConsulta) / (1000 * 60 * 60 * 24)
      const hora = fechaProx.getHours() + fechaProx.getMinutes() / 60

      if (fechaProx < fechaConsulta) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "La fecha próxima consulta no puede ser anterior a la fecha de la consulta."
        modalVisible.value = true
        return
      }
      if (diferenciaDias > 20) {
        modalTitle.value = "⚠️ Error"
        modalMessage.value = "La fecha próxima consulta no puede superar 20 días desde la fecha actual."
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



    // Actualizar consulta
    const body = { ...form.value }
    await $fetch(`/api/consultas/${form.value.id_consulta}`, { method: "PUT", body })

    // Crear o actualizar cita
    if (form.value.fechaproxconsulta) {
      if (form.value.id_cita) {
        await $fetch(`/api/citas/${form.value.id_cita}`, {
          method: "PUT",
          body: {
            id_paciente: form.value.id_paciente,
            fecha_hora: form.value.fechaproxconsulta,
            motivo: form.value.motivo || "Consulta de seguimiento",
            estado: "pendiente",
            recordatorio_enviado: false
          }
        })
      } else {
        const nuevaCita = await $fetch("/api/citas", {
          method: "POST",
          body: {
            id_paciente: form.value.id_paciente,
            fecha_hora: form.value.fechaproxconsulta,
            motivo: form.value.motivo || "Consulta de seguimiento",
            estado: "pendiente",
            recordatorio_enviado: false,
            id_consulta: form.value.id_consulta
          }
        })
        await $fetch(`/api/consultas/${form.value.id_consulta}`, {
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
