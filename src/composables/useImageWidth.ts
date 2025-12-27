import { ref, computed } from 'vue'

export function useImageWidth() {
  const imagesPWidth = ref(4) // Percentage width (1 = 100%, 2 = 50%, 4 = 25%, etc.)

  const imageWidth = computed(() => {
    return `${100 / imagesPWidth.value}%`
  })

  const imageWidthStyle = computed(() => {
    return { width: imageWidth.value }
  })

  function zoomIn() {
    // Zoom in = make images bigger = decrease imagesPWidth
    // Allow zooming in down to 1 (100% width)
    if (imagesPWidth.value > 1) {
      imagesPWidth.value = imagesPWidth.value / 2
    }
  }

  function zoomOut() {
    // Zoom out = make images smaller = increase imagesPWidth
    // Allow zooming out to 33.33 (3% width)
    const maxZoomOut = 100 / 3 // ~33.33
    if (imagesPWidth.value < maxZoomOut) {
      imagesPWidth.value = imagesPWidth.value * 2
    }
  }

  function reset() {
    imagesPWidth.value = 1
  }

  function setZoomLevel(level: number) {
    imagesPWidth.value = level
  }

  return {
    imagesPWidth,
    imageWidth,
    imageWidthStyle,
    zoomIn,
    zoomOut,
    reset,
    setZoomLevel
  }
}
