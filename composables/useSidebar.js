import { ref } from 'vue'

const isCollapsed = ref(false)

export function useSidebar() {
  function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value
  }

  return {
    isCollapsed,
    toggleSidebar
  }
}
