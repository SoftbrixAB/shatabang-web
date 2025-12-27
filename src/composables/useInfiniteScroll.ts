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
  let loadMoreTimeout: NodeJS.Timeout | null = null

  function loadMore() {
    if (loading.value || !hasMore.value) {
      console.log('loadMore: Skipped - loading:', loading.value, 'hasMore:', hasMore.value)
      return
    }

    console.log('loadMore: Starting, current items:', items.value.length)
    loading.value = true

    try {
      const newItems: T[] = []

      for (let i = 0; i < batchSize && iterator.hasPrev(); i++) {
        const item = iterator.prev()
        if (item) {
          // Store the path in the item
          ;(item as any).path = iterator.getPath()
          newItems.push(item)
        }
      }

      hasMore.value = iterator.hasPrev()
      items.value.push(...newItems)
      console.log('loadMore: Loaded', newItems.length, 'items. Total:', items.value.length, 'hasMore:', hasMore.value)
    } finally {
      loading.value = false

      // After loading, check if we need to load more (still at bottom and more available)
      // Wait longer for DOM to update and reflow
      if (hasMore.value) {
        setTimeout(() => {
          // Use requestAnimationFrame to wait for next paint
          requestAnimationFrame(() => {
            setTimeout(() => checkIfNeedMore(), 100)
          })
        }, 200)
      }
    }
  }

  function checkIfNeedMore() {
    const galleryContainer = document.getElementById('gallery-container')
    if (!galleryContainer) {
      console.log('checkIfNeedMore: Gallery container not found')
      return
    }

    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // Get the gallery's position and height to determine if it fills the viewport
    const galleryRect = galleryContainer.getBoundingClientRect()
    const galleryHeight = galleryContainer.scrollHeight
    const galleryTop = galleryRect.top

    // Calculate if the gallery content extends beyond the viewport
    // galleryTop is relative to viewport, so galleryTop + galleryHeight tells us where gallery ends
    const galleryBottomInViewport = galleryTop + galleryHeight
    const availableSpace = windowHeight

    // Only auto-load more if the gallery doesn't extend past the viewport
    // Once it extends past viewport by 50px, it's scrollable enough
    const isPageScrollable = galleryBottomInViewport > availableSpace + 50

    console.log('checkIfNeedMore: windowHeight:', windowHeight, 'documentHeight:', documentHeight, 'galleryHeight:', galleryHeight, 'galleryTop:', galleryTop, 'galleryBottomInViewport:', galleryBottomInViewport, 'isPageScrollable:', isPageScrollable, 'items:', items.value.length)

    if (!isPageScrollable && hasMore.value && !loading.value) {
      // Page still fits in window, load more to make it scrollable
      console.log('checkIfNeedMore: Page not scrollable, loading more')
      loadMore()
    } else {
      console.log('checkIfNeedMore: Page is scrollable, waiting for user scroll')
    }
  }

  function debouncedLoadMore() {
    // Clear existing timeout
    if (loadMoreTimeout) {
      clearTimeout(loadMoreTimeout)
    }

    console.log('debouncedLoadMore: Scheduling load in 500ms')

    // Schedule loadMore after 500ms
    loadMoreTimeout = setTimeout(() => {
      if (hasMore.value && !loading.value) {
        console.log('debouncedLoadMore: Debounce timeout reached, loading')
        loadMore()
      }
    }, 200)
  }

  // Set up scroll listener with debounced load
  const { checkScroll } = useScrollAlmostDown(() => {
    if (hasMore.value && !loading.value) {
      debouncedLoadMore()
    }
  }, threshold)

  // Load initial batch
  loadMore()

  return {
    items,
    hasMore,
    loading,
    loadMore,
    checkIfNeedMore
  }
}
