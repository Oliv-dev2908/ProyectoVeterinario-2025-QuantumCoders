<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center relative"
      >
        <!-- ✨ Icono o encabezado -->
        <div class="flex flex-col items-center">
          <div class="bg-red-100 text-red-600 rounded-full p-3 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
              />
            </svg>
          </div>

          <h2 class="text-lg font-semibold text-gray-800 mb-2">
            {{ title || "¿Estás seguro?" }}
          </h2>

          <p class="text-gray-600 mb-6">
            {{ message || `¿Seguro que quieres eliminar ${itemName}?` }}
          </p>
        </div>

        <!-- 🔘 Botones -->
        <div class="flex justify-center gap-3">
          <button
            @click="handleCancel"
            class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            @click="handleConfirm"
            class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: "" },
  message: { type: String, default: "" },
  itemName: { type: String, default: "" },
})

const emits = defineEmits(["update:modelValue", "confirm", "cancel"])

const show = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => (show.value = val)
)

const handleConfirm = () => {
  emits("confirm")
  emits("update:modelValue", false)
}

const handleCancel = () => {
  emits("cancel")
  emits("update:modelValue", false)
}
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
</style>
