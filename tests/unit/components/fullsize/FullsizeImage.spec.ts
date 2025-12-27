import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FullsizeImage from '@/components/fullsize/FullsizeImage.vue'

describe('FullsizeImage', () => {
  const createMockMedia = () => ({
    img: 'test.jpg',
    bigMedia: './images/full/test.jpg',
    fileName: 'test.jpg',
    isVideo: false,
    path: '/2024/01/15'
  })

  let resizeEventListener: (() => void) | null = null

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true })

    // Track resize listener
    const originalAddEventListener = window.addEventListener
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'resize') {
        resizeEventListener = handler as () => void
      }
      return originalAddEventListener.call(window, event, handler)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders image element', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeImage, {
      props: { media }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('./images/full/test.jpg')
  })

  it('sets alt attribute from fileName', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeImage, {
      props: { media }
    })

    const img = wrapper.find('img')
    expect(img.attributes('alt')).toBe('test.jpg')
  })

  it('applies fullsize-image class', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeImage, {
      props: { media }
    })

    const img = wrapper.find('img')
    expect(img.classes()).toContain('fullsize-image')
  })

  it('applies max-w-full and max-h-screen classes', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeImage, {
      props: { media }
    })

    const img = wrapper.find('img')
    expect(img.classes()).toContain('max-w-full')
    expect(img.classes()).toContain('max-h-screen')
  })

  it('applies object-contain class', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeImage, {
      props: { media }
    })

    const img = wrapper.find('img')
    expect(img.classes()).toContain('object-contain')
  })

  it('registers resize event listener on mount', () => {
    const media = createMockMedia()
    mount(FullsizeImage, {
      props: { media }
    })

    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('removes resize event listener on unmount', () => {
    const media = createMockMedia()
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const wrapper = mount(FullsizeImage, {
      props: { media }
    })

    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('handles image load event', async () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeImage, {
      props: { media }
    })

    const img = wrapper.find('img')
    await img.trigger('load')

    // Just verify no errors occur
    expect(wrapper.exists()).toBe(true)
  })

  it('handles image error event', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const media = createMockMedia()
    const wrapper = mount(FullsizeImage, {
      props: { media }
    })

    const img = wrapper.find('img')
    await img.trigger('error')

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load image:', './images/full/test.jpg')
    consoleErrorSpy.mockRestore()
  })
})
