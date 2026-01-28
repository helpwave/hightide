import type { RefObject } from 'react'
import { useLayoutEffect } from 'react'

export type UseResizeObserverProps = {
  observedElementRef?: RefObject<Element>,
  onResize: () => void,
  isActive?: boolean,
}

export function useResizeObserver({ observedElementRef, onResize, isActive = true }: UseResizeObserverProps) {
  useLayoutEffect(() => {
    const el = observedElementRef?.current
    if (!el || !isActive) return

    const observer = new ResizeObserver(() => {
      onResize()
    })

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [observedElementRef, onResize, isActive])
}
