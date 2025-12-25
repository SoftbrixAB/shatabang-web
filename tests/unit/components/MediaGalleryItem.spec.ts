import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MediaGalleryItem from '@/components/gallery/MediaGalleryItem.vue'
import type { Media } from '@/types/media'

describe('MediaGalleryItem', () => {
  const mockImageMedia: Media = {
    fileName: 'test.jpg',
    date: new Date('2024-01-01'),
    downloadUrl: './media/test.jpg',
    bigMedia: './images/1920/test.jpg',
    img: 'test.jpg',
    isVideo: false,
    isImage: true
  }

  const mockVideoMedia: Media = {
    fileName: 'test.mp4',
    date: new Date('2024-01-01'),
    downloadUrl: './media/test.mp4',
    bigMedia: './video/test.mp4',
    img: 'test.jpg',
    isVideo: true,
    isImage: false
  }

  it('renders image thumbnail correctly', () => {
    const wrapper = mount(MediaGalleryItem, {
      props: { media: mockImageMedia }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('test.jpg')
    expect(img.attributes('alt')).toBe('test.jpg')
  })

  it('shows video icon for video media', () => {
    const wrapper = mount(MediaGalleryItem, {
      props: { media: mockVideoMedia }
    })

    const videoIcon = wrapper.find('svg')
    expect(videoIcon.exists()).toBe(true)
  })

  it('does not show video icon for image media', () => {
    const wrapper = mount(MediaGalleryItem, {
      props: { media: mockImageMedia }
    })

    const videoIcon = wrapper.find('svg')
    expect(videoIcon.exists()).toBe(false)
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(MediaGalleryItem, {
      props: { media: mockImageMedia }
    })

    await wrapper.find('.media-item').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')![0]).toEqual([mockImageMedia])
  })

  it('applies custom width style', () => {
    const customStyle = { width: '50%' }
    const wrapper = mount(MediaGalleryItem, {
      props: {
        media: mockImageMedia,
        imageWidthStyle: customStyle
      }
    })

    const item = wrapper.find('.media-item')
    expect(item.attributes('style')).toContain('width: 50%')
  })
})
