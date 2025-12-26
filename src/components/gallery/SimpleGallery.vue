<template>
  <div class="simple-gallery">
    <!-- Media items -->
    <div class="gallery-grid">
      <MediaGalleryItem
        v-for="(media, index) in items"
        :key="media.fileName + '-' + index"
        :media="media"
        :image-width-style="imageWidthStyle"
        @click="handleMediaClick"
      />
    </div>

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
import { ref, watch } from 'vue'
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
  mediaClick: [media: Media]
}>()

const mediaStore = useMediaStore()
const iterator = ref(mediaStore.getIteratorReverse())

// Use infinite scroll composable
const { items, hasMore, loading, loadMore } = useInfiniteScroll<Media>(iterator.value, {
  batchSize: 64,
  threshold: 300
})

// Expose loadMore so parent components can trigger loading
defineExpose({
  loadMore,
  loadedCount: () => items.value.length
})

// Handle media click
function handleMediaClick(media: Media) {
  console.log('SimpleGallery: media clicked, emitting mediaClick:', media)
  emit('mediaClick', media)
}

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

.gallery-grid {
  font-size: 0; /* Remove whitespace between inline-block elements */
  line-height: 0;
  width: 100%;
}
</style>
