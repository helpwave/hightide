/**
 * Determines which element a virtualized list scrolls inside of.
 *
 * - `'container'`: the list scrolls inside its own capped box (the list owns a
 *    `overflow-y-auto` element). Use when the list should keep a fixed height.
 * - `'window'`: the list scrolls together with the document/`window`.
 * - `'page'`: the list scrolls together with the nearest scrollable ancestor
 *    (e.g. the `AppPage` content area). Use when the surrounding page should
 *    expand and scroll as one, instead of the list scrolling inside a capped box.
 */
export type VirtualizationScroll = 'window' | 'container' | 'page'

const SCROLLABLE_OVERFLOW = new Set(['auto', 'scroll', 'overlay'])

/**
 * Walks up the DOM from `element` and returns the nearest ancestor that is an
 * actual vertical scroll container. Backs the `'page'` virtualization mode so a
 * virtualized list can scroll together with the surrounding page instead of
 * inside its own capped box.
 */
export function findScrollableAncestor(element: HTMLElement | null): HTMLElement | null {
  if (!element || typeof window === 'undefined') return null
  let node: HTMLElement | null = element.parentElement
  while (node) {
    const { overflowY } = window.getComputedStyle(node)
    if (SCROLLABLE_OVERFLOW.has(overflowY) && node.scrollHeight > node.clientHeight) {
      return node
    }
    node = node.parentElement
  }
  return null
}

export type ScrollMetrics = {
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
}

/** Reads scroll metrics uniformly from either an element or the `window`. */
export function getScrollMetrics(target: HTMLElement | Window | null): ScrollMetrics {
  if (!target || typeof window === 'undefined') {
    return { scrollTop: 0, scrollHeight: 0, clientHeight: 0 }
  }
  if (target === window) {
    const doc = document.scrollingElement ?? document.documentElement
    return { scrollTop: window.scrollY, scrollHeight: doc.scrollHeight, clientHeight: window.innerHeight }
  }
  const element = target as HTMLElement
  return { scrollTop: element.scrollTop, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }
}

export function isNearBottom(metrics: ScrollMetrics, thresholdPx: number): boolean {
  return metrics.scrollHeight - metrics.scrollTop - metrics.clientHeight <= thresholdPx
}
