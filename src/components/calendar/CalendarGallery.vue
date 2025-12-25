<template>
  <div class="calendar-gallery relative">
    <!-- Year axis -->
    <CalendarYearAxis :years="mediaStore.folders" />

    <!-- Year rows -->
    <div class="years-container">
      <CalendarYearRow
        v-for="year in mediaStore.folders"
        :key="year"
        :year="year"
        :year-media="getYearMedia(year)"
        :today-x="nowX"
        :active-media="activeMedia"
        @media-click="handleMediaClick"
      />
    </div>

    <!-- Date axis at bottom -->
    <div class="sticky bottom-0 bg-white z-10">
      <CalendarDateAxis :days="days" :today-x="nowX" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMediaStore } from '@/stores/mediaStore'
import { generateYearDays, dateToDay, CALENDAR_BLOCK_WIDTH } from '@/utils/dateUtils'
import type { Media } from '@/types/media'
import CalendarYearAxis from './CalendarYearAxis.vue'
import CalendarYearRow from './CalendarYearRow.vue'
import CalendarDateAxis from './CalendarDateAxis.vue'

interface Props {
  activeMedia?: Media
}

defineProps<Props>()

const emit = defineEmits<{
  mediaClick: [media: Media]
}>()

const mediaStore = useMediaStore()
const days = ref(generateYearDays())
const nowX = ref(0)
const updateInterval = ref<number | null>(null)

function updateTimeIndicator() {
  const now = new Date()
  const dayNumber = dateToDay(now)
  const hour = now.getHours()
  const minute = now.getMinutes()
  const timeFraction = (hour * 60 + minute) / (24 * 60)

  nowX.value = (dayNumber - 1 + timeFraction) * CALENDAR_BLOCK_WIDTH
}

function getYearMedia(_year: string): Media[] {
  // Filter media for this specific year from the tree
  // For now, return empty array - would need to traverse tree
  // This is a placeholder - actual implementation would query the tree
  return []
}

function handleMediaClick(media: Media) {
  emit('mediaClick', media)
}

onMounted(() => {
  updateTimeIndicator()
  // Update time indicator every minute
  updateInterval.value = window.setInterval(updateTimeIndicator, 60000)
})

onUnmounted(() => {
  if (updateInterval.value !== null) {
    clearInterval(updateInterval.value)
  }
})
</script>

<style scoped>
.years-container {
  overflow-x: auto;
  overflow-y: visible;
}
</style>
