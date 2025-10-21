<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar -->
    <button @click="router.push('/clientes')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50">
      ← Volver a Clientes
    </button>

    <div class="w-full max-w-2xl p-8 ml-65">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">➕ Nuevo Cliente</h1>
        <p class="text-gray-500 text-sm mt-1">Registra un nuevo cliente en el sistema</p>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <form @submit.prevent="guardarCliente" class="space-y-6">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Nombres</label>
            <input v-model="cliente.nombres" type="text" placeholder="ej. Alberto"
              class="w-full border-black-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Apellidos</label>
            <input v-model="cliente.apellidos" type="text" placeholder="ej. Fernandez"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
            <div class="flex gap-2">
              <input type="text" value="+591" disabled
                class="w-20 border-gray-300 rounded-xl p-3 bg-gray-200 text-gray-700 cursor-not-allowed" />
              <input v-model="cliente.telefonoNum" type="text" placeholder="6XXXXXXX o 7XXXXXXX"
                class="flex-1 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                required />
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Zona</label>
            <input v-model="cliente.zona" type="text" placeholder="ej. Miraflores" required
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Calle</label>
            <input v-model="cliente.calle" type="text" placeholder="ej. Calle Hernando Siles" required
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Número</label>
            <input v-model="cliente.numero" type="text" placeholder="ej. 2355" required
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div class="flex justify-end">
            <button type="submit"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform">
              Guardar Cliente
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { clientesService } from "~/server/services/clientesService";
import ModalError from "~/components/modalError.vue";

const router = useRouter();
const cliente = ref({ nombres: "", apellidos: "", telefono: "", zona: "", calle: "", numero: "" });
const clientes = ref([]);

const modalVisible = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");

onMounted(async () => {
  try {
    clientes.value = await clientesService.listarClientes();
  } catch (e) {
    console.error(e);
  }
});

const handleModalClose = () => {
  modalVisible.value = false;
  if (modalTitle.value === '✅ Éxito') {
    router.push('/clientes');
  }
};

// 🧩 Diccionario ampliado y reglas base
const ofensivo = new RegExp(
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
      "(.){50,}",   // cadenas excesivamente largas sin espacios (ataques de buffer)
      "(%27)|(')|(%2D%2D)|(--)|(%23)|(#)", // variantes de inyección
      "(\\b(select|update|delete|insert|drop|alter|create)\\b\\s+.+\\b(from|into|table)\\b)"
    ].join("|") +
  ")\\b",
  "i"
);
const repetido = /(.)\1{3,}/; // 4 o más repeticiones
const doblesEspacios = / {2,}/;

// ✍️ Solo letras y espacios (para nombres y apellidos)
const contenidoValidoTexto = (texto) => {
  if (!texto || texto.trim() === "") return false;
  const limpio = texto.trim();

  const simbolos = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/; // solo letras y espacios

  if (ofensivo.test(limpio)) return false;
  if (repetido.test(limpio)) return false;
  if (simbolos.test(limpio)) return false;
  if (doblesEspacios.test(limpio)) return false;

  return true;
};

// 🏘️ Letras, espacios y hasta 3 números en total (para zona y calle)
const contenidoValidoDireccion = (texto) => {
  if (!texto || texto.trim() === "") return false;
  const limpio = texto.trim();

  const simbolos = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]/; // permite letras, números y espacios
  const cantidadNumeros = (limpio.match(/\d/g) || []).length; // contar cuántos números hay

  if (ofensivo.test(limpio)) return false;
  if (repetido.test(limpio)) return false;
  if (simbolos.test(limpio)) return false;
  if (doblesEspacios.test(limpio)) return false;
  if (cantidadNumeros > 3) return false; // máximo 3 números permitidos

  return true;
};

// 📱 Validación de teléfono
const validarTelefono = (tel) => {
  if (!tel || tel.trim() === "") return false;
  return /^[67]\d{7}$/.test(tel);
};

// 🏠 Validación de número de casa
const validarNumeroCasa = (num) => {
  if (num === null || num === undefined) return false;
  const str = String(num).trim();
  if (str === "") return false;
  return /^\d{1,6}$/.test(str);
};


// 📏 Validación de longitudes
const validarLongitud = (campo, min, max) => {
  if (!campo || campo.trim() === "") return false;
  const longitud = campo.trim().length;
  return longitud >= min && longitud <= max;
};

// 🚀 Función principal
const guardarCliente = async () => {
  const clienteData = cliente.value;

  // 🧠 Validación de nombres y apellidos
  if (!contenidoValidoTexto(clienteData.nombres)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "El nombre contiene texto inválido, ofensivo o símbolos no permitidos.";
    modalVisible.value = true;
    return;
  }

  if (!contenidoValidoTexto(clienteData.apellidos)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "El apellido contiene texto inválido, ofensivo o símbolos no permitidos.";
    modalVisible.value = true;
    return;
  }

  // 🧭 Validación de zona y calle (permiten hasta 3 números)
  if (!contenidoValidoDireccion(clienteData.zona)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "La zona contiene texto inválido o más de 3 números.";
    modalVisible.value = true;
    return;
  }

  if (!contenidoValidoDireccion(clienteData.calle)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "La calle contiene texto inválido o más de 3 números.";
    modalVisible.value = true;
    return;
  }

  // 📏 Longitudes
  if (!validarLongitud(clienteData.nombres, 3, 30)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "El nombre debe tener entre 3 y 30 caracteres.";
    modalVisible.value = true;
    return;
  }

  if (!validarLongitud(clienteData.apellidos, 3, 30)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "El apellido debe tener entre 3 y 30 caracteres.";
    modalVisible.value = true;
    return;
  }

  if (!validarLongitud(clienteData.zona, 3, 25)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "La zona debe tener entre 3 y 25 caracteres.";
    modalVisible.value = true;
    return;
  }

  if (!validarLongitud(clienteData.calle, 3, 30)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "La calle debe tener entre 3 y 30 caracteres.";
    modalVisible.value = true;
    return;
  }

  // 📞 Teléfono
  if (!validarTelefono(clienteData.telefonoNum)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "El teléfono debe empezar con 6 o 7, tener 8 dígitos y no contener letras.";
    modalVisible.value = true;
    return;
  }

  // 🏠 Número de casa
  if (!validarNumeroCasa(clienteData.numero)) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "El número de casa debe tener entre 1 y 6 dígitos numéricos.";
    modalVisible.value = true;
    return;
  }

  // 🔁 Duplicados
  const telefonoCompleto = "+591" + clienteData.telefonoNum;
  const duplicado = clientes.value.find(c =>
    c.nombres.toLowerCase() === clienteData.nombres.toLowerCase() &&
    c.apellidos.toLowerCase() === clienteData.apellidos.toLowerCase() &&
    c.telefono === telefonoCompleto
  );

  if (duplicado) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "Ya existe un cliente con esos datos.";
    modalVisible.value = true;
    return;
  }

  // 📨 Envío al backend
  const clienteEnviar = { ...clienteData, telefono: telefonoCompleto };

  try {
    await clientesService.crearCliente(clienteEnviar);
    modalTitle.value = "✅ Éxito";
    modalMessage.value = "Cliente registrado correctamente.";
    modalVisible.value = true;
  } catch (e) {
    modalTitle.value = "❌ Error";
    modalMessage.value = "Error al registrar cliente.";
    modalVisible.value = true;
  }
};


</script>
