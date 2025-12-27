<template>
  <div class="user-info flex items-center gap-3">
    <div v-if="authStore.user" class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-medium text-gray-700">
          {{ authStore.user.displayName || authStore.user.username }}
        </p>
        <p v-if="authStore.user.email" class="text-xs text-gray-500">
          {{ authStore.user.email }}
        </p>
      </div>
      <button
        @click="handleLogout"
        class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        :disabled="loggingOut"
      >
        {{ loggingOut ? 'Logging out...' : 'Logout' }}
      </button>
    </div>
    <div v-else class="text-sm text-gray-500">
      Not logged in
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const loggingOut = ref(false)

async function handleLogout() {
  if (loggingOut.value) return

  loggingOut.value = true
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    loggingOut.value = false
  }
}
</script>
