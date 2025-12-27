<template>
  <div class="admin-view h-full p-4">
    <h1 class="text-2xl font-bold mb-6">Admin Panel</h1>

    <div class="grid gap-4 max-w-2xl">
      <!-- Server Info -->
      <div class="card">
        <h2 class="text-lg font-semibold mb-2">Server Information</h2>
        <div class="text-sm text-gray-600">
          <p>Version: <span class="font-mono">{{ serverVersion }}</span></p>
        </div>
      </div>

      <!-- Cache Management -->
      <div class="card">
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
      <div class="card">
        <h2 class="text-lg font-semibold mb-3">Queue Management</h2>
        <p class="text-sm text-gray-600 mb-4">
          Monitor and manage background job queues.
        </p>
        <a
          href="/arena"
          target="_blank"
          class="btn-secondary inline-block"
        >
          Open Arena Queue Dashboard
        </a>
      </div>

      <!-- Status Messages -->
      <div v-if="statusMessage"
           :class="[
             'border rounded-lg p-4',
             statusType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
           ]">
        <p :class="[
             'text-sm',
             statusType === 'success' ? 'text-green-700' : 'text-red-700'
           ]">
          {{ statusMessage }}
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
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')

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
  statusMessage.value = ''

  try {
    await api.post('/api/images/rebuild')
    statusType.value = 'success'
    statusMessage.value = 'Cache rebuild started successfully. The process may take several minutes to complete in the background.'
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = `Failed to rebuild cache: ${error instanceof Error ? error.message : 'Unknown error'}`
  } finally {
    rebuilding.value = false
  }
}
</script>
