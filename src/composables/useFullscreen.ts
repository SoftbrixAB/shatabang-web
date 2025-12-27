import { ref, onMounted, onUnmounted } from 'vue'

export function useFullscreen() {
  const isFullscreen = ref(false)

  function updateFullscreenState() {
    isFullscreen.value = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    )
  }

  function openFullscreen() {
    const elem = document.documentElement

    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen()
    } else if ((elem as any).mozRequestFullScreen) {
      (elem as any).mozRequestFullScreen()
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen()
    }
  }

  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen()
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen()
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen()
    }
  }

  function toggleFullscreen() {
    if (isFullscreen.value) {
      closeFullscreen()
    } else {
      openFullscreen()
    }
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', updateFullscreenState)
    document.addEventListener('webkitfullscreenchange', updateFullscreenState)
    document.addEventListener('mozfullscreenchange', updateFullscreenState)
    document.addEventListener('MSFullscreenChange', updateFullscreenState)

    updateFullscreenState()
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', updateFullscreenState)
    document.removeEventListener('webkitfullscreenchange', updateFullscreenState)
    document.removeEventListener('mozfullscreenchange', updateFullscreenState)
    document.removeEventListener('MSFullscreenChange', updateFullscreenState)
  })

  return {
    isFullscreen,
    openFullscreen,
    closeFullscreen,
    toggleFullscreen
  }
}
