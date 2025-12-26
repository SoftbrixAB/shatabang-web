<template>
  <div
    v-if="currentMedia"
    class="fullscreen-overlay"
    @click="toggleInteractive"
  >
    <!-- Close button and controls -->
    <div
      v-show="!hideInteractiveOverlay"
      class="interactive-overlay absolute inset-0 pointer-events-none"
      @click.stop
    >
      <!-- Top bar -->
      <div class="absolute top-0 left-0 right-0 bg-black/50 text-white p-4 flex justify-between items-center pointer-events-auto">
        <div class="flex-1">
          <p class="text-lg font-semibold truncate">{{ currentMedia.fileName }}</p>
          <p class="text-sm text-gray-300">
            {{ currentIndex + 1 }} / {{ totalCount }}
          </p>
        </div>
        <button
          @click="close"
          class="ml-4 text-white hover:text-gray-300 transition-colors"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation arrows -->
      <button
        v-if="hasPrev"
        @click.stop="moveLeft"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors pointer-events-auto"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="hasNext"
        @click.stop="moveRight"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors pointer-events-auto"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Bottom bar with delete -->
      <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 flex justify-between items-center pointer-events-auto">
        <div class="text-sm text-gray-300">
          Use ← → arrow keys to navigate, ESC to close
        </div>
        <button
          @click.stop="confirmDelete"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Media display -->
    <div class="flex items-center justify-center h-full w-full p-4" @click.stop>
      <FullsizeVideo v-if="currentMedia.isVideo" :media="currentMedia" />
      <FullsizeImage v-else :media="currentMedia" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useKeyboardNav } from '@/composables/useKeyboardNav'
import { useMediaStore } from '@/stores/mediaStore'
import { useFullscreen } from '@/composables/useFullscreen'
import type { Media } from '@/types/media'
import type { DibbaIterator } from '@/services/dibba-tree'
import FullsizeImage from './FullsizeImage.vue'
import FullsizeVideo from './FullsizeVideo.vue'

interface Props {
  activeMedia?: Media
  reverseMove?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  activeMedia: undefined,
  reverseMove: false
})

const emit = defineEmits<{
  close: []
}>()

const mediaStore = useMediaStore()
const { isFullscreen, closeFullscreen } = useFullscreen()

const currentMedia = ref<Media | null>(null)
const iterator = ref<DibbaIterator<Media> | null>(null)
const hideInteractiveOverlay = ref(false)
const currentIndex = ref(0)
const totalCount = computed(() => mediaStore.mediaCount)

const hasPrev = computed(() => iterator.value?.hasPrev() ?? false)
const hasNext = computed(() => iterator.value?.hasNext() ?? false)

// Set up keyboard navigation
useKeyboardNav({
  onLeft: () => moveLeft(),
  onRight: () => moveRight(),
  onEscape: () => close(),
  onDelete: () => confirmDelete()
})

// Watch for activeMedia changes
watch(() => props.activeMedia, (media) => {
  if (media) {
    if (!iterator.value) {
      // Initialize iterator
      iterator.value = mediaStore.getIterator()
      if (media.path) {
        iterator.value.gotoPath(media.path)
      }
      currentMedia.value = media

      // Update history
      history.pushState(media, '', `#view=${media.bigMedia}`)

      // Preload adjacent images
      preloadImages()
      updateIndex()
    } else {
      currentMedia.value = media
      history.replaceState(media, '', `#view=${media.bigMedia}`)
      preloadImages()
      updateIndex()
    }
  }
}, { immediate: true })

function updateIndex() {
  if (iterator.value && currentMedia.value) {
    // Approximate index (would need to traverse tree for exact count)
    currentIndex.value = 0
  }
}

function moveLeft() {
  if (!iterator.value) return

  const direction = props.reverseMove ? 'next' : 'prev'

  if (direction === 'prev' && iterator.value.hasPrev()) {
    const prev = iterator.value.prev()
    if (prev && prev !== currentMedia.value) {
      currentMedia.value = prev
      currentMedia.value.path = iterator.value.getPath()
      preloadImages()
      updateIndex()
    }
  } else if (direction === 'next' && iterator.value.hasNext()) {
    const next = iterator.value.next()
    if (next && next !== currentMedia.value) {
      currentMedia.value = next
      currentMedia.value.path = iterator.value.getPath()
      preloadImages()
      updateIndex()
    }
  }
}

function moveRight() {
  if (!iterator.value) return

  const direction = props.reverseMove ? 'prev' : 'next'

  if (direction === 'next' && iterator.value.hasNext()) {
    const next = iterator.value.next()
    if (next && next !== currentMedia.value) {
      currentMedia.value = next
      currentMedia.value.path = iterator.value.getPath()
      preloadImages()
      updateIndex()
    }
  } else if (direction === 'prev' && iterator.value.hasPrev()) {
    const prev = iterator.value.prev()
    if (prev && prev !== currentMedia.value) {
      currentMedia.value = prev
      currentMedia.value.path = iterator.value.getPath()
      preloadImages()
      updateIndex()
    }
  }
}

function preloadImages() {
  if (!iterator.value || !currentMedia.value) return

  // Create a separate iterator for preloading
  const preloadIterator = mediaStore.getIterator()
  if (currentMedia.value.path) {
    preloadIterator.gotoPath(currentMedia.value.path)
  }

  // Preload next image
  if (preloadIterator.hasNext()) {
    const next = preloadIterator.next()
    if (next && !next.isVideo) {
      const img = new Image()
      img.src = next.bigMedia
    }
  }

  // Reset and preload prev image
  if (currentMedia.value.path) {
    preloadIterator.gotoPath(currentMedia.value.path)
  }
  if (preloadIterator.hasPrev()) {
    const prev = preloadIterator.prev()
    if (prev && !prev.isVideo) {
      const img = new Image()
      img.src = prev.bigMedia
    }
  }
}

function toggleInteractive() {
  hideInteractiveOverlay.value = !hideInteractiveOverlay.value
}

function close() {
  if (isFullscreen.value) {
    closeFullscreen()
  }

  currentMedia.value = null
  iterator.value = null

  // Go back in history
  if (window.history.state) {
    window.history.back()
  }

  emit('close')
}

async function confirmDelete() {
  if (!currentMedia.value) return

  const fileName = currentMedia.value.fileName
  const confirmed = window.confirm(`Do you really want to delete this media file ${fileName}?`)

  if (confirmed) {
    try {
      // Move to next before deleting
      const hasNextItem = hasNext.value
      if (hasNextItem) {
        moveRight()
      } else if (hasPrev.value) {
        moveLeft()
      }

      // Delete the media
      await mediaStore.deleteMedia(fileName)

      // If no more items, close viewer
      if (!hasNextItem && !hasPrev.value) {
        close()
      }
    } catch (error) {
      alert('Failed to delete media: ' + error)
    }
  }
}

// Handle browser back button
function handlePopState() {
  close()
}

onMounted(() => {
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style scoped>
.interactive-overlay {
  z-index: 1001;
}
</style>
