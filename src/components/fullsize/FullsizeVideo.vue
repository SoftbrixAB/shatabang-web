<template>
  <video
    ref="videoRef"
    :src="media.bigMedia"
    class="fullsize-video max-w-full max-h-screen"
    controls
    autoplay
    @loadedmetadata="handleVideoLoad"
    @error="handleVideoError"
  >
    Your browser does not support the video tag.
  </video>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Media } from '@/types/media'

interface Props {
  media: Media
}

const props = defineProps<Props>()
const videoRef = ref<HTMLVideoElement | null>(null)

function handleVideoLoad() {
  // Video loaded successfully
  resizeVideo()
}

function handleVideoError() {
  console.error('Failed to load video:', props.media.bigMedia)
}

function resizeVideo() {
  if (!videoRef.value) return

  const video = videoRef.value
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  // Get video dimensions
  const videoWidth = video.videoWidth
  const videoHeight = video.videoHeight

  // Calculate scaling to fit within window
  const widthRatio = windowWidth / videoWidth
  const heightRatio = windowHeight / videoHeight
  const scale = Math.min(widthRatio, heightRatio, 1)

  // Apply max dimensions
  video.style.maxWidth = `${Math.floor(videoWidth * scale)}px`
  video.style.maxHeight = `${Math.floor(videoHeight * scale)}px`
}

onMounted(() => {
  window.addEventListener('resize', resizeVideo)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeVideo)
})
</script>

<style scoped>
.fullsize-video {
  display: block;
  margin: auto;
  object-fit: contain;
}
</style>
