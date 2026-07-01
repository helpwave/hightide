import type { ReactNode } from 'react'
import type { ElementSize } from '@helpwave/hightide-tokens'

/**
 * An icon/content slot. Either a plain node, or a render function that receives
 * the resolved foreground color and a suggested size so the icon can match the
 * element's coloring (e.g. an outline button recoloring its icon on press).
 */
export type Slot = ReactNode | ((opts: { color: string, size: number }) => ReactNode)

export const renderSlot = (slot: Slot | undefined, color: string, size: number): ReactNode => {
  if (typeof slot === 'function') {
    return slot({ color, size })
  }
  return slot ?? null
}

/** Suggested icon size (px) for an interactive element of a given size. */
export const iconSizeForElement: Record<ElementSize, number> = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 22,
}
