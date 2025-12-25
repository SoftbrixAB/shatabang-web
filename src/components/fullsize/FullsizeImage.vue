<template>
  <img
    ref="imgRef"
    :src="media.bigMedia"
    :alt="media.fileName"
    class="fullsize-image max-w-full max-h-screen object-contain"
    @load="handleImageLoad"
    @error="handleImageError"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Media } from '@/types/media'

interface Props {
  media: Media
}

const props = defineProps<Props>()
const imgRef = ref<HTMLImageElement | null>(null)

function handleImageLoad() {
  // Image loaded successfully
  resizeImage()
}

function handleImageError() {
  console.error('Failed to load image:', props.media.bigMedia)
}

function resizeImage() {
  if (!imgRef.value) return

  const img = imgRef.value
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // Get natural dimensions
  const naturalWidth = img.naturalWidth
  const naturalHeight = img.naturalHeight

  // Calculate scaling to fit within window
  const widthRatio = windowWidth / naturalWidth
  const heightRatio = windowHeight / naturalHeight
  const scale = Math.min(widthRatio, heightRatio, 1) // Don't upscale

  // Apply max dimensions
  img.style.maxWidth = `${Math.floor(naturalWidth * scale)}px`
  img.style.maxHeight = `${Math.floor(naturalHeight * scale)}px`
}

onMounted(() => {
  window.addEventListener('resize', resizeImage)
  resizeImage()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeImage)
})
</script>

<style scoped>
.fullsize-image {
  display: block;
  margin: auto;
}
</style>
