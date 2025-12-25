import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FullsizeVideo from '@/components/fullsize/FullsizeVideo.vue'

describe('FullsizeVideo', () => {
  const createMockMedia = () => ({
    img: 'video.mp4',
    bigMedia: './video/video.mp4',
    fileName: 'video.mp4',
    isVideo: true,
    path: '/2024/01/15'
  })

  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders video element', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    const video = wrapper.find('video')
    expect(video.exists()).toBe(true)
  })

  it('sets video source correctly', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    const video = wrapper.find('video')
    expect(video.attributes('src')).toBe('./video/video.mp4')
  })

  it('sets video controls', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    const video = wrapper.find('video')
    expect(video.attributes('controls')).toBeDefined()
  })

  it('sets autoplay', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    const video = wrapper.find('video')
    expect(video.attributes('autoplay')).toBeDefined()
  })

  it('applies fullsize-video class', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    const video = wrapper.find('video')
    expect(video.classes()).toContain('fullsize-video')
  })

  it('applies max-w-full and max-h-screen classes', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    const video = wrapper.find('video')
    expect(video.classes()).toContain('max-w-full')
    expect(video.classes()).toContain('max-h-screen')
  })

  it('shows unsupported message for non-compatible browsers', () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    expect(wrapper.text()).toContain('Your browser does not support the video tag')
  })

  it('registers resize event listener on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const media = createMockMedia()

    mount(FullsizeVideo, {
      props: { media }
    })

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('removes resize event listener on unmount', () => {
    const media = createMockMedia()
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('handles video load event', async () => {
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    const video = wrapper.find('video')
    await video.trigger('loadedmetadata')

    // Just verify no errors occur
    expect(wrapper.exists()).toBe(true)
  })

  it('handles video error event', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const media = createMockMedia()
    const wrapper = mount(FullsizeVideo, {
      props: { media }
    })

    const video = wrapper.find('video')
    await video.trigger('error')

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load video:', './video/video.mp4')
    consoleErrorSpy.mockRestore()
  })
})
