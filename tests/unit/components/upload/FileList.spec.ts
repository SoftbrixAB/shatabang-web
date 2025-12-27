import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FileList from '@/components/upload/FileList.vue'

describe('FileList', () => {
  const createMockFile = (name: string, _size: number, type: string, status?: string, progress?: number, error?: string, preview?: string) => {
    // Create a small file - we'll mock the size property if needed
    const file = new File(['test content'], name, { type }) as any
    if (status) file.status = status
    if (progress !== undefined) file.progress = progress
    if (error) file.error = error
    if (preview) file.preview = preview
    // Override size for testing purposes
    Object.defineProperty(file, 'size', { value: _size, writable: false })
    return file
  }

  it('renders empty state when no files', () => {
    const wrapper = mount(FileList, {
      props: {
        files: []
      }
    })

    expect(wrapper.text()).toContain('No files selected')
    expect(wrapper.text()).toContain('Files to Upload (0)')
  })

  it('renders file list with correct count', () => {
    const files = [
      createMockFile('test1.jpg', 1024, 'image/jpeg'),
      createMockFile('test2.png', 2048, 'image/png')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    expect(wrapper.text()).toContain('Files to Upload (2)')
    expect(wrapper.text()).toContain('test1.jpg')
    expect(wrapper.text()).toContain('test2.png')
  })

  it('displays file size correctly', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg'),
      createMockFile('large.mp4', 1048576, 'video/mp4'),
      createMockFile('huge.mov', 1073741824, 'video/quicktime')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    expect(wrapper.text()).toContain('1 KB')
    expect(wrapper.text()).toContain('1 MB')
    expect(wrapper.text()).toContain('1 GB')
  })

  it('displays file type', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg'),
      createMockFile('video.mp4', 1024, 'video/mp4')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    expect(wrapper.text()).toContain('jpeg')
    expect(wrapper.text()).toContain('mp4')
  })

  it('shows image preview when available', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', undefined, undefined, undefined, 'data:image/jpeg;base64,test')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('data:image/jpeg;base64,test')
    expect(img.attributes('alt')).toBe('test.jpg')
  })

  it('shows video icon for video files without preview', () => {
    const files = [
      createMockFile('video.mp4', 1024, 'video/mp4')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const videoIcon = wrapper.find('.w-16.h-16 svg')
    expect(videoIcon.exists()).toBe(true)
  })

  it('shows generic file icon for files without preview', () => {
    const files = [
      createMockFile('doc.pdf', 1024, 'application/pdf')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const fileIcon = wrapper.find('.w-16.h-16 svg')
    expect(fileIcon.exists()).toBe(true)
  })

  it('displays pending status (no badge)', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', 'pending')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    expect(wrapper.find('.text-blue-700').exists()).toBe(false)
    expect(wrapper.find('.text-green-700').exists()).toBe(false)
    expect(wrapper.find('.text-red-700').exists()).toBe(false)
  })

  it('displays uploading status with progress', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', 'uploading', 45)
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const uploadingBadge = wrapper.find('.text-blue-700')
    expect(uploadingBadge.exists()).toBe(true)
    expect(uploadingBadge.text()).toContain('45%')
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })

  it('displays success status', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', 'success', 100)
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const successBadge = wrapper.find('.text-green-700')
    expect(successBadge.exists()).toBe(true)
    expect(successBadge.text()).toContain('Done')
  })

  it('displays error status with title', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', 'error', undefined, 'Upload failed: Network error')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const errorBadge = wrapper.find('.text-red-700')
    expect(errorBadge.exists()).toBe(true)
    expect(errorBadge.text()).toContain('Failed')
    expect(errorBadge.attributes('title')).toBe('Upload failed: Network error')
  })

  it('shows remove button for files without status', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const removeButton = wrapper.find('button[title="Remove file"]')
    expect(removeButton.exists()).toBe(true)
  })

  it('hides remove button for pending files', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', 'pending')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const removeButton = wrapper.find('button[title="Remove file"]')
    expect(removeButton.exists()).toBe(false)
  })

  it('shows remove button for error files', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', 'error', undefined, 'Failed')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const removeButton = wrapper.find('button[title="Remove file"]')
    expect(removeButton.exists()).toBe(true)
  })

  it('hides remove button for uploading files', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', 'uploading', 50)
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const removeButton = wrapper.find('button[title="Remove file"]')
    expect(removeButton.exists()).toBe(false)
  })

  it('hides remove button for success files', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg', 'success', 100)
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const removeButton = wrapper.find('button[title="Remove file"]')
    expect(removeButton.exists()).toBe(false)
  })

  it('emits removeFile event with correct index', async () => {
    const files = [
      createMockFile('test1.jpg', 1024, 'image/jpeg'),
      createMockFile('test2.jpg', 1024, 'image/jpeg', 'error', undefined, 'Failed')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const removeButtons = wrapper.findAll('button[title="Remove file"]')
    await removeButtons[1].trigger('click')

    expect(wrapper.emitted('removeFile')).toBeTruthy()
    expect(wrapper.emitted('removeFile')?.[0]).toEqual([1])
  })

  it('shows clear all button when files exist', () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    const clearButton = wrapper.find('.text-red-600')
    expect(clearButton.exists()).toBe(true)
    expect(clearButton.text()).toBe('Clear All')
  })

  it('hides clear all button when no files', () => {
    const wrapper = mount(FileList, {
      props: {
        files: []
      }
    })

    const clearButton = wrapper.find('.text-red-600')
    expect(clearButton.exists()).toBe(false)
  })

  it('emits clearAll event when clear all clicked', async () => {
    const files = [
      createMockFile('test.jpg', 1024, 'image/jpeg')
    ]

    const wrapper = mount(FileList, {
      props: { files }
    })

    await wrapper.find('.text-red-600').trigger('click')

    expect(wrapper.emitted('clearAll')).toBeTruthy()
  })

  it('renders scrollable container for many files', () => {
    const files = Array.from({ length: 20 }, (_, i) =>
      createMockFile(`test${i}.jpg`, 1024, 'image/jpeg')
    )

    const wrapper = mount(FileList, {
      props: { files }
    })

    const container = wrapper.find('.max-h-96')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('overflow-y-auto')
  })
})
