import { useCallback, useLayoutEffect, useState, type RefObject } from 'react'

export type ScrollbarState = 'vertical' | 'horizontal' | 'both'

const getScrollbarState = (element: HTMLElement): ScrollbarState | undefined => {
  const hasHorizontalScrollbar = element.scrollWidth > element.clientWidth
  const hasVerticalScrollbar = element.scrollHeight > element.clientHeight

  if (hasHorizontalScrollbar && hasVerticalScrollbar) {
    return 'both'
  }
  if (hasHorizontalScrollbar) {
    return 'horizontal'
  }
  if (hasVerticalScrollbar) {
    return 'vertical'
  }
  return undefined
}

export type UseScrollbarStateProps = {
  containerRef: RefObject<HTMLElement | null>,
  contentRef?: RefObject<HTMLElement | null>,
  dependencies?: unknown[],
}

export function useScrollbarState({
  containerRef,
  contentRef,
  dependencies = [],
}: UseScrollbarStateProps) {
  const [scrollbarState, setScrollbarState] = useState<ScrollbarState | undefined>(undefined)

  const updateScrollbarState = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      return
    }
    setScrollbarState(getScrollbarState(container))
  }, [containerRef])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    updateScrollbarState()

    const observer = new ResizeObserver(updateScrollbarState)
    observer.observe(container)

    const content = contentRef?.current
    if (content) {
      observer.observe(content)
    }

    return () => {
      observer.disconnect()
    }
  }, [containerRef, contentRef, updateScrollbarState, ...dependencies])

  return scrollbarState
}
