'use client'

import type { RefObject } from 'react'
import { useLayoutEffect } from 'react'

function getScrollParents(el: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = []
  let parent = el.parentElement

  while (parent) {
    const { overflow, overflowX, overflowY } = getComputedStyle(parent)
    if (/(auto|scroll|overlay)/.test(overflow + overflowX + overflowY)) {
      parents.push(parent)
    }
    parent = parent.parentElement
  }

  // only safe because window
  parents.push(window as unknown as HTMLElement)
  return parents
}

type UseScrollObserverProps = {
  observedElementRef?: RefObject<HTMLElement>,
  onScroll: () => void,
  isActive?: boolean,
}

export function useScrollObserver({ observedElementRef, onScroll, isActive = true }: UseScrollObserverProps) {
  useLayoutEffect(() => {
    if (!observedElementRef?.current || !isActive) return

    const parents = getScrollParents(observedElementRef.current)
    parents.forEach(p => p.addEventListener('scroll', onScroll, { passive: true }))

    return () => {
      parents.forEach(p => p.removeEventListener('scroll', onScroll))
    }
  }, [observedElementRef, onScroll, isActive])
}