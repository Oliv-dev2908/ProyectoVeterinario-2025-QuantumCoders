<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
        <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
            <!-- Bienvenida -->
            <h1 class="text-3xl font-bold text-gray-800 mb-4">
                ¡Bienvenido, {{
                    user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    user?.user_metadata?.preferred_username ||
                user?.email ||
                'Usuario'
                }}! 🎉
            </h1>

            <!-- Info del usuario -->
            <p class="text-gray-600 mb-6">
                Tu correo: <span class="font-medium">{{ user?.email }}</span>
            </p>

            <h1>
                Espere la autorizacion del administrador
            </h1>

            <br>

            <!-- Botón de logout -->
            <button @click="signOut"
                class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                Cerrar Sesión
            </button>

            
        </div>
    </div>
</template>

<script setup>
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useRouter } from 'nuxt/app'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

// 🔑 Función para cerrar sesión
async function signOut() {
    try {
        await client.auth.signOut() // cierra sesión en Supabase
        router.push('/login') // te redirige al login
    } catch (error) {
        console.error("Error al cerrar sesión:", error)
    }
}
</script>
