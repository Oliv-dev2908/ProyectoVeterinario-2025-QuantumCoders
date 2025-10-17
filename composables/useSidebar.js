// composables/useSidebar.js
import { ref } from 'vue'

const sidebarOpen = ref(true)

export function useSidebar() {
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  return { sidebarOpen, toggleSidebar }
}
