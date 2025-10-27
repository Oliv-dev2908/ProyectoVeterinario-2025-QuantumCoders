<template>
  <div v-if="modelValue"
       class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
    <div class="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-gray-200">
      <h2 class="text-xl font-bold text-green-600 mb-3">{{ title }}</h2>
      <p class="text-gray-700 mb-5">{{ message }}</p>
      <button @click="cerrar"
              class="bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-5 py-2 rounded-lg shadow transition">
        Aceptar
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: "¡Éxito!" },
  message: { type: String, default: "Operación realizada correctamente" },
});

const emit = defineEmits(["update:modelValue", "close"]);

const cerrar = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>
