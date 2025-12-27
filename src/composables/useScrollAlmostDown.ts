import { onMounted, onUnmounted } from 'vue'

export function useScrollAlmostDown(callback: () => void, threshold: number = 300, containerId: string = 'gallery-container') {
  function checkScroll() {
    const container = document.getElementById(containerId)
    if (!container) {
      return
    }

    const scrollTop = container.scrollTop
    const containerHeight = container.clientHeight
    const scrollHeight = container.scrollHeight

    // Check if we're close to the bottom
    const distanceFromBottom = scrollHeight - (scrollTop + containerHeight)

    if (distanceFromBottom < threshold) {
      callback()
    }
  }

  let rafId: number | null = null
  let ticking = false

  function handleScroll() {
    if (!ticking) {
      rafId = window.requestAnimationFrame(() => {
        checkScroll()
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    const container = document.getElementById(containerId)
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
    }
  })

  onUnmounted(() => {
    const container = document.getElementById(containerId)
    if (container) {
      container.removeEventListener('scroll', handleScroll)
    }
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId)
    }
  })

  return {
    checkScroll
  }
}
