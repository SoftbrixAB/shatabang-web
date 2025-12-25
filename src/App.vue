<template>
  <div id="app" class="h-full w-full flex flex-col">
    <!-- Navigation (hidden on login page) -->
    <NavigationBar v-if="showNavigation" />

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from './components/common/NavigationBar.vue'

const route = useRoute()

// Hide navigation on login page
const showNavigation = computed(() => route.name !== 'login')
</script>

<style scoped>
</style>
