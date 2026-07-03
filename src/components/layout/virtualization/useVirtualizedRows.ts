import type { Key, RefObject } from 'react'
import { useEffect, useState } from 'react'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual'
import {
  findScrollableAncestor,
  getScrollMetrics,
  isNearBottom,
  type VirtualizationScroll
} from './virtualizationScroll'

export type UseVirtualizedRowsOptions = {
  scroll: VirtualizationScroll,
  count: number,
  estimateRowHeight: number,
  overscan: number,
  getItemKey?: (index: number) => Key,
  /**
   * The element whose top marks where the virtualized content starts (e.g. the
   * `tbody` for a table, or the grid wrapper for a card grid). Used to measure
   * the scroll offset for the `'window'` and `'page'` modes.
   */
  contentRef: RefObject<HTMLElement | null>,
  /** The scroll container element for the `'container'` mode. */
  containerRef?: RefObject<HTMLElement | null>,
  /** Called while the user is within `reachBottomThresholdPx` of the bottom. */
  onReachBottom?: () => void,
  reachBottomThresholdPx?: number,
}

export type UseVirtualizedRowsResult = {
  virtualizer: Virtualizer<Element, Element>,
  /** Subtract from `virtualItem.start` to get a position relative to `contentRef`. */
  offset: number,
  /** The resolved scrollable ancestor for the `'page'` mode (else `null`). */
  pageScrollElement: HTMLElement | null,
  isMounted: boolean,
}

/**
 * Shared virtualization plumbing for the table and card grid. Selects the right
 * TanStack virtualizer for the requested {@link VirtualizationScroll} mode,
 * measures the content offset for outer-scroll modes, resolves the page scroll
 * container, and wires up "reached the bottom" callbacks for infinite scroll.
 */
export function useVirtualizedRows({
  scroll,
  count,
  estimateRowHeight,
  overscan,
  getItemKey,
  contentRef,
  containerRef,
  onReachBottom,
  reachBottomThresholdPx = 600,
}: UseVirtualizedRowsOptions): UseVirtualizedRowsResult {
  const [scrollMargin, setScrollMargin] = useState(0)
  const [pageScrollElement, setPageScrollElement] = useState<HTMLElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  const usesOuterScroll = scroll === 'window' || scroll === 'page'

  // Resolve the page scroll container and measure where the content sits inside
  // the outer scroll region. Both quantities are scroll-invariant, so re-running
  // on layout changes (content growing, resize) is enough.
  useEffect(() => {
    if (!usesOuterScroll) return
    const content = contentRef.current
    if (!content || typeof window === 'undefined') return

    const measure = () => {
      if (scroll === 'page') {
        const container = findScrollableAncestor(content)
        setPageScrollElement(prev => (prev === container ? prev : container))
        const top = container
          ? content.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop
          : content.getBoundingClientRect().top + window.scrollY
        setScrollMargin(prev => (Math.abs(prev - top) < 1 ? prev : top))
        return
      }
      const top = content.getBoundingClientRect().top + window.scrollY
      setScrollMargin(prev => (Math.abs(prev - top) < 1 ? prev : top))
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(content)
    window.addEventListener('resize', measure)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [scroll, usesOuterScroll, contentRef])

  const common = {
    count,
    estimateSize: () => estimateRowHeight,
    overscan,
    ...(getItemKey ? { getItemKey } : {}),
  }
  const windowVirtualizer = useWindowVirtualizer({ ...common, scrollMargin })
  const containerVirtualizer = useVirtualizer({ ...common, getScrollElement: () => containerRef?.current ?? null })
  const pageVirtualizer = useVirtualizer({ ...common, getScrollElement: () => pageScrollElement, scrollMargin })

  const virtualizer = (
    scroll === 'window'
      ? windowVirtualizer
      : scroll === 'page'
        ? pageVirtualizer
        : containerVirtualizer
  ) as unknown as Virtualizer<Element, Element>
  const offset = usesOuterScroll ? scrollMargin : 0

  // Infinite scroll: notify the consumer when the active scroll target nears its bottom.
  useEffect(() => {
    if (!onReachBottom || typeof window === 'undefined') return
    const target: HTMLElement | Window | null =
      scroll === 'window' ? window : scroll === 'page' ? pageScrollElement : containerRef?.current ?? null
    if (!target) return

    const handler = () => {
      if (isNearBottom(getScrollMetrics(target), reachBottomThresholdPx)) onReachBottom()
    }
    target.addEventListener('scroll', handler, { passive: true } as AddEventListenerOptions)
    window.addEventListener('resize', handler)
    handler()
    return () => {
      target.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [scroll, pageScrollElement, containerRef, onReachBottom, reachBottomThresholdPx, isMounted])

  return { virtualizer, offset, pageScrollElement, isMounted }
}
