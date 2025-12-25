<template>
  <div class="year-row relative h-32 border-b border-gray-200">
    <!-- Media thumbnails positioned by day of year -->
    <div
      v-for="(media, index) in yearMedia"
      :key="media.fileName + '-' + index"
      class="absolute top-0 cursor-pointer hover:z-10"
      :style="getMediaStyle(media)"
      @click="handleMediaClick(media)"
    >
      <img
        :src="`./images/200/${media.img}`"
        :alt="media.fileName"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <!-- Video icon -->
      <div v-if="media.isVideo" class="absolute top-1 left-1 media-item-icon">
        <svg class="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
        </svg>
      </div>
    </div>

    <!-- Current time indicator line -->
    <div
      v-if="showTimeIndicator"
      class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
      :style="{ left: todayX + 'px' }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CALENDAR_BLOCK_WIDTH, dateToDay } from '@/utils/dateUtils'
import type { Media } from '@/types/media'

interface Props {
  year: string
  yearMedia?: Media[]
  todayX?: number
  activeMedia?: Media
}

const props = withDefaults(defineProps<Props>(), {
  yearMedia: () => [],
  todayX: undefined,
  activeMedia: undefined
})

const emit = defineEmits<{
  mediaClick: [media: Media]
}>()

const BLOCK_WIDTH = CALENDAR_BLOCK_WIDTH
const THUMBNAIL_HEIGHT = 128 // Height of the row

const showTimeIndicator = computed(() => {
  const currentYear = new Date().getFullYear().toString()
  return props.year === currentYear && props.todayX !== undefined
})

function getMediaStyle(media: Media) {
  const dayOfYear = dateToDay(media.date)
  const left = (dayOfYear - 1) * BLOCK_WIDTH

  return {
    left: `${left}px`,
    width: `${BLOCK_WIDTH}px`,
    height: `${THUMBNAIL_HEIGHT}px`
  }
}

function handleMediaClick(media: Media) {
  emit('mediaClick', media)
}
</script>
