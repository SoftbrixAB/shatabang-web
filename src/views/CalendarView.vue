<template>
  <div class="calendar-view h-full flex flex-col">
    <!-- Header with controls -->
    <div class="p-4 flex justify-between items-center border-b border-gray-200 bg-white">
      <h1 class="text-2xl font-bold">Calendar Timeline</h1>
      <div class="flex gap-2">
        <button @click="scrollToToday" class="btn-primary">
          Today
        </button>
        <button @click="scrollToStart" class="btn-secondary">
          Start
        </button>
        <button @click="scrollToEnd" class="btn-secondary">
          End
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="!mediaStore.isLoaded" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading media...</p>
      </div>
    </div>

    <!-- Calendar gallery -->
    <div v-else class="flex-1 overflow-auto" ref="scrollContainer">
      <CalendarGallery
        :active-media="activeMedia"
        @media-click="handleMediaClick"
      />
    </div>

    <!-- Fullscreen viewer -->
    <FullsizeMedia
      :active-media="activeMedia"
      :reverse-move="true"
      @close="closeFullscreen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMediaStore } from '@/stores/mediaStore'
import { dateToDay, CALENDAR_BLOCK_WIDTH } from '@/utils/dateUtils'
import CalendarGallery from '@/components/calendar/CalendarGallery.vue'
import FullsizeMedia from '@/components/fullsize/FullsizeMedia.vue'
import type { Media } from '@/types/media'

const mediaStore = useMediaStore()
const scrollContainer = ref<HTMLDivElement | null>(null)
const activeMedia = ref<Media | undefined>(undefined)

function handleMediaClick(media: Media) {
  activeMedia.value = media
}

function closeFullscreen() {
  activeMedia.value = undefined
}

function scrollToToday() {
  if (!scrollContainer.value) return

  const now = new Date()
  const dayNumber = dateToDay(now)
  const hour = now.getHours()
  const minute = now.getMinutes()
  const timeFraction = (hour * 60 + minute) / (24 * 60)
  const todayX = (dayNumber - 1 + timeFraction) * CALENDAR_BLOCK_WIDTH

  // Scroll to center today's position
  scrollContainer.value.scrollTo({
    left: todayX - window.innerWidth / 2,
    behavior: 'smooth'
  })
}

function scrollToStart() {
  if (!scrollContainer.value) return

  scrollContainer.value.scrollTo({
    left: 0,
    behavior: 'smooth'
  })
}

function scrollToEnd() {
  if (!scrollContainer.value) return

  scrollContainer.value.scrollTo({
    left: scrollContainer.value.scrollWidth,
    behavior: 'smooth'
  })
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
