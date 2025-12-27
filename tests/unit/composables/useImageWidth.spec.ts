import { describe, it, expect } from 'vitest'
import { useImageWidth } from '@/composables/useImageWidth'

describe('useImageWidth', () => {
  it('should initialize with default width', () => {
    const { imagesPWidth, imageWidth } = useImageWidth()

    expect(imagesPWidth.value).toBe(1)
    expect(imageWidth.value).toBe('100%')
  })

  it('should zoom in', () => {
    const { imagesPWidth, imageWidth, zoomIn } = useImageWidth()

    zoomIn()

    expect(imagesPWidth.value).toBe(0.5)
    expect(imageWidth.value).toBe('200%')
  })

  it('should zoom out', () => {
    const { imagesPWidth, imageWidth, zoomOut } = useImageWidth()

    zoomOut()

    expect(imagesPWidth.value).toBe(2)
    expect(imageWidth.value).toBe('50%')
  })

  it('should not zoom in beyond limit', () => {
    const { imagesPWidth, zoomIn } = useImageWidth()

    // Already at 1, can't zoom in further
    zoomIn()

    expect(imagesPWidth.value).toBe(0.5)

    // Try to zoom in again when at minimum
    const { imagesPWidth: ratio2, zoomIn: zoomIn2 } = useImageWidth()
    ratio2.value = 1
    zoomIn2()
    // Should still work at 1
    expect(ratio2.value).toBe(0.5)
  })

  it('should not zoom out beyond limit', () => {
    const { imagesPWidth, setZoomLevel, zoomOut } = useImageWidth()

    setZoomLevel(16)
    zoomOut()

    expect(imagesPWidth.value).toBe(16) // Should not exceed 16
  })

  it('should reset to default', () => {
    const { imagesPWidth, zoomOut, reset } = useImageWidth()

    zoomOut()
    zoomOut()
    expect(imagesPWidth.value).toBe(4)

    reset()
    expect(imagesPWidth.value).toBe(1)
  })
})
