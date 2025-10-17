<template>
  <div class="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-200">
    <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[650px]">
      <!-- Encabezado -->
      <div class="bg-gradient-to-r from-blue-500 to-teal-400 p-6 text-white text-center">
        <h1 class="text-3xl font-extrabold mb-1">
          ¡Hola,
          {{
            user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            user?.user_metadata?.preferred_username ||
            user?.email ||
            'Usuario'
          }}! 🐾
        </h1>
        <p class="text-white/90 text-base">Nos alegra tenerte en la familia veterinaria</p>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 flex flex-col justify-center items-center p-6 space-y-4">
        <!-- Imagen de perfil -->
        <img
          :src="user?.user_metadata?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/194/194938.png'"
          alt="Foto de perfil"
          class="w-28 h-28 rounded-full border-4 border-teal-400 shadow-md object-cover"
        />

        <!-- Info -->
        <div class="text-center w-full">
          <div class="bg-gray-50 rounded-xl p-3 shadow mb-3">
            <p class="text-gray-700 font-semibold">📧 Correo</p>
            <p class="text-gray-600 text-sm">{{ user?.email }}</p>
          </div>

          <div class="bg-gray-50 rounded-xl p-3 shadow mb-3">
            <p class="text-gray-700 font-semibold">💼 Rol</p>
            <p class="text-emerald-600 capitalize font-medium">
              {{ roleName || 'usuario' }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-xl p-3 shadow">
            <p class="text-gray-700 font-semibold">🌟 Estado</p>
            <p
              v-if="roleName === 'usuario'"
              class="text-orange-500 text-sm mt-1"
            >
              Tu cuenta está pendiente de aprobación por el administrador 🕒
            </p>
            <p
              v-else
              class="text-blue-500 text-sm mt-1"
            >
              Activo en el sistema veterinario 🩺
            </p>
          </div>
        </div>
      </div>

      <!-- Pie -->
      <div class="bg-gray-100 text-center py-3 text-gray-500 text-sm">
        🐶 Clínica Veterinaria Quantum | Cuidando lo que más amas ❤️
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useRouter } from 'nuxt/app'
import { useUser } from '~/composables/useUser'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { getUserRole } = useUser()

const roleName = ref(null)

const roleMap = {
  1: 'usuario',
  2: 'administrador',
  3: 'cirujano',
  4: 'veterinario',
  6: 'enfermero',
  7: 'recepcionista'
}

onMounted(async () => {
  if (user.value) {
    const roleId = await getUserRole(user.value.id)
    roleName.value = roleMap[roleId] || 'usuario'
  }
})
</script>
