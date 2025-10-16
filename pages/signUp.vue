<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden"
    @mousemove="moveEyes"
  >
    <div class="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
      
      <!-- 🐾 Panel izquierdo - Animales -->
      <div class="w-1/2 flex items-center justify-center bg-gray-100 relative p-8">
        <div class="relative w-64 h-64 flex items-end justify-center">
          <div class="left-section">
            <div class="animals-container">
              <!-- Perrito -->
              <div class="animal dog">
                <div class="dog-body">
                  <div class="dog-head">
                    <div class="dog-ear left"></div>
                    <div class="dog-ear right"></div>
                    <div class="dog-eyes">
                      <div class="dog-eye"><div class="dog-pupil"></div></div>
                      <div class="dog-eye"><div class="dog-pupil"></div></div>
                    </div>
                    <div class="dog-nose"></div>
                    <div class="dog-mouth"></div>
                  </div>
                  <div class="dog-tail"></div>
                </div>
                <div class="dog-legs">
                  <div class="dog-leg"></div>
                  <div class="dog-leg"></div>
                </div>
              </div>

              <!-- Gatito -->
              <div class="animal cat">
                <div class="cat-body">
                  <div class="cat-head">
                    <div class="cat-ear left"><div class="cat-ear-inner"></div></div>
                    <div class="cat-ear right"><div class="cat-ear-inner"></div></div>
                    <div class="cat-eyes">
                      <div class="cat-eye"><div class="cat-pupil"></div></div>
                      <div class="cat-eye"><div class="cat-pupil"></div></div>
                    </div>
                    <div class="cat-nose"></div>
                    <div class="cat-whiskers">
                      <div class="cat-whisker left-1"></div>
                      <div class="cat-whisker left-2"></div>
                      <div class="cat-whisker right-1"></div>
                      <div class="cat-whisker right-2"></div>
                    </div>
                  </div>
                  <div class="cat-tail"></div>
                </div>
              </div>

              <!-- Conejito -->
              <div class="animal rabbit">
                <div class="rabbit-body">
                  <div class="rabbit-head">
                    <div class="rabbit-ear left"><div class="rabbit-ear-inner"></div></div>
                    <div class="rabbit-ear right"><div class="rabbit-ear-inner"></div></div>
                    <div class="rabbit-eyes">
                      <div class="rabbit-eye"><div class="rabbit-pupil"></div></div>
                      <div class="rabbit-eye"><div class="rabbit-pupil"></div></div>
                    </div>
                    <div class="rabbit-nose"></div>
                    <div class="rabbit-teeth">
                      <div class="rabbit-tooth"></div>
                      <div class="rabbit-tooth"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🧩 Panel derecho - Signup -->
      <div class="w-1/2 p-10 flex flex-col justify-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-2 text-center">Crear cuenta</h2>
        <p class="text-gray-500 mb-6 text-center">Completa tus datos para registrarte 🐾</p>

        <p v-if="errorMsg" class="text-red-500 text-sm mb-4 text-center">{{ errorMsg }}</p>

        <form @submit.prevent="signUp" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">Nombre completo</label>
            <input v-model="fullName" type="text" placeholder="Juan Pérez"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"/>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">Correo</label>
            <input v-model="email" type="email" placeholder="ejemplo@email.com"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"/>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">Contraseña</label>
            <input id="password" v-model="password" type="password" placeholder="••••••••" 
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"/>
          </div>

          <button type="submit"
            class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            Registrarse
          </button>
        </form>

        <!-- OAuth Buttons -->
        <div class="my-6 space-y-3">
          <button @click="signInWithGoogleAuth" class="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5"/>
            Continuar con Google
          </button>
          <button @click="signInWithFacebookAuth" class="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition">
            <!-- Facebook SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 text-blue-600" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/>
            </svg>
            Continuar con Facebook
          </button>
          <button @click="signInWithLinkedInAuth" class="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition">
            <!-- LinkedIn SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 text-blue-700" viewBox="0 0 448 512">
              <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24 107 0 83 0 53.4a53.4 53.4 0 01106.8 0c0 29.6-23.4 53.6-53.36 53.6zM447.9 448h-92.4V302.4c0-34.7-12.5-58.4-43.6-58.4-23.8 0-38.1 16-44.3 31.4-2.3 5.6-2.9 13.3-2.9 21.1V448h-92.4s1.2-270.1 0-299.1h92.4v42.4c12.3-19 34.3-46.1 83.5-46.1 61 0 107 39.8 107 125.3z"/>
            </svg>
            Continuar con LinkedIn
          </button>
        </div>

        <!-- Redirigir a login -->
        <p class="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes cuenta?
          <button @click="goToSignIn" class="text-blue-600 hover:underline font-medium">Inicia Sesion</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import "./login.css";
import { ref } from 'vue'
import { useRouter } from 'nuxt/app'

const client = useSupabaseClient()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref(null)

const moveEyes = (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 10
  const y = (e.clientY / window.innerHeight - 0.5) * 10
  const pupils = document.querySelectorAll('.dog-pupil, .cat-pupil, .rabbit-pupil')
  pupils.forEach(pupil => {
    pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
  })
}

function closeAllEyes() {
  document.querySelectorAll(".dog-eye, .cat-eye, .rabbit-eye").forEach((eye) => {
    eye.classList.add("closed");
  });
}
function openAllEyes() {
  document.querySelectorAll(".dog-eye, .cat-eye, .rabbit-eye").forEach((eye) => {
    eye.classList.remove("closed");
  });
}

async function signUp() {
  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: { data: { full_name: fullName.value } }
    })
    if (error) throw error
    await fetch(`/api/user/loginsignup?uuid=${data.user.id}&name=${fullName.value}`)
    router.push("/confirm")
  } catch (error) {
    errorMsg.value = error.message
  }
}
onMounted(() => {
  const passwordInput = document.getElementById("password");

  passwordInput.addEventListener("focus", closeAllEyes);
  passwordInput.addEventListener("blur", openAllEyes);
});

const goToSignIn = () => router.push('/login')
const signInWithGoogleAuth = async () => client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/confirm` } })
const signInWithFacebookAuth = async () => client.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: `${window.location.origin}/confirm` } })
const signInWithLinkedInAuth = async () => client.auth.signInWithOAuth({ provider: 'linkedin_oidc', options: { redirectTo: `${window.location.origin}/confirm` } })
</script>
