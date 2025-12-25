<template>
  <div class="index-view h-full p-4">
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Media Gallery</h1>
      <div class="flex items-center gap-2">
        <button @click="zoomOut" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">−</button>
        <span class="text-sm text-gray-600">{{ Math.round(100 / imageWidth.imagesPWidth.value) }}%</span>
        <button @click="zoomIn" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="!mediaStore.isLoaded" class="flex items-center justify-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading media...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="mediaStore.loadingError" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-700">Failed to load media: {{ mediaStore.loadingError }}</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="mediaStore.mediaCount === 0" class="text-center py-12">
      <p class="text-gray-600 text-lg mb-2">No media found</p>
      <p class="text-gray-500 text-sm">Upload some photos or videos to get started</p>
      <router-link to="/upload" class="mt-4 inline-block btn-primary">
        Go to Upload
      </router-link>
    </div>

    <!-- Gallery -->
    <SimpleGallery
      v-else
      :image-width-style="imageWidth.imageWidthStyle.value"
      @media-click="handleMediaClick"
    />

    <!-- Fullscreen viewer placeholder -->
    <div
      v-if="activeMedia"
      class="fullscreen-overlay"
      @click="closeFullscreen"
    >
      <div class="text-center">
        <p class="text-white text-xl mb-4">{{ activeMedia.fileName }}</p>
        <img
          :src="activeMedia.bigMedia"
          :alt="activeMedia.fileName"
          class="max-w-full max-h-screen"
        />
        <p class="text-white text-sm mt-4">
          Click anywhere to close (Full viewer in Phase 5)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMediaStore } from '@/stores/mediaStore'
import { useImageWidth } from '@/composables/useImageWidth'
import SimpleGallery from '@/components/gallery/SimpleGallery.vue'
import type { Media } from '@/types/media'

const mediaStore = useMediaStore()
const imageWidth = useImageWidth()
const activeMedia = ref<Media | null>(null)

const { zoomIn, zoomOut } = imageWidth

function handleMediaClick(media: Media) {
  activeMedia.value = media
}

function closeFullscreen() {
  activeMedia.value = null
}

// Initialize media store on mount
onMounted(async () => {
  if (!mediaStore.isLoaded) {
    try {
      await mediaStore.initialize()
    } catch (error) {
      console.error('Failed to initialize media store:', error)
    }
  }
})
</script>
