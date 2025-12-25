import { onMounted, onUnmounted } from 'vue'

export function useScrollAlmostDown(callback: () => void, threshold: number = 300) {
  function checkScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Check if we're close to the bottom
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight)

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
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Check immediately on mount
    checkScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId)
    }
  })

  return {
    checkScroll
  }
}
