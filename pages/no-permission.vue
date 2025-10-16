<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6">
    <div class="bg-white rounded-3xl shadow-2xl p-10 max-w-lg text-center relative">
      <!-- Imagen de animal -->
      <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Gatito" class="w-32 mx-auto mb-6 animate-bounce">

      <!-- Título amistoso -->
      <h1 class="text-4xl font-bold text-green-700 mb-4">¡Ups!</h1>
      
      <!-- Mensaje -->
      <p class="text-gray-700 mb-6 text-lg">
        Parece que este lugar no es para ti 😺<br>
        Pero no te preocupes, todos nos perdemos a veces.
      </p>

      <!-- Botón para volver -->
      <button
        @click="goHome"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300"
      >
        Volver al inicio
      </button>

      <!-- Elementos decorativos animales -->
      <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="perrito" class="w-16 absolute top-4 left-4 animate-pulse">
      <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="perrito" class="w-16 absolute bottom-4 right-4 animate-pulse">
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/') // redirige al home
}
</script>

<style scoped>
/* Opcional: animación extra para el gatito */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
.animate-bounce {
  animation: bounce 1.5s infinite;
}
</style>
