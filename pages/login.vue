<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Iniciar Sesión
      </h2>

      <!-- Error -->
      <p v-if="errorMsg" class="mb-4 text-red-500 text-sm text-center">
        {{ errorMsg }}
      </p>

      <!-- Formulario Email/Password -->
      <form @submit.prevent="signIn" class="space-y-4">
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

        <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          Entrar
        </button>
      </form>

      <!-- Botón para registrarse -->
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          ¿No tienes cuenta?
          <button @click="goToSignUp" class="text-blue-600 hover:underline font-medium">
            Regístrate
          </button>
        </p>
      </div>

      <!-- Divider -->
      <div class="my-6 flex items-center">
        <div class="flex-grow h-px bg-gray-300"></div>
        <span class="px-3 text-gray-500 text-sm">o</span>
        <div class="flex-grow h-px bg-gray-300"></div>
      </div>


      <!-- OAuth Buttons -->
      <button @click="signInWithFacebookAuth"
        class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 
               1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 
               0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.403 
               24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
        </svg>
        Continuar con Facebook
      </button>

      <button @click="signInWithLinkedInAuth"
        class="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 448 512" fill="currentColor">
          <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24 107 0 
               83 0 53.4a53.4 53.4 0 01106.8 0c0 29.6-23.4 
               53.6-53.36 53.6zM447.9 448h-92.4V302.4c0-34.7-12.5-58.4-43.6-58.4-23.8 
               0-38.1 16-44.3 31.4-2.3 5.6-2.9 13.3-2.9 
               21.1V448h-92.4s1.2-270.1 0-299.1h92.4v42.4c12.3-19 
               34.3-46.1 83.5-46.1 61 0 107 39.8 107 
               125.3z" />
        </svg>
        Continuar con LinkedIn
      </button>

      <button @click="signInWithGoogleAuth"
        class="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 48 48">
          <path fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
          </path>
          <path fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
          </path>
          <path fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
          </path>
          <path fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
          </path>
        </svg>
        Continuar con Google
      </button>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'nuxt/app'
import { ref } from 'vue'

const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref("")
const password = ref("")
const errorMsg = ref(null)

// Redirigir a la página de registro
const goToSignUp = () => {
  router.push('/signUp') // Asegúrate que la ruta signup exista
}

// 🔑 Login con email/password
async function signIn() {
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) throw error

    // Guardar usuario en API y redirigir
    await fetch(`/api/user/loginsignup?uuid=${data.user.id}&name=${data.user.user_metadata.full_name || data.user.user_metadata.name || data.user.email}`)
    router.push("/")
  } catch (error) {
    errorMsg.value = error.message
  }
}

// 🔑 Login con OAuth
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
