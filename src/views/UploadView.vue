<template>
  <div class="upload-view h-full p-4">
    <h1 class="text-2xl font-bold mb-4">Upload Media</h1>

    <div class="upload-area dropzone">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p class="text-lg text-gray-700 mb-2">Upload functionality coming in Phase 7</p>
        <p class="text-sm text-gray-500">
          Will support drag-and-drop file upload with progress tracking
        </p>
      </div>
    </div>

    <div v-if="uploadStore.isUploading" class="mt-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm text-gray-600">Uploading {{ uploadStore.currentlySending }} files...</span>
          <span class="text-sm font-semibold">{{ uploadStore.progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all"
            :style="{ width: uploadStore.progress + '%' }"
          ></div>
        </div>
        <div class="mt-2 text-sm text-gray-500">
          {{ uploadStore.speed }} KB/s
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUploadStore } from '@/stores/uploadStore'

const uploadStore = useUploadStore()
</script>
