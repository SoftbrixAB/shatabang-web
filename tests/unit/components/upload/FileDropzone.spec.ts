import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FileDropzone from '@/components/upload/FileDropzone.vue'

describe('FileDropzone', () => {
  it('renders dropzone with default message', () => {
    const wrapper = mount(FileDropzone)
    expect(wrapper.text()).toContain('Drop files here or click to browse')
    expect(wrapper.text()).toContain('Supports images (JPG, PNG) and videos (MP4, MOV, AVI)')
  })

  it('shows drag active state on dragenter', async () => {
    const wrapper = mount(FileDropzone)
    const dropzone = wrapper.find('.dropzone-container')

    await dropzone.trigger('dragenter', {
      dataTransfer: { files: [] }
    })

    expect(dropzone.classes()).toContain('dropzone-active')
    expect(wrapper.text()).toContain('Drop files here')
  })

  it('removes drag active state on dragleave', async () => {
    const wrapper = mount(FileDropzone)
    const dropzone = wrapper.find('.dropzone-container')

    await dropzone.trigger('dragenter')
    await dropzone.trigger('dragleave')

    expect(dropzone.classes()).not.toContain('dropzone-active')
  })

  it('handles multiple dragenter/dragleave events correctly', async () => {
    const wrapper = mount(FileDropzone)
    const dropzone = wrapper.find('.dropzone-container')

    // Simulate nested drag events (common with nested elements)
    await dropzone.trigger('dragenter')
    await dropzone.trigger('dragenter')
    expect(dropzone.classes()).toContain('dropzone-active')

    await dropzone.trigger('dragleave')
    expect(dropzone.classes()).toContain('dropzone-active') // Still active, counter is 1

    await dropzone.trigger('dragleave')
    expect(dropzone.classes()).not.toContain('dropzone-active') // Now inactive, counter is 0
  })

  it('emits filesAdded event on drop with files', async () => {
    const wrapper = mount(FileDropzone)
    const dropzone = wrapper.find('.dropzone-container')

    const mockFiles = [
      new File(['content'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['content'], 'test2.png', { type: 'image/png' })
    ]

    await dropzone.trigger('drop', {
      dataTransfer: { files: mockFiles }
    })

    expect(wrapper.emitted('filesAdded')).toBeTruthy()
    expect(wrapper.emitted('filesAdded')?.[0]).toEqual([mockFiles])
    expect(dropzone.classes()).not.toContain('dropzone-active')
  })

  it('does not emit filesAdded on drop without files', async () => {
    const wrapper = mount(FileDropzone)
    const dropzone = wrapper.find('.dropzone-container')

    await dropzone.trigger('drop', {
      dataTransfer: { files: [] }
    })

    expect(wrapper.emitted('filesAdded')).toBeFalsy()
  })

  it('opens file dialog on click', async () => {
    const wrapper = mount(FileDropzone)
    const fileInput = wrapper.find('input[type="file"]')
    const clickSpy = vi.spyOn(fileInput.element as HTMLInputElement, 'click')

    await wrapper.find('.dropzone-container').trigger('click')

    expect(clickSpy).toHaveBeenCalled()
  })

  it('emits filesAdded on file input change', async () => {
    const wrapper = mount(FileDropzone)
    const fileInput = wrapper.find('input[type="file"]')

    const mockFiles = [
      new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    ]

    Object.defineProperty(fileInput.element, 'files', {
      value: mockFiles,
      writable: false
    })

    await fileInput.trigger('change')

    expect(wrapper.emitted('filesAdded')).toBeTruthy()
    expect(wrapper.emitted('filesAdded')?.[0]).toEqual([mockFiles])
  })

  it('resets file input after selection', async () => {
    const wrapper = mount(FileDropzone)
    const fileInput = wrapper.find('input[type="file"]').element as HTMLInputElement

    const mockFiles = [
      new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    ]

    Object.defineProperty(fileInput, 'files', {
      value: mockFiles,
      writable: false
    })

    await wrapper.find('input[type="file"]').trigger('change')

    expect(fileInput.value).toBe('')
  })

  it('has correct accept attribute on file input', () => {
    const wrapper = mount(FileDropzone)
    const fileInput = wrapper.find('input[type="file"]')

    expect(fileInput.attributes('accept')).toBe('image/*,video/*')
    expect(fileInput.attributes('multiple')).toBeDefined()
  })

  it('prevents default on dragover', async () => {
    const wrapper = mount(FileDropzone)
    const dropzone = wrapper.find('.dropzone-container')
    const event = new Event('dragover')
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    await dropzone.element.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})
