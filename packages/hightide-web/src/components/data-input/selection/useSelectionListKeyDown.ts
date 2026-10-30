import type { KeyboardEvent } from 'react'
import { useCallback } from 'react'

type SelectionListKeyDownArgs = {
  isSearchVisible: boolean,
  highlightedId: string | null,
  highlightNext: () => void,
  highlightPrevious: () => void,
  highlightFirst: () => void,
  highlightLast: () => void,
  onConfirm: (id: string) => void,
  onTypeahead?: (key: string) => void,
  confirmOnSpace: boolean,
}

export function useSelectionListKeyDown({
  isSearchVisible,
  highlightedId,
  highlightNext,
  highlightPrevious,
  highlightFirst,
  highlightLast,
  onConfirm,
  onTypeahead,
  confirmOnSpace,
}: SelectionListKeyDownArgs) {
  return useCallback((event: KeyboardEvent) => {
    switch (event.key) {
    case 'ArrowDown':
      highlightNext()
      event.preventDefault()
      break
    case 'ArrowUp':
      highlightPrevious()
      event.preventDefault()
      break
    case 'Home':
      event.preventDefault()
      highlightFirst()
      break
    case 'End':
      event.preventDefault()
      highlightLast()
      break
    case 'Enter':
    case ' ':
      if (event.key === ' ' && (!confirmOnSpace || isSearchVisible)) return
      if (highlightedId) {
        onConfirm(highlightedId)
        event.preventDefault()
      }
      break
    default:
      if (
        !isSearchVisible
        && onTypeahead
        && !event.ctrlKey
        && !event.metaKey
        && !event.altKey
        && event.key.length === 1
      ) {
        onTypeahead(event.key)
        event.preventDefault()
      }
      break
    }
  }, [
    confirmOnSpace,
    highlightFirst,
    highlightLast,
    highlightNext,
    highlightPrevious,
    highlightedId,
    isSearchVisible,
    onConfirm,
    onTypeahead,
  ])
}
