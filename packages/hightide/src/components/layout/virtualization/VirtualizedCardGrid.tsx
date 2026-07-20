import type { CSSProperties, ReactNode } from 'react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
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

const emptyRow: readonly unknown[] = []

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

type VirtualizedCardGridRowProps<T> = {
  index: number,
  translateY: number,
  measureElement: (node: Element | null) => void,
  rowStyle: CSSProperties,
  items: readonly T[],
  renderItem: (item: T) => ReactNode,
}

function VirtualizedCardGridRowBase<T>({
  index,
  translateY,
  measureElement,
  rowStyle,
  items,
  renderItem,
}: VirtualizedCardGridRowProps<T>) {
  return (
    <div
      data-index={index}
      ref={measureElement}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div className="grid w-full" style={rowStyle}>
        {items.map(renderItem)}
      </div>
    </div>
  )
}

const VirtualizedCardGridRow = memo(VirtualizedCardGridRowBase) as typeof VirtualizedCardGridRowBase

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
  const virtualizedRowStyle = useMemo((): CSSProperties => ({
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: gapPx,
    paddingBottom: gapPx,
  }), [columns, gapPx])
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

  return (
    <div ref={containerRef} className={clsx('w-full print:hidden', containerClassName)}>
      <div style={{ height: virtualizer.getTotalSize(), width: '100%', position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <VirtualizedCardGridRow
            key={virtualRow.key}
            index={virtualRow.index}
            translateY={virtualRow.start - offset}
            measureElement={virtualizer.measureElement}
            rowStyle={virtualizedRowStyle}
            items={(rows[virtualRow.index] ?? emptyRow) as readonly T[]}
            renderItem={renderItem}
          />
        ))}
      </div>
    </div>
  )
}
