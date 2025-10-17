<template>
  <div class="flex min-h-screen bg-gray-50 transition-all duration-300">
    <!-- 🐾 Sidebar -->
    <Sidebar v-if="showSidebar" />

    <!-- 🌿 Contenido principal -->
    <div
      class="flex-1 overflow-y-auto transition-all duration-300"
      :class="[
        showSidebar
          ? (sidebar.isCollapsed ? 'ml-20' : 'ml-64')
          : 'ml-0'
      ]"
    >
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Sidebar from '~/components/sideBar.vue'
import { useSidebarStore } from '~/stores/sidebar'

const sidebar = useSidebarStore()
const route = useRoute()

const noSidebarRoutes = ['/login', '/signup', '/no-permission']
const showSidebar = computed(() => !noSidebarRoutes.includes(route.path))
</script>
