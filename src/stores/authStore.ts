import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => user.value !== null)

  // Actions
  async function loadUser(): Promise<User> {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/api/users/me')
      user.value = response.data
      return user.value!
    } catch (err) {
      console.error('Failed to load user:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load user'

      // If not authenticated, redirect to Google OAuth
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any
        if (axiosError.response?.status === 401) {
          // Trigger OAuth flow
          window.location.href = '/api/auth/google'
        }
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await api.post('/api/users/invalidate')
      user.value = null

      // Redirect to login
      window.location.href = '/'
    } catch (err) {
      console.error('Failed to logout:', err)
      error.value = err instanceof Error ? err.message : 'Failed to logout'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setUser(newUser: User) {
    user.value = newUser
  }

  function clearUser() {
    user.value = null
  }

  return {
    // State
    user,
    loading,
    error,

    // Computed
    isAuthenticated,

    // Actions
    loadUser,
    logout,
    setUser,
    clearUser
  }
})
