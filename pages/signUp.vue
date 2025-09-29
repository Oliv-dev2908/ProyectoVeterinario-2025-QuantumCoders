<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
                Crear cuenta
            </h2>

            <!-- Error -->
            <p v-if="errorMsg" class="mb-4 text-red-500 text-sm text-center">
                {{ errorMsg }}
            </p>

            <!-- Formulario -->
            <form @submit.prevent="signUp" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nombre completo</label>
                    <input v-model="fullName" type="text" placeholder="Juan Pérez"
                        class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Correo</label>
                    <input v-model="email" type="email" placeholder="ejemplo@email.com"
                        class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input v-model="password" type="password" placeholder="••••••••"
                        class="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <button type="submit"
                    class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                    Registrarse
                </button>
            </form>

            <!-- Botón para iniciar Sesion -->
            <div class="mt-4 text-center">
                <p class="text-sm text-gray-600">
                    ¿Ya tienes cuenta?
                    <button @click="goToSignIn" class="text-blue-600 hover:underline font-medium">
                        Inicia Sesion
                    </button>
                </p>
            </div>

            <!-- Divider -->
            <div class="my-6 flex items-center">
                <div class="flex-grow h-px bg-gray-300"></div>
                <span class="px-3 text-gray-500 text-sm">o</span>
                <div class="flex-grow h-px bg-gray-300"></div>
            </div>

            <!-- OAuth Buttons (igual que login) -->
            <button @click="signInWithFacebookAuth"
                class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition mb-3">
                <!-- SVG Facebook -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
                </svg>
                Continuar con Facebook
            </button>

            <button @click="signInWithLinkedInAuth"
                class="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition mb-3">
                <!-- SVG LinkedIn -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 448 512" fill="currentColor">
                    <path
                        d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24 107 0 83 0 53.4a53.4 53.4 0 01106.8 0c0 29.6-23.4 53.6-53.36 53.6zM447.9 448h-92.4V302.4c0-34.7-12.5-58.4-43.6-58.4-23.8 0-38.1 16-44.3 31.4-2.3 5.6-2.9 13.3-2.9 21.1V448h-92.4s1.2-270.1 0-299.1h92.4v42.4c12.3-19 34.3-46.1 83.5-46.1 61 0 107 39.8 107 125.3z" />
                </svg>
                Continuar con LinkedIn
            </button>

            <button @click="signInWithGoogleAuth"
                class="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
                <!-- SVG Google -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="..." />
                    <path fill="#FF3D00" d="..." />
                    <path fill="#4CAF50" d="..." />
                    <path fill="#1976D2" d="..." />
                </svg>
                Continuar con Google
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'nuxt/app'

const client = useSupabaseClient()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref(null)

// 🔑 Registro con email/password
async function signUp() {
    try {
        const { data, error } = await client.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                data: { full_name: fullName.value } // <- esto se guarda en raw_user_meta_data
            }
        })
        if (error) throw error

        // Guardar en API si quieres
        await fetch(`/api/user/loginsignup?uuid=${data.user.id}&name=${fullName.value}`)

        router.push("/confirm") // página de confirmación
    } catch (error) {
        errorMsg.value = error.message
    }
}

// Redirigir a la página de registro
const goToSignIn = () => {
    router.push('/login') // Asegúrate que la ruta signup exista
}

// 🔑 OAuth (igual que login)
const signInWithFacebookAuth = async () => {
    const { error } = await client.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: `${window.location.origin}/confirm` },
    });
    if (error) console.log(error);
};

const signInWithLinkedInAuth = async () => {
    const { error } = await client.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { redirectTo: `${window.location.origin}/confirm` },
    });
    if (error) console.log(error);
};

const signInWithGoogleAuth = async () => {
    const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/confirm` },
    });
    if (error) console.log(error);
};
</script>
