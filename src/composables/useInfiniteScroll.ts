import { ref } from 'vue'
import { useScrollAlmostDown } from './useScrollAlmostDown'
import type { DibbaIterator } from '@/services/dibba-tree'

export function useInfiniteScroll<T>(
  iterator: DibbaIterator<T>,
  options: {
    batchSize?: number
    threshold?: number
  } = {}
) {
  const { batchSize = 64, threshold = 300 } = options

  const items = ref<T[]>([]) as any
  const hasMore = ref(true)
  const loading = ref(false)

  function loadMore() {
    if (loading.value || !hasMore.value) {
      return
    }

    loading.value = true

    try {
      const newItems: T[] = []

      for (let i = 0; i < batchSize && iterator.hasPrev(); i++) {
        const item = iterator.prev()
        // Store the path in the item
        ;(item as any).path = iterator.getPath()
        newItems.push(item)
      }

      hasMore.value = iterator.hasPrev()
      items.value.push(...newItems)
    } finally {
      loading.value = false
    }
  }

  // Set up scroll listener
  useScrollAlmostDown(() => {
    if (hasMore.value && !loading.value) {
      loadMore()
    }
  }, threshold)

  // Load initial batch
  loadMore()

  return {
    items,
    hasMore,
    loading,
    loadMore
  }
}
