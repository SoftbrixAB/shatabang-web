<template>
  <svg :height="30" class="calendar-width w-full">
    <g v-for="(day, index) in days" :key="index">
      <!-- Vertical line -->
      <line
        :x1="index * BLOCK_WIDTH + 0.5"
        :y1="15"
        :x2="index * BLOCK_WIDTH + 0.5"
        :y2="30"
        stroke="#ccc"
        stroke-width="1"
      />
      <!-- Date label -->
      <text
        v-if="showLabel(index)"
        :x="index * BLOCK_WIDTH + 5"
        :y="25"
        class="text-xs fill-gray-600"
      >
        {{ formatMonthDay(day) }}
      </text>
    </g>

    <!-- Current time indicator line (if provided) -->
    <line
      v-if="todayX !== undefined"
      :x1="todayX"
      :y1="0"
      :x2="todayX"
      :y2="30"
      stroke="red"
      stroke-width="2"
    />
  </svg>
</template>

<script setup lang="ts">
import { CALENDAR_BLOCK_WIDTH, formatMonthDay } from '@/utils/dateUtils'

interface Props {
  days: Date[]
  todayX?: number
}

const props = defineProps<Props>()

const BLOCK_WIDTH = CALENDAR_BLOCK_WIDTH

// Show label every 7 days (approximately weekly)
function showLabel(index: number): boolean {
  return index % 7 === 0
}
</script>

<style scoped>
.calendar-width {
  width: calc(366 * 180px);
}
</style>
