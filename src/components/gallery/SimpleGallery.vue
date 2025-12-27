<template>
  <div id="gallery-container" class="simple-gallery">
    <!-- Media items grouped by year -->
    <template v-for="(group, groupIndex) in groupedByYear" :key="'year-' + group.year">
      <!-- Year header -->
      <div
        class="year-header cursor-pointer hover:bg-gray-100 transition-colors"
        @click="toggleYear(group.year)"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-3xl font-bold text-gray-800 py-4">{{ group.year }}</h2>
          <svg
            class="w-6 h-6 text-gray-600 transition-transform"
            :class="{ 'rotate-180': collapsedYears.has(group.year) }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Images for this year -->
      <div v-show="!collapsedYears.has(group.year)" class="gallery-grid">
        <MediaGalleryItem
          v-for="(media, index) in group.items"
          :key="media.fileName + '-' + index"
          :media="media"
          :image-width-style="imageWidthStyle"
          @click="handleMediaClick(media, group.startIndex + index)"
        />
      </div>
    </template>

    <!-- Loading indicator -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="text-gray-600 mt-2">Loading more media...</p>
    </div>

    <!-- End of gallery indicator -->
    <div v-else-if="!hasMore && items.length > 0" class="text-center py-8 text-gray-500">
      <p>End of gallery ({{ items.length }} items)</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && items.length === 0" class="text-center py-12">
      <p class="text-gray-600">No media to display</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import MediaGalleryItem from './MediaGalleryItem.vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import { useMediaStore } from '@/stores/mediaStore'
import type { Media } from '@/types/media'

interface Props {
  imageWidthStyle?: Record<string, string>
  fromDate?: Date
}

const props = withDefaults(defineProps<Props>(), {
  imageWidthStyle: () => ({ width: '100%' }),
  fromDate: undefined
})

const emit = defineEmits<{
  mediaClick: [media: Media, galleryIndex: number]
}>()

const mediaStore = useMediaStore()
const iterator = ref(mediaStore.getIteratorReverse())

// Track collapsed years
const collapsedYears = ref<Set<string>>(new Set())

// Use infinite scroll composable
const { items, hasMore, loading, loadMore, checkIfNeedMore } = useInfiniteScroll<Media>(iterator.value, {
  batchSize: 64,
  threshold: 300
})

// Group items by year
const groupedByYear = computed(() => {
  const groups: { year: string; items: Media[]; startIndex: number }[] = []
  let currentYear: string | null = null
  let currentGroup: Media[] = []
  let startIndex = 0

  items.value.forEach((media, index) => {
    const mediaDate = new Date(media.date)
    const year = mediaDate.getFullYear().toString()

    if (year !== currentYear) {
      // Save previous group if it exists
      if (currentYear !== null && currentGroup.length > 0) {
        groups.push({
          year: currentYear,
          items: currentGroup,
          startIndex: startIndex
        })
        startIndex += currentGroup.length
      }

      // Start new group
      currentYear = year
      currentGroup = [media]
    } else {
      currentGroup.push(media)
    }
  })

  // Add the last group
  if (currentYear !== null && currentGroup.length > 0) {
    groups.push({
      year: currentYear,
      items: currentGroup,
      startIndex: startIndex
    })
  }

  return groups
})

// Expose loadMore so parent components can trigger loading
defineExpose({
  loadMore,
  loadedCount: () => items.value.length
})

// Handle media click
function handleMediaClick(media: Media, galleryIndex: number) {
  emit('mediaClick', media, galleryIndex)
}

// Toggle year collapse/expand
function toggleYear(year: string) {
  if (collapsedYears.value.has(year)) {
    collapsedYears.value.delete(year)
  } else {
    collapsedYears.value.add(year)
  }
  // Trigger reactivity
  collapsedYears.value = new Set(collapsedYears.value)

  // After toggling, check if we need to load more items
  // Wait for DOM update and check if more items needed
  nextTick(() => {
    setTimeout(() => {
      checkIfNeedMore()
    }, 100)
  })
}

// Watch for zoom level changes (imageWidthStyle) to check if more items needed
watch(() => props.imageWidthStyle, async () => {
  // Wait for DOM to update with new image sizes
  await nextTick()
  // Small delay to let images resize
  setTimeout(() => {
    checkIfNeedMore()
  }, 100)
}, { deep: true })

// Watch for fromDate changes to restart iterator
watch(() => props.fromDate, (newDate) => {
  if (newDate) {
    // Reset iterator to start from a specific date
    // This would require extending the iterator API
    console.log('Filter by date:', newDate)
  }
})
</script>

<style scoped>
.simple-gallery {
  width: 100%;
}

.year-header {
  width: 100%;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 8px;
  padding: 0 16px;
}

.gallery-grid {
  font-size: 0; /* Remove whitespace between inline-block elements */
  line-height: 0;
  width: 100%;
  margin-bottom: 16px;
}
</style>
