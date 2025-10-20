<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center relative">
    <!-- 🔙 Botón regresar fijo en esquina superior izquierda -->
    <button
      @click="router.push('/')"
      class="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-medium shadow transition-transform hover:scale-105 active:scale-95 z-50"
    >
      ← Volver al Inicio
    </button>

    <!-- Contenedor principal -->
    <div class="w-full max-w-2xl p-8 ml-65 text-center">
      <!-- Tarjeta central -->
      <div class="bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <!-- Icono divertido de veterinaria -->
        <div class="text-6xl mb-6">🐾</div>

        <h1 class="text-4xl font-bold text-gray-800 mb-4">404 - Página No Encontrada</h1>
        <p class="text-gray-500 text-lg mb-6">
          Lo sentimos, no pudimos encontrar la página que buscas.<br>
          Tal vez el perro se la llevó 🐶
        </p>

        <button
          @click="router.push('/')"
          class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 active:scale-95 transition-transform"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
