<template>
  <div class="year-axis-container h-8 flex items-center bg-gray-100 border-b border-gray-300 sticky top-0 z-10">
    <div
      v-for="year in years"
      :key="year"
      class="year-label px-2 text-sm font-semibold text-gray-700"
      :style="{ minWidth: BLOCK_WIDTH * MAX_DAYS + 'px' }"
    >
      {{ year }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { CALENDAR_BLOCK_WIDTH, MAX_DAYS } from '@/utils/dateUtils'

interface Props {
  years: string[]
}

defineProps<Props>()

const BLOCK_WIDTH = CALENDAR_BLOCK_WIDTH
</script>
