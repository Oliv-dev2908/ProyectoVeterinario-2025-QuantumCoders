<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium">Nombre completo</label>
      <input v-model="form.nombre" type="text" class="w-full border rounded p-2" required />
    </div>

    <div>
      <label class="block text-sm font-medium">CI</label>
      <input v-model="form.ci" type="text" class="w-full border rounded p-2" required />
    </div>

    <div>
      <label class="block text-sm font-medium">Teléfono</label>
      <input v-model="form.telefono" type="text" class="w-full border rounded p-2" required />
    </div>

    <div>
      <label class="block text-sm font-medium">Dirección</label>
      <input v-model="form.direccion" type="text" class="w-full border rounded p-2" required />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
    >
      {{ loading ? "Guardando..." : "Guardar" }}
    </button>
  </form>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({ loading: Boolean });
const emit = defineEmits(["submit"]);

const form = ref({
  nombre: "",
  ci: "",
  telefono: "",
  direccion: "",
});

const onSubmit = () => {
  emit("submit", form.value);
};
</script>
