<template>
  <aside :class="[
    'fixed top-0 left-0 h-screen bg-white shadow-xl border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out z-50',
    isCollapsed ? 'w-20' : 'w-64'
  ]">
    <!-- 🐾 Encabezado -->
    <div class="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
      <div class="flex items-center gap-2">
        <h1 v-if="!isCollapsed" class="text-xl font-bold text-emerald-600 tracking-wide">
          Animal Center🐾
        </h1>
      </div>

      <button @click="toggleSidebar" class="text-gray-400 hover:text-emerald-500 transition">
        <i :class="['fas', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
      </button>
    </div>

    <!-- 🌿 Menú -->
    <nav
      class="flex-1 px-3 py-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100">
      <div v-for="item in filteredMenuItems" :key="item.label" @click="goTo(item.path)"
        :title="isCollapsed ? item.label : ''" :class="[
          'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 relative',
          isActive(item.path)
            ? 'bg-emerald-100 text-emerald-700 font-medium'
            : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
        ]">
        <i :class="['fas', item.icon, 'w-6 text-center']"></i>
        <span v-if="!isCollapsed">{{ item.label }}</span>
      </div>

    </nav>

    <!-- ⚙️ Footer -->
    <div class="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10">
      <div class="flex items-center gap-3 text-gray-500 hover:text-red-500 cursor-pointer transition" @click="signOut">
        <i class="fas fa-sign-out-alt w-6 text-center"></i>
        <span v-if="!isCollapsed">Cerrar sesión</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseUser } from '#imports'
import { useUser } from '~/composables/useUser'
import { useSidebar } from '~/composables/useSidebar'
import '@fortawesome/fontawesome-free/css/all.min.css'


const selected = ref('Inicio')
const router = useRouter()
const user = useSupabaseUser()
const { getUserRole } = useUser()
const userRole = ref(null)
const { isCollapsed, toggleSidebar } = useSidebar()
const route = useRoute()

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const goTo = (path) => router.push(path)

const client = useSupabaseClient()
// 🔑 Cerrar sesión
async function signOut() {
  try {
    await client.auth.signOut()
    router.push('/login')
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
  }
}

// 🧭 Menú general
const menuItems = [
  { label: 'Inicio', icon: 'fa-home', path: '/' },
  { label: 'Pacientes', icon: 'fa-paw', path: '/pacientes' },
  { label: 'Consultas', icon: 'fa-stethoscope', path: '/consultas' },
  { label: 'Citas', icon: 'fa-calendar-check', path: '/citas' },
  { label: 'Cirugías', icon: 'fa-syringe', path: '/cirugias' },
  { label: 'Fisioterapias', icon: 'fa-heartbeat', path: '/fisioterapias' },
  { label: 'Tratamientos', icon: 'fa-pills', path: '/tratamientos' },
  { label: 'Clientes', icon: 'fa-user-friends', path: '/clientes' },
  { label: 'Usuarios', icon: 'fa-user-shield', path: '/usuarios' },
  { label: 'Expedientes', icon: 'fa-folder-open', path: '/expedientes' }
]

// 🧩 Permisos por ruta
const routeRoles = {
  '/cirugias': ['administrador', 'cirujano'],
  '/citas': ['administrador', 'cirujano', 'veterinario', 'enfermero', 'recepcionista'],
  '/clientes': ['administrador', 'recepcionista'],
  '/consultas': ['administrador', 'cirujano', 'veterinario', 'enfermero', 'recepcionista'],
  '/fisioterapias': ['administrador', 'veterinario', 'enfermero', 'recepcionista'],
  '/pacientes': ['administrador', 'recepcionista'],
  '/reportes': ['administrador', 'veterinario', 'enfermero', 'recepcionista'],
  '/tratamientos': ['administrador', 'veterinario', 'enfermero', 'recepcionista', 'cirujano'],
  '/usuarios': ['administrador'],
  '/expedientes': ['administrador', 'veterinario', 'enfermero', 'recepcionista', 'cirujano']
}

// 🧮 Filtrar ítems según rol del usuario
const filteredMenuItems = computed(() => {
  if (!userRole.value) return []
  return menuItems.filter((item) => {
    const allowed = routeRoles[item.path]
    return !allowed || allowed.includes(userRole.value)
  })
})



// 🧠 Obtener rol del usuario al montar

onMounted(async () => {
  if (user.value) {
    const roleId = await getUserRole(user.value.id)
    const roleMap = { 1: 'usuario', 2: 'administrador', 3: 'cirujano', 4: 'veterinario', 6: 'enfermero', 7: 'recepcionista' }
    userRole.value = roleMap[roleId] || 'usuario'
  }
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 9999px;
}
</style>
