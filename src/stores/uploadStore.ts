import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UploadingFile {
  file: File
  progress: number
  speed: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export const useUploadStore = defineStore('upload', () => {
  // State
  const files = ref<Map<string, UploadingFile>>(new Map())
  const currentlySending = ref(0)
  const totalFileSize = ref(0)
  const sentFileSize = ref(0)
  const uploadStartTime = ref<number | null>(null)

  // Computed
  const progress = computed(() => {
    if (totalFileSize.value === 0) return 0
    return Math.round((sentFileSize.value / totalFileSize.value) * 100)
  })

  const speed = computed(() => {
    if (!uploadStartTime.value || sentFileSize.value === 0) return 0
    const elapsedSeconds = (Date.now() - uploadStartTime.value) / 1000
    return Math.round(sentFileSize.value / 1024 / elapsedSeconds) // KB/s
  })

  const isUploading = computed(() => currentlySending.value > 0)

  const uploadedCount = computed(() => {
    return Array.from(files.value.values()).filter(f => f.status === 'success').length
  })

  const failedCount = computed(() => {
    return Array.from(files.value.values()).filter(f => f.status === 'error').length
  })

  // Actions
  function addFile(file: File) {
    const fileId = `${file.name}-${file.size}-${file.lastModified}`

    files.value.set(fileId, {
      file,
      progress: 0,
      speed: 0,
      status: 'pending'
    })

    totalFileSize.value += file.size
  }

  function startUpload() {
    if (!uploadStartTime.value) {
      uploadStartTime.value = Date.now()
    }
  }

  function updateFileProgress(fileId: string, progress: number, bytesUploaded: number) {
    const fileData = files.value.get(fileId)
    if (fileData) {
      fileData.progress = progress
      fileData.status = 'uploading'

      // Update sent file size
      const previousSent = (fileData.progress / 100) * fileData.file.size
      sentFileSize.value = sentFileSize.value - previousSent + bytesUploaded
    }
  }

  function fileSuccess(fileId: string) {
    const fileData = files.value.get(fileId)
    if (fileData) {
      fileData.status = 'success'
      fileData.progress = 100
      currentlySending.value = Math.max(0, currentlySending.value - 1)
    }
  }

  function fileError(fileId: string, error: string) {
    const fileData = files.value.get(fileId)
    if (fileData) {
      fileData.status = 'error'
      fileData.error = error
      currentlySending.value = Math.max(0, currentlySending.value - 1)
    }
  }

  function incrementSending() {
    currentlySending.value++
  }

  function reset() {
    files.value.clear()
    currentlySending.value = 0
    totalFileSize.value = 0
    sentFileSize.value = 0
    uploadStartTime.value = null
  }

  return {
    // State
    files,
    currentlySending,
    totalFileSize,
    sentFileSize,

    // Computed
    progress,
    speed,
    isUploading,
    uploadedCount,
    failedCount,

    // Actions
    addFile,
    startUpload,
    updateFileProgress,
    fileSuccess,
    fileError,
    incrementSending,
    reset
  }
})
