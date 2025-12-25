<template>
  <div class="calendar-view h-full p-4">
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Calendar View</h1>
      <div class="flex gap-2">
        <button @click="scrollToToday" class="btn-primary">
          Today
        </button>
        <button @click="scrollToStart" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Start
        </button>
        <button @click="scrollToEnd" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          End
        </button>
      </div>
    </div>

    <div class="calendar-placeholder border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <p class="text-gray-600 text-lg mb-2">Calendar visualization coming in Phase 6</p>
      <p class="text-gray-500 text-sm">
        Will display year-based timeline with media thumbnails
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
function scrollToToday() {
  console.log('Scroll to today')
}

function scrollToStart() {
  console.log('Scroll to start')
}

function scrollToEnd() {
  console.log('Scroll to end')
}
</script>
