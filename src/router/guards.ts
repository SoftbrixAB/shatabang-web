import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  // If not authenticated, try to load user
  if (!authStore.isAuthenticated) {
    try {
      await authStore.loadUser()
      // User loaded successfully, proceed
      next()
    } catch (error) {
      // Failed to load user (401, etc.), redirect to login
      console.log('Authentication required, redirecting to login')
      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  } else {
    // Already authenticated, proceed
    next()
  }
}
