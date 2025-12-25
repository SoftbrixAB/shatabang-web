<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="login-card bg-black/40 border border-gray-500 w-3/4 max-w-[450px] p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-white text-center mb-6">Shatabang</h1>
      <p class="text-gray-300 text-center mb-8">Media Gallery</p>

      <div v-if="error" class="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <button
        @click="loginWithGoogle"
        class="w-full bg-white text-gray-800 font-semibold py-3 px-4 rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        :disabled="loading"
      >
        <svg v-if="!loading" class="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span v-if="loading">Authenticating...</span>
        <span v-else>Sign in with Google</span>
      </button>

      <p class="text-gray-400 text-sm text-center mt-6">
        Please sign in to access your media gallery
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref<string | null>(null)

// Check if already authenticated
onMounted(async () => {
  if (authStore.isAuthenticated) {
    // Already logged in, redirect to intended destination or home
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  }
})

function loginWithGoogle() {
  loading.value = true
  error.value = null

  // Redirect to Google OAuth endpoint
  window.location.href = '/api/auth/google'
}
</script>

<style scoped>
.login-card {
  backdrop-filter: blur(10px);
}
</style>
