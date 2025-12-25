<template>
  <div class="upload-view h-full p-4 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Upload Media</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left side: Dropzone -->
      <div>
        <FileDropzone @files-added="handleFilesAdded" />

        <!-- Upload actions -->
        <div v-if="pendingFiles.length > 0 && !isUploading" class="mt-4 flex gap-3">
          <button
            @click="startUpload"
            class="flex-1 btn-primary py-3 text-lg"
          >
            Upload {{ pendingFiles.length }} file{{ pendingFiles.length !== 1 ? 's' : '' }}
          </button>
          <button
            @click="clearAllFiles"
            class="px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>

        <!-- Upload stats -->
        <div v-if="uploadStats.total > 0" class="mt-4 card">
          <h3 class="text-sm font-semibold mb-2">Upload Summary</h3>
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span class="text-gray-600">Total:</span>
              <span class="ml-1 font-semibold">{{ uploadStats.total }}</span>
            </div>
            <div>
              <span class="text-green-600">Success:</span>
              <span class="ml-1 font-semibold">{{ uploadStats.success }}</span>
            </div>
            <div>
              <span class="text-red-600">Failed:</span>
              <span class="ml-1 font-semibold">{{ uploadStats.failed }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: File list and progress -->
      <div>
        <FileList
          :files="allFiles"
          @remove-file="removeFile"
          @clear-all="clearAllFiles"
        />

        <!-- Overall progress bar -->
        <div v-if="isUploading" class="mt-4 card">
          <div class="flex justify-between mb-2">
            <span class="text-sm text-gray-600">
              Uploading {{ uploadStore.currentlySending }} of {{ allFiles.length }} files...
            </span>
            <span class="text-sm font-semibold">{{ overallProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="bg-blue-600 h-3 rounded-full transition-all"
              :style="{ width: overallProgress + '%' }"
            ></div>
          </div>
          <div class="mt-2 text-sm text-gray-500">
            Speed: {{ uploadStore.speed }} KB/s
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useUploadStore } from '@/stores/uploadStore'
import api from '@/services/api'
import FileDropzone from '@/components/upload/FileDropzone.vue'
import FileList from '@/components/upload/FileList.vue'

interface FileWithStatus extends File {
  preview?: string
  status?: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

const uploadStore = useUploadStore()
const allFiles = ref<FileWithStatus[]>([])
const isUploading = ref(false)

const pendingFiles = computed(() =>
  allFiles.value.filter(f => !f.status || f.status === 'pending')
)

const uploadStats = computed(() => ({
  total: allFiles.value.length,
  success: allFiles.value.filter(f => f.status === 'success').length,
  failed: allFiles.value.filter(f => f.status === 'error').length
}))

const overallProgress = computed(() => {
  if (allFiles.value.length === 0) return 0
  const completed = allFiles.value.filter(f => f.status === 'success').length
  const inProgress = allFiles.value
    .filter(f => f.status === 'uploading')
    .reduce((sum, f) => sum + (f.progress || 0), 0) / 100
  return Math.round(((completed + inProgress) / allFiles.value.length) * 100)
})

function handleFilesAdded(files: File[]) {
  const newFiles: FileWithStatus[] = files.map(file => {
    const fileWithStatus = file as FileWithStatus
    fileWithStatus.status = 'pending'
    fileWithStatus.progress = 0

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        fileWithStatus.preview = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }

    return fileWithStatus
  })

  allFiles.value.push(...newFiles)
}

function removeFile(index: number) {
  allFiles.value.splice(index, 1)
}

function clearAllFiles() {
  if (isUploading.value) {
    if (!confirm('Upload in progress. Are you sure you want to cancel?')) {
      return
    }
  }
  allFiles.value = []
  uploadStore.reset()
  isUploading.value = false
}

async function startUpload() {
  if (pendingFiles.value.length === 0) return

  isUploading.value = true
  uploadStore.startUpload()

  for (const file of allFiles.value) {
    if (file.status !== 'pending') continue

    file.status = 'uploading'
    file.progress = 0
    uploadStore.incrementSending()

    try {
      const formData = new FormData()
      formData.append('file', file)

      await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            file.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          }
        }
      })

      file.status = 'success'
      file.progress = 100
      const fileId = `${file.name}-${file.size}-${file.lastModified}`
      uploadStore.fileSuccess(fileId)
    } catch (error) {
      file.status = 'error'
      file.error = error instanceof Error ? error.message : 'Upload failed'
      const fileId = `${file.name}-${file.size}-${file.lastModified}`
      uploadStore.fileError(fileId, file.error)
    }
  }

  isUploading.value = false
}

// Prevent navigation during upload
onBeforeRouteLeave((to, from, next) => {
  if (isUploading.value) {
    const answer = confirm('Upload in progress. Are you sure you want to leave?')
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  uploadStore.reset()
})
</script>
