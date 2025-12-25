import { onMounted, onUnmounted } from 'vue'

export interface KeyboardNavHandlers {
  onLeft?: (event: KeyboardEvent) => void
  onRight?: (event: KeyboardEvent) => void
  onUp?: (event: KeyboardEvent) => void
  onDown?: (event: KeyboardEvent) => void
  onEscape?: (event: KeyboardEvent) => void
  onEnter?: (event: KeyboardEvent) => void
  onSpace?: (event: KeyboardEvent) => void
  onDelete?: (event: KeyboardEvent) => void
}

export function useKeyboardNav(handlers: KeyboardNavHandlers) {
  function handleKey(event: KeyboardEvent) {
    // Arrow Left
    if ((event.key === 'ArrowLeft' || event.keyCode === 37) && handlers.onLeft) {
      event.preventDefault()
      handlers.onLeft(event)
    }
    // Arrow Right
    else if ((event.key === 'ArrowRight' || event.keyCode === 39) && handlers.onRight) {
      event.preventDefault()
      handlers.onRight(event)
    }
    // Arrow Up
    else if ((event.key === 'ArrowUp' || event.keyCode === 38) && handlers.onUp) {
      event.preventDefault()
      handlers.onUp(event)
    }
    // Arrow Down
    else if ((event.key === 'ArrowDown' || event.keyCode === 40) && handlers.onDown) {
      event.preventDefault()
      handlers.onDown(event)
    }
    // Escape
    else if ((event.key === 'Escape' || event.keyCode === 27) && handlers.onEscape) {
      event.preventDefault()
      handlers.onEscape(event)
    }
    // Enter
    else if ((event.key === 'Enter' || event.keyCode === 13) && handlers.onEnter) {
      event.preventDefault()
      handlers.onEnter(event)
    }
    // Space
    else if ((event.key === ' ' || event.keyCode === 32) && handlers.onSpace) {
      event.preventDefault()
      handlers.onSpace(event)
    }
    // Delete or Backspace
    else if (
      ((event.key === 'Delete' || event.keyCode === 46) ||
       (event.key === 'Backspace' || event.keyCode === 8)) &&
      handlers.onDelete
    ) {
      event.preventDefault()
      handlers.onDelete(event)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKey)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKey)
  })

  return {
    handleKey
  }
}
