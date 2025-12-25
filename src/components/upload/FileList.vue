<template>
  <div class="file-list">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">
        Files to Upload ({{ files.length }})
      </h3>
      <button
        v-if="files.length > 0"
        @click="emit('clearAll')"
        class="text-sm text-red-600 hover:text-red-700"
      >
        Clear All
      </button>
    </div>

    <div v-if="files.length === 0" class="text-center py-8 text-gray-500">
      No files selected
    </div>

    <div v-else class="space-y-2 max-h-96 overflow-y-auto">
      <div
        v-for="(file, index) in files"
        :key="file.name + index"
        class="file-item flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
      >
        <!-- File preview/icon -->
        <div class="flex-shrink-0">
          <img
            v-if="file.preview"
            :src="file.preview"
            :alt="file.name"
            class="w-16 h-16 object-cover rounded"
          />
          <div
            v-else
            class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center"
          >
            <svg
              v-if="file.type.startsWith('video')"
              class="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            <svg
              v-else
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <!-- File info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-500">
            {{ formatFileSize(file.size) }}
            <span v-if="file.type" class="ml-2">{{ file.type.split('/')[1] }}</span>
          </p>
        </div>

        <!-- Upload status -->
        <div v-if="file.status" class="flex-shrink-0">
          <span
            v-if="file.status === 'uploading'"
            class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded"
          >
            <div class="animate-spin mr-1 h-3 w-3 border-2 border-blue-700 border-t-transparent rounded-full"></div>
            {{ file.progress }}%
          </span>
          <span
            v-else-if="file.status === 'success'"
            class="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded"
          >
            ✓ Done
          </span>
          <span
            v-else-if="file.status === 'error'"
            class="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded"
            :title="file.error"
          >
            ✗ Failed
          </span>
        </div>

        <!-- Remove button -->
        <button
          v-if="!file.status || file.status === 'error'"
          @click="emit('removeFile', index)"
          class="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
          title="Remove file"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FileWithStatus extends File {
  preview?: string
  status?: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

interface Props {
  files: FileWithStatus[]
}

defineProps<Props>()

const emit = defineEmits<{
  removeFile: [index: number]
  clearAll: []
}>()

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>
