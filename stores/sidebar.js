// stores/sidebar.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(false)
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  return { isCollapsed, toggleSidebar }
})
