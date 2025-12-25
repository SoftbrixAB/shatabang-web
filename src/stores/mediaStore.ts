import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { MediaTree } from '@/services/dibba-tree'
import type { DibbaIterator } from '@/services/dibba-tree'
import type { Media } from '@/types/media'
import { parseMediaFile, isNumber } from '@/utils/mediaUtils'

export const useMediaStore = defineStore('media', () => {
  // State
  const tree = ref(new MediaTree())
  const folders = ref<string[]>([])
  const isLoaded = ref(false)
  const isFullyLoaded = ref(false)
  const loadingError = ref<string | null>(null)

  // Computed
  const mediaCount = computed(() => tree.value.getSize())

  // Actions
  async function initialize() {
    try {
      // Fetch the list of year folders
      const response = await api.get('./api/dirs/list')
      let yearFolders = response.data as string[]

      if (yearFolders.length === 0) {
        isLoaded.value = true
        isFullyLoaded.value = true
        return
      }

      // Sort folders descending (newest first)
      yearFolders = yearFolders.filter(isNumber).sort((a, b) => parseInt(b) - parseInt(a))

      // Load the first year's images to get initial data
      let firstYearLoaded = false
      for (let i = 0; i < yearFolders.length; i++) {
        const folder = yearFolders[i]
        await loadImageList(folder)

        if (tree.value.getSize() > 0) {
          firstYearLoaded = true
          isLoaded.value = true

          // Load remaining years in background
          loadRemainingYears(yearFolders.slice(i + 1))
          break
        }
      }

      if (!firstYearLoaded) {
        isLoaded.value = true
        isFullyLoaded.value = true
      }
    } catch (error) {
      console.error('Failed to initialize media store:', error)
      loadingError.value = error instanceof Error ? error.message : 'Unknown error'
      throw error
    }
  }

  async function loadImageList(folder: string) {
    try {
      folders.value.push(folder)
      const response = await api.get(`./images/info/${folder}/media.lst`)
      const imageList = response.data as string
      const images = imageList.split(',')

      console.log(`Loaded ${images.length} images from folder ${folder}`)

      if (folder !== 'import') {
        importImages(images)
      }

      return images.length
    } catch (error) {
      console.error(`Failed to load image list for folder ${folder}:`, error)
      return 0
    }
  }

  function importImages(images: string[]) {
    images.forEach((fileName) => {
      if (fileName.length <= 0) {
        return
      }

      const media = parseMediaFile(fileName)
      const date = media.date

      const y = date.getFullYear()
      const m = date.getMonth() + 1 // Month is 0-indexed, dibba-tree expects 1-indexed
      const d = date.getDate()
      const hh = date.getHours()
      const mm = date.getMinutes()
      const ss = date.getSeconds()
      const id = parseInt(fileName.split('_')[1]) || 0

      tree.value.update(media, y, m, d, hh, mm, ss, id)
    })
  }

  async function loadRemainingYears(remainingFolders: string[]) {
    try {
      const promises = remainingFolders.map(loadImageList)
      await Promise.all(promises)

      console.log(`Total media count: ${tree.value.getSize()}`)
      isFullyLoaded.value = true
    } catch (error) {
      console.error('Error loading remaining years:', error)
    }
  }

  async function deleteMedia(fileName: string): Promise<void> {
    try {
      await api.delete(`./api/images/${fileName}`)
      console.log(`Deleted media: ${fileName}`)
      // Note: Tree doesn't support removal, so we'd need to reload or track deleted items
    } catch (error) {
      console.error(`Failed to delete media ${fileName}:`, error)
      throw error
    }
  }

  function getIterator(): DibbaIterator<Media> {
    return tree.value.leafIterator()
  }

  function getIteratorReverse(): DibbaIterator<Media> {
    return tree.value.leafIteratorReverse()
  }

  return {
    // State
    tree,
    folders,
    isLoaded,
    isFullyLoaded,
    loadingError,

    // Computed
    mediaCount,

    // Actions
    initialize,
    deleteMedia,
    getIterator,
    getIteratorReverse
  }
})
