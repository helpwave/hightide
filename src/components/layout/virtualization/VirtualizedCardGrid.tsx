import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { columnsForWidth, chunkIntoRows, overscanRowsForBuffer } from './gridLayout'
import { useVirtualizedRows } from './useVirtualizedRows'
import type { VirtualizationScroll } from './virtualizationScroll'

const DEFAULT_GAP_PX = 12
const DEFAULT_ESTIMATE_ROW_HEIGHT_PX = 220
// Render roughly a screenful of extra rows in each direction so a fast mobile
// momentum scroll cannot outrun the render and reveal a blank list.
const DEFAULT_OVERSCAN_ROWS = overscanRowsForBuffer(800, DEFAULT_ESTIMATE_ROW_HEIGHT_PX)
const DEFAULT_VIRTUALIZE_THRESHOLD = 40
const DEFAULT_REACH_BOTTOM_THRESHOLD_PX = 600

export type VirtualizedCardGridProps<T> = {
  items: readonly T[],
  getItemKey: (item: T) => string,
  renderItem: (item: T) => ReactNode,
  /** Minimum width a card may shrink to before the column count drops. */
  minCardWidthPx: number,
  gapPx?: number,
  estimateRowHeightPx?: number,
  overscanRows?: number,
  /** Below this item count the grid renders every card without virtualization. */
  virtualizeThreshold?: number,
  /** Where the grid scrolls. Defaults to `'container'` (its own capped box). */
  scroll?: VirtualizationScroll,
  containerClassName?: string,
  /** Called for infinite scroll while nearing the bottom of the scroll region. */
  onReachBottom?: () => void,
  reachBottomThresholdPx?: number,
}

/**
 * A responsive, virtualized grid of cards backed by TanStack Virtual. Shares its
 * scroll handling ({@link VirtualizationScroll} modes + infinite scroll) with
 * the virtualized table via {@link useVirtualizedRows}, so a card grid and a
 * table can behave identically inside the same scroll region.
 */
export function VirtualizedCardGrid<T>({
  items,
  getItemKey,
  renderItem,
  minCardWidthPx,
  gapPx = DEFAULT_GAP_PX,
  estimateRowHeightPx = DEFAULT_ESTIMATE_ROW_HEIGHT_PX,
  overscanRows = DEFAULT_OVERSCAN_ROWS,
  virtualizeThreshold = DEFAULT_VIRTUALIZE_THRESHOLD,
  scroll = 'container',
  containerClassName,
  onReachBottom,
  reachBottomThresholdPx = DEFAULT_REACH_BOTTOM_THRESHOLD_PX,
}: VirtualizedCardGridProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const element = containerRef.current
    if (!element || typeof window === 'undefined') return

    const measure = () => {
      const nextColumns = columnsForWidth(element.clientWidth, minCardWidthPx, gapPx)
      setColumns((prev) => (prev === nextColumns ? prev : nextColumns))
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(element)
    window.addEventListener('resize', measure)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [minCardWidthPx, gapPx])

  const rows = useMemo(() => chunkIntoRows(items, columns), [items, columns])

  const { virtualizer, offset, isMounted } = useVirtualizedRows({
    scroll,
    count: rows.length,
    estimateRowHeight: estimateRowHeightPx,
    overscan: overscanRows,
    enabled: items.length > virtualizeThreshold,
    getItemKey: (index) => {
      const first = rows[index]?.[0]
      return first ? getItemKey(first) : index
    },
    contentRef: containerRef,
    containerRef,
    onReachBottom,
    reachBottomThresholdPx,
  })

  useEffect(() => {
    virtualizer.measure()
  }, [columns, virtualizer])

  const autoFillTemplate = `repeat(auto-fill, minmax(min(100%, ${minCardWidthPx}px), 1fr))`
  const shouldVirtualize = isMounted && items.length > virtualizeThreshold

  if (!shouldVirtualize) {
    return (
      <div ref={containerRef} className={clsx('w-full print:hidden', containerClassName)}>
        <div className="grid w-full" style={{ gridTemplateColumns: autoFillTemplate, gap: gapPx }}>
          {items.map(renderItem)}
        </div>
      </div>
    )
  }

  const explicitTemplate = `repeat(${columns}, minmax(0, 1fr))`

  return (
    <div ref={containerRef} className={clsx('w-full print:hidden', containerClassName)}>
      <div style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index] ?? []
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start - offset}px)`,
              }}
            >
              <div
                className="grid w-full"
                style={{ gridTemplateColumns: explicitTemplate, gap: gapPx, paddingBottom: gapPx }}
              >
                {row.map(renderItem)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
