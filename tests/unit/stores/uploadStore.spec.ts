import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useUploadStore } from '@/stores/uploadStore'

describe('uploadStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty state', () => {
    const store = useUploadStore()

    expect(store.currentlySending).toBe(0)
    expect(store.totalFileSize).toBe(0)
    expect(store.sentFileSize).toBe(0)
    expect(store.progress).toBe(0)
    expect(store.isUploading).toBe(false)
  })

  it('should add file', () => {
    const store = useUploadStore()
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    store.addFile(file)

    expect(store.files.size).toBe(1)
    expect(store.totalFileSize).toBe(file.size)
  })

  it('should calculate progress correctly', () => {
    const store = useUploadStore()
    store.totalFileSize = 1000
    store.sentFileSize = 500

    expect(store.progress).toBe(50)
  })

  it('should track upload counts', () => {
    const store = useUploadStore()
    const file1 = new File(['test1'], 'test1.jpg')
    const file2 = new File(['test2'], 'test2.jpg')

    store.addFile(file1)
    store.addFile(file2)

    const fileId1 = `${file1.name}-${file1.size}-${file1.lastModified}`
    const fileId2 = `${file2.name}-${file2.size}-${file2.lastModified}`

    store.fileSuccess(fileId1)
    store.fileError(fileId2, 'Upload failed')

    expect(store.uploadedCount).toBe(1)
    expect(store.failedCount).toBe(1)
  })

  it('should reset state', () => {
    const store = useUploadStore()
    const file = new File(['test'], 'test.jpg')

    store.addFile(file)
    store.incrementSending()

    store.reset()

    expect(store.files.size).toBe(0)
    expect(store.currentlySending).toBe(0)
    expect(store.totalFileSize).toBe(0)
  })
})
