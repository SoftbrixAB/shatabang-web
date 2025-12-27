import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with no user', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should set user', () => {
    const store = useAuthStore()
    const user = { id: '1', username: 'test', displayName: 'Test User' }

    store.setUser(user)

    expect(store.user).toEqual(user)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should clear user', () => {
    const store = useAuthStore()
    store.setUser({ id: '1', username: 'test' })

    store.clearUser()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
