<template>
  <div class="admin-view h-full p-4">
    <h1 class="text-2xl font-bold mb-6">Admin Panel</h1>

    <div class="grid gap-4 max-w-2xl">
      <!-- Server Info -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-2">Server Information</h2>
        <div class="text-sm text-gray-600">
          <p>Version: <span class="font-mono">{{ serverVersion }}</span></p>
        </div>
      </div>

      <!-- Cache Management -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Image Fingerprint Cache</h2>
        <p class="text-sm text-gray-600 mb-4">
          Rebuild the image fingerprint index to update the media database.
        </p>
        <button
          @click="rebuildCache"
          :disabled="rebuilding"
          class="btn-primary"
        >
          {{ rebuilding ? 'Rebuilding...' : 'Rebuild Image Fingerprint Index' }}
        </button>
      </div>

      <!-- Queue Management -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-3">Queue Management</h2>
        <a
          href="/arena"
          target="_blank"
          class="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Open Arena Queue Dashboard
        </a>
      </div>

      <!-- Admin functionality placeholder -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-700">
          Full admin functionality coming in Phase 7
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const serverVersion = ref('Loading...')
const rebuilding = ref(false)

onMounted(async () => {
  try {
    const response = await api.get('/api/version')
    serverVersion.value = response.data.version || 'Unknown'
  } catch (error) {
    serverVersion.value = 'Error loading version'
  }
})

async function rebuildCache() {
  if (rebuilding.value) return

  rebuilding.value = true
  try {
    await api.post('/api/images/rebuild')
    alert('Cache rebuild started successfully')
  } catch (error) {
    alert('Failed to rebuild cache: ' + error)
  } finally {
    rebuilding.value = false
  }
}
</script>
