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
    console.log('useScrollAlmostDown: Scroll event');
    if (!ticking) {
      console.log('useScrollAlmostDown: RequestAnimationFrame scheduled');
      rafId = window.requestAnimationFrame(() => {
        checkScroll()
        console.log('useScrollAlmostDown: RequestAnimationFrame');
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    document.getElementById('main-content')?.addEventListener('scroll', handleScroll, { passive: true });
    console.log('useScrollAlmostDown: Mounted');
  })

  onUnmounted(() => {
    document.getElementById('main-content')?.removeEventListener('scroll', handleScroll)
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId)
    }
    console.log('useScrollAlmostDown: Unmounted');
  })

  return {
    checkScroll
  }
}
