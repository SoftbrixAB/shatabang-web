<template>
  <div
    class="media-item cursor-pointer transition-transform hover:scale-105"
    :style="imageWidthStyle"
    @click="handleClick"
  >
    <div class="relative">
      <!-- Thumbnail image -->
      <img
        :src="thumbnailUrl"
        :alt="media.fileName"
        class="w-full h-auto block"
        loading="lazy"
      />

      <!-- Video icon overlay -->
      <div v-if="media.isVideo" class="media-item-icon top-1 left-1">
        <svg
          class="w-8 h-8 text-white drop-shadow-lg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Media } from '@/types/media'

interface Props {
  media: Media
  imageWidthStyle?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  imageWidthStyle: () => ({ width: '100%' })
})

const emit = defineEmits<{
  click: [media: Media]
}>()

const thumbnailUrl = computed(() => {
  // Use thumbnail path from media object
  return `./images/200/${props.media.img}`
})

function handleClick() {
  emit('click', props.media)
}
</script>

<style scoped>
.media-item {
  display: inline-block;
  vertical-align: top;
  margin: 2px;
}
</style>
