import type { Key, RefObject } from 'react'
import { useEffect, useState } from 'react'
import type { Virtualizer } from '@tanstack/react-virtual'
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual'
import { findPageScrollContainer, type VirtualizationScroll } from './virtualizationScroll'

export type UseVirtualizedRowsOptions = {
  scroll: VirtualizationScroll,
  count: number,
  estimateRowHeight: number,
  overscan: number,
  enabled?: boolean,
  getItemKey?: (index: number) => Key,
  /**
   * The element whose top marks where the virtualized content starts (e.g. the
   * `tbody` for a table, or the grid wrapper for a card grid). Used to measure
   * the scroll offset for the `'window'` and `'page'` modes.
   */
  contentRef: RefObject<HTMLElement | null>,
  /** The scroll container element for the `'container'` mode. */
  containerRef?: RefObject<HTMLElement | null>,
  /** Called while the rendered range is within `reachBottomThresholdPx` of the end. */
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
  enabled = true,
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
        const container = findPageScrollContainer(content)
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
    // `count` is included so the scroll container is re-resolved and the offset
    // re-measured once rows arrive (data often loads after the first mount).
  }, [scroll, usesOuterScroll, contentRef, count])

  const common = {
    estimateSize: () => estimateRowHeight,
    overscan,
    useScrollendEvent: true,
    useAnimationFrameWithResizeObserver: true,
    ...(getItemKey ? { getItemKey } : {}),
  }
  const windowVirtualizer = useWindowVirtualizer({
    ...common,
    count: scroll === 'window' ? count : 0,
    scrollMargin,
    enabled: enabled && scroll === 'window',
  })
  const containerVirtualizer = useVirtualizer({
    ...common,
    count: scroll === 'container' ? count : 0,
    getScrollElement: () => containerRef?.current ?? null,
    enabled: enabled && scroll === 'container',
  })
  const pageVirtualizer = useVirtualizer({
    ...common,
    count: scroll === 'page' ? count : 0,
    getScrollElement: () => pageScrollElement,
    scrollMargin,
    enabled: enabled && scroll === 'page',
  })

  const virtualizer = (
    scroll === 'window'
      ? windowVirtualizer
      : scroll === 'page'
        ? pageVirtualizer
        : containerVirtualizer
  ) as unknown as Virtualizer<Element, Element>
  const offset = usesOuterScroll ? scrollMargin : 0

  const endIndex = virtualizer.range?.endIndex ?? (enabled ? -1 : (isMounted ? count - 1 : -1))
  const thresholdRows = Math.max(1, Math.ceil(reachBottomThresholdPx / Math.max(1, estimateRowHeight)))
  useEffect(() => {
    if (!onReachBottom) return
    if (endIndex >= count - 1 - thresholdRows) onReachBottom()
  }, [onReachBottom, endIndex, count, thresholdRows, isMounted])

  return { virtualizer, offset, pageScrollElement, isMounted }
}
