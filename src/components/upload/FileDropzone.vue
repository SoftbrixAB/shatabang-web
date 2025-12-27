<template>
  <div
    class="dropzone-container"
    :class="{ 'dropzone-active': isDragging }"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @click="openFileDialog"
  >
    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="image/*,video/*"
      class="hidden"
      @change="handleFileInput"
    />

    <div class="dropzone-content text-center py-12">
      <svg
        class="mx-auto h-16 w-16 text-gray-400 mb-4"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <p v-if="isDragging" class="text-xl font-semibold text-blue-600 mb-2">
        Drop files here
      </p>
      <template v-else>
        <p class="text-lg font-semibold text-gray-700 mb-2">
          Drop files here or click to browse
        </p>
        <p class="text-sm text-gray-500">
          Supports images (JPG, PNG) and videos (MP4, MOV, AVI)
        </p>
        <p class="text-xs text-gray-400 mt-2">
          Max file size: 5000 MB
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  filesAdded: [files: File[]]
}>()

const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
let dragCounter = 0

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  dragCounter++
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  dragCounter--
  if (dragCounter === 0) {
    isDragging.value = false
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  dragCounter = 0

  const files = Array.from(e.dataTransfer?.files || [])
  if (files.length > 0) {
    emit('filesAdded', files)
  }
}

function openFileDialog() {
  fileInputRef.value?.click()
}

function handleFileInput(e: Event) {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    emit('filesAdded', files)
  }
  // Reset input
  target.value = ''
}
</script>

<style scoped>
.dropzone-container {
  @apply border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all;
  @apply hover:border-gray-400 hover:bg-gray-50;
  min-height: 300px;
}

.dropzone-active {
  @apply border-blue-500 bg-blue-50;
}
</style>
