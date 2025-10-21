<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-200 flex flex-col items-center py-6">
    <!-- Usuario: Parte superior -->
    <div class="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-6 mb-6">
      <img :src="user?.user_metadata?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/194/194938.png'"
        alt="Foto de perfil" class="w-28 h-28 rounded-full border-4 border-teal-400 shadow-md object-cover mb-4" />

      <h1 class="text-3xl font-extrabold mb-1 text-center">
        ¡Hola, {{
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          user?.user_metadata?.preferred_username ||
          user?.email ||
          'Usuario'
        }}! 🐾
      </h1>
      <p class="text-gray-500 text-base mb-4">Nos alegra tenerte en la familia veterinaria</p>

      <div class="grid grid-cols-3 gap-4 w-full">
        <div class="bg-gray-50 rounded-xl p-3 shadow text-center">
          <p class="text-gray-700 font-semibold">📧 Correo</p>
          <p class="text-gray-600 text-sm">{{ user?.email }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3 shadow text-center">
          <p class="text-gray-700 font-semibold">💼 Rol</p>
          <p class="text-emerald-600 capitalize font-medium">{{ roleName || 'usuario' }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-3 shadow text-center">
          <p class="text-gray-700 font-semibold">🌟 Estado</p>
          <p v-if="roleName === 'usuario'" class="text-orange-500 text-sm mt-1">
            Tu cuenta está pendiente de aprobación por el administrador 🕒
          </p>
          <p v-else class="text-blue-500 text-sm mt-1">
            Activo en el sistema veterinario 🩺
          </p>
        </div>
      </div>
      <!-- Pie de página -->
      <div class="mt-6 text-gray-500 text-sm text-center">
        🐶 Clínica Veterinaria Quantum | Cuidando lo que más amas ❤️
      </div>
    </div>

    <!-- Contenido central: ML -->
    <div class="w-full max-w-5xl flex flex-col items-center space-y-6">
      <div v-if="loading" class="text-gray-500 text-lg">Cargando análisis...</div>

      <!-- Gráfico HDBSCAN -->
      <div v-if="mlVisuals" class="w-full bg-white p-6 rounded-3xl shadow-lg flex justify-center">
        <img :src="mlVisuals" alt="HDBSCAN Plot" class="rounded-xl shadow-lg max-w-full" />
      </div>

      <!-- Gráfico CatBoost Feature Importance -->
      <div v-if="catboostVisual" class="w-full bg-white p-6 rounded-3xl shadow-lg flex justify-center">
        <img :src="catboostVisual" alt="CatBoost Feature Importance" class="rounded-xl shadow-lg max-w-full" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseUser } from '#imports'
import { useUser } from '~/composables/useUser'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const mlVisuals = ref(null)
const catboostVisual = ref(null)
const mlAnalysis = ref(null)
const loading = ref(true)
const histogramChart = ref(null)

const user = useSupabaseUser()
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

  try {
    const res1 = await fetch('/api/machine1')
    const data1 = await res1.json()
    mlVisuals.value = `data:image/png;base64,${data1.hdbscan_plot_base64}`
    catboostVisual.value = `data:image/png;base64,${data1.catboost_feature_importance_base64}`

    const res2 = await fetch('/api/machine2')
    const data2 = await res2.json()
    mlAnalysis.value = data2

    const probs = mlAnalysis.value.predictions.map(p => p.prob_abandono)
    await nextTick()
    createHistogram(probs)
  } catch (error) {
    console.error('Error al cargar ML:', error)
  } finally {
    loading.value = false
  }
})

function createHistogram(values) {
  // Dividir en 20 bins por ejemplo
  const bins = 20
  const counts = new Array(bins).fill(0)
  const step = 1 / bins

  values.forEach(v => {
    const index = Math.min(Math.floor(v / step), bins - 1)
    counts[index]++
  })

  const labels = counts.map((_, i) => `${(i * step).toFixed(2)} - ${((i + 1) * step).toFixed(2)}`)

  const ctx = document.getElementById('histogram').getContext('2d')
  histogramChart.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Probabilidad de abandono',
        data: counts,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Distribución de probabilidad de abandono' }
      },
      scales: {
        y: { beginAtZero: true },
        x: { title: { display: true, text: 'Probabilidad' } }
      }
    }
  })
}
</script>
