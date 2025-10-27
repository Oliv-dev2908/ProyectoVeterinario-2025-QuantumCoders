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
            <input v-model="cliente.nombres" @blur="validarCampo('nombres')" type="text" placeholder="ej. Alberto"
              class="w-full border-black-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Apellidos</label>
            <input v-model="cliente.apellidos" @blur="validarCampo('apellidos')" type="text" placeholder="ej. Fernandez"
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
              required />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
            <div class="flex gap-2">
              <input type="text" value="+591" disabled
                class="w-20 border-gray-300 rounded-xl p-3 bg-gray-200 text-gray-700 cursor-not-allowed" />
              <input v-model="cliente.telefonoNum" @blur="validarCampo('telefono')" type="text" placeholder="6XXXXXXX o 7XXXXXXX"
                class="flex-1 border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition"
                required />
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Zona</label>
            <input v-model="cliente.zona" @blur="validarCampo('zona')" type="text" placeholder="ej. Miraflores" required
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Calle</label>
            <input v-model="cliente.calle" @blur="validarCampo('calle')" type="text" placeholder="ej. Calle Hernando Siles" required
              class="w-full border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>

          <div>
            <label class="block text-gray-700 font-medium mb-2">Número</label>
            <input v-model="cliente.numero" @blur="validarCampo('numero')" type="text" placeholder="ej. 2355" required
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
const cliente = ref({ nombres: "", apellidos: "", telefonoNum: "", zona: "", calle: "", numero: "" });
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

// Patrones prohibidos
const contienePatronesProhibidos = (texto) => {
  const patrones = [
    /select|insert|delete|update|drop|alter|union|--|;/i, // SQL
    /(script|<|>)/i, // Inyección HTML/JS
    /(.)\1{3,}/, // Repeticiones sospechosas (4+ caracteres iguales)
    /[!@#$%^&*()_+=\[\]{};':"\\|,.<>?\/~`¿¡]/i, // Caracteres especiales
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, // Emojis
    / {2,}/, // Múltiples espacios
  ];
  return patrones.some((p) => p.test(texto));
};

// Palabras ofensivas
const contieneOfensas = (texto) => {
  const palabrasOfensivas = new RegExp(
    "\\b(" +
    [
      "idiota", "tonto", "estupido", "imbecil", "burro", "bobo", "tarado", "mongol",
      "retrasado", "animal", "bruto", "baboso", "pendejo", "gilipollas", "pelotudo",
      "boludo", "mierda", "maldito", "malparido", "culero", "cabr[oó]n", "zorra",
      "puta", "puto", "putita", "maricon", "maricón", "marica",
      "negro", "negrata", "gordo", "cerdo", "perra", "perro",
      "infeliz", "asqueroso", "menso", "estupida", "inutil",
      "huevon", "huev[oó]n", "cojudo", "verga", "chingar",
      "bastardo", "est[uú]pido", "carajo", "joder", "culo",
      "mierd@", "mierd4", "p3ndej", "imb3cil", "idi0ta", "put@",
      "fuck", "shit", "bitch", "asshole", "dick", "damn"
    ].join("|") +
    ")\\b",
    "i"
  );
  return palabrasOfensivas.test(texto);
};

// Validar solo letras (nombres y apellidos)
const validarSoloLetras = (texto, nombre) => {
  if (!texto || texto.trim().length === 0) {
    return `${nombre} no puede estar vacío o contener solo espacios.`;
  }

  const limpio = texto.trim();
  
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio)) {
    return `${nombre} solo puede contener letras y espacios.`;
  }

  if (contienePatronesProhibidos(limpio)) {
    return `${nombre} contiene caracteres no permitidos, emojis o espacios múltiples.`;
  }

  if (contieneOfensas(limpio)) {
    return `${nombre} contiene palabras ofensivas o inapropiadas.`;
  }

  return null;
};

// Validar dirección (zona y calle - máximo 3 números)
const validarDireccion = (texto, nombre) => {
  if (!texto || texto.trim().length === 0) {
    return `${nombre} no puede estar vacío o contener solo espacios.`;
  }

  const limpio = texto.trim();
  const cantidadNumeros = (limpio.match(/\d/g) || []).length;

  if (cantidadNumeros > 3) {
    return `${nombre} no puede contener más de 3 números.`;
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/.test(limpio)) {
    return `${nombre} solo puede contener letras, números y espacios.`;
  }

  if (contienePatronesProhibidos(limpio)) {
    return `${nombre} contiene caracteres no permitidos, emojis o espacios múltiples.`;
  }

  if (contieneOfensas(limpio)) {
    return `${nombre} contiene palabras ofensivas o inapropiadas.`;
  }

  return null;
};

// Validar longitud
const validarLongitud = (texto, nombre, min, max) => {
  const longitud = texto.trim().length;
  if (longitud < min || longitud > max) {
    return `${nombre} debe tener entre ${min} y ${max} caracteres.`;
  }
  return null;
};

// Validar teléfono
const validarTelefono = (tel) => {
  if (!tel || tel.trim() === "") {
    return "El teléfono no puede estar vacío.";
  }
  if (!/^[67]\d{7}$/.test(tel)) {
    return "El teléfono debe empezar con 6 o 7 y tener exactamente 8 dígitos.";
  }
  return null;
};

// Validar número de casa
const validarNumeroCasa = (num) => {
  if (!num || String(num).trim() === "") {
    return "El número de casa no puede estar vacío.";
  }
  if (!/^\d{1,6}$/.test(String(num))) {
    return "El número de casa debe tener entre 1 y 6 dígitos.";
  }
  return null;
};

// Validar campo individual
const validarCampo = (campo) => {
  const c = cliente.value;
  let error = null;

  switch (campo) {
    case 'nombres':
      error = validarSoloLetras(c.nombres, "Nombres") || validarLongitud(c.nombres, "Nombres", 3, 30);
      break;
    case 'apellidos':
      error = validarSoloLetras(c.apellidos, "Apellidos") || validarLongitud(c.apellidos, "Apellidos", 3, 30);
      break;
    case 'telefono':
      error = validarTelefono(c.telefonoNum);
      break;
    case 'zona':
      error = validarDireccion(c.zona, "Zona") || validarLongitud(c.zona, "Zona", 3, 25);
      break;
    case 'calle':
      error = validarDireccion(c.calle, "Calle") || validarLongitud(c.calle, "Calle", 3, 30);
      break;
    case 'numero':
      error = validarNumeroCasa(c.numero);
      break;
  }

  if (error) {
    mostrarError(error);
  }
};

// 🚀 Guardar cliente
const guardarCliente = async () => {
  const c = cliente.value;

  // Validaciones completas antes de enviar
  const errores = [
    validarSoloLetras(c.nombres, "Nombres"),
    validarLongitud(c.nombres, "Nombres", 3, 30),
    validarSoloLetras(c.apellidos, "Apellidos"),
    validarLongitud(c.apellidos, "Apellidos", 3, 30),
    validarTelefono(c.telefonoNum),
    validarDireccion(c.zona, "Zona"),
    validarLongitud(c.zona, "Zona", 3, 25),
    validarDireccion(c.calle, "Calle"),
    validarLongitud(c.calle, "Calle", 3, 30),
    validarNumeroCasa(c.numero),
  ];

  const error = errores.find((e) => e);
  if (error) return mostrarError(error);

  // Verificar duplicados
  const telefonoCompleto = "+591" + c.telefonoNum;
  const duplicado = clientes.value.find(cl =>
    cl.nombres.toLowerCase() === c.nombres.toLowerCase() &&
    cl.apellidos.toLowerCase() === c.apellidos.toLowerCase() &&
    cl.telefono === telefonoCompleto
  );

  if (duplicado) {
    return mostrarError("Ya existe un cliente con esos datos.");
  }

  // Enviar al backend
  const clienteEnviar = { 
    nombres: c.nombres.trim(),
    apellidos: c.apellidos.trim(),
    telefono: telefonoCompleto,
    zona: c.zona.trim(),
    calle: c.calle.trim(),
    numero: c.numero
  };

  try {
    await clientesService.crearCliente(clienteEnviar);
    modalTitle.value = "✅ Éxito";
    modalMessage.value = "Cliente registrado correctamente.";
    modalVisible.value = true;
  } catch (e) {
    modalTitle.value = "❌ Error";
    modalMessage.value = e.data?.message || "Error al registrar cliente.";
    modalVisible.value = true;
  }
};

// Mostrar modal de error
const mostrarError = (mensaje) => {
  modalTitle.value = "⚠️ Validación";
  modalMessage.value = mensaje;
  modalVisible.value = true;
};
</script>