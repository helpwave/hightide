import type { Key } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Row } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual'
import clsx from 'clsx'
import { useTableContainerContext, useTableStateWithoutSizingContext } from './TableContext'
import { PropsUtil } from '@/src/utils/propsUtil'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'

export type TableVirtualizationOptions = {
  /** Estimated row height in px, refined by measurement once rows mount. Default `48`. */
  estimateRowHeight?: number,
  /** Rows rendered above and below the viewport to avoid blank space while scrolling. Default `8`. */
  overscan?: number,
  /**
   * Which scroll context to track:
   * - `'window'` (default) windows against the page/document scroll. Use this when the list
   *   scrolls with the page (e.g. a document-scroll infinite list with a sentinel below the table).
   * - `'container'` windows against the table container's own scroll. The container
   *   (`data-name="table-container"`) needs a bounded height and `overflow-y: auto` for this.
   */
  scroll?: 'window' | 'container',
}

export type VirtualizedTableBodyProps = TableVirtualizationOptions

/**
 * Drop-in replacement for {@link TableBody} that only mounts the visible rows (plus a small
 * overscan) instead of the whole row model. Rows stay in normal table flow — a single spacer
 * `<tr>` above and below the window reserves the scroll height — so column sizing (driven by the
 * `<colgroup>`), the sticky header, resizing, sorting/filtering, selection and row clicks all keep
 * working unchanged. Per-row heights are measured, so variable-height rows are supported.
 *
 * Filler rows are intentionally ignored here: virtualization already reserves the full scroll
 * height, so `isUsingFillerRows` is a no-op while virtualized.
 */
export const VirtualizedTableBody = ({
  estimateRowHeight = 48,
  overscan = 8,
  scroll = 'window',
}: VirtualizedTableBodyProps) => {
  const { table, onRowClick } = useTableStateWithoutSizingContext<unknown>()
  const { containerRef } = useTableContainerContext<unknown>()
  const rows = table.getRowModel().rows

  const bodyRef = useRef<HTMLTableSectionElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [scrollMargin, setScrollMargin] = useState(0)

  useEffect(() => setIsMounted(true), [])

  // In window mode the virtualizer needs the body's offset from the top of the document so it can
  // map window scroll -> row positions. That offset only moves when layout above the table changes
  // (resize), not when rows are appended below, so we track it via a ResizeObserver/resize listener
  // and keep the dependency list narrow rather than recomputing on every row-count change.
  useEffect(() => {
    if (scroll !== 'window') return
    const element = bodyRef.current
    if (!element || typeof window === 'undefined') return
    const measure = () => {
      const next = element.getBoundingClientRect().top + window.scrollY
      setScrollMargin(prev => (Math.abs(prev - next) < 1 ? prev : next))
    }
    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(element)
    window.addEventListener('resize', measure)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [scroll])

  const common = {
    count: rows.length,
    estimateSize: () => estimateRowHeight,
    overscan,
    getItemKey: (index: number) => rows[index]?.id ?? index,
  }
  // Hooks must run unconditionally; we just pick which result to use based on `scroll`.
  const windowVirtualizer = useWindowVirtualizer({ ...common, scrollMargin })
  const containerVirtualizer = useVirtualizer({ ...common, getScrollElement: () => containerRef.current })
  const virtualizer = scroll === 'window' ? windowVirtualizer : containerVirtualizer
  const offset = scroll === 'window' ? scrollMargin : 0

  const renderRow = (row: Row<unknown>, key: Key, measured: boolean, dataIndex?: number) => (
    <tr
      key={key}
      data-index={dataIndex}
      ref={measured ? virtualizer.measureElement : undefined}
      onClick={() => onRowClick?.(row, table)}
      data-clickable={PropsUtil.dataAttributes.bool(!!onRowClick)}
      data-name="table-body-row"
      className={clsx(BagFunctionUtil.resolve(table.options.meta?.bodyRowClassName, row.original))}
    >
      {row.getVisibleCells().map(cell => (
        <td key={cell.id} data-name="table-body-cell" className={clsx(cell.column.columnDef.meta?.className)}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )

  // Before mount, render the rows in plain flow (no windowing). The window virtualizer produces an
  // empty range until it has measured the scroll position, so gating here avoids an SSR/hydration
  // mismatch. Consumers that fetch rows client-side render nothing here anyway.
  if (!isMounted) {
    return (
      <tbody ref={bodyRef}>
        {rows.map(row => renderRow(row, row.id, false))}
      </tbody>
    )
  }

  const items = virtualizer.getVirtualItems()
  const total = virtualizer.getTotalSize()
  const paddingTop = items.length ? items[0].start - offset : 0
  const paddingBottom = items.length ? total - (items[items.length - 1].end - offset) : 0
  const columnCount = Math.max(1, table.getVisibleLeafColumns().length)

  return (
    <tbody ref={bodyRef}>
      {paddingTop > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columnCount} style={{ height: paddingTop, padding: 0, border: 0 }}/>
        </tr>
      )}
      {items.map(virtualRow => {
        const row = rows[virtualRow.index]
        if (!row) return null
        return renderRow(row, virtualRow.key, true, virtualRow.index)
      })}
      {paddingBottom > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columnCount} style={{ height: paddingBottom, padding: 0, border: 0 }}/>
        </tr>
      )}
    </tbody>
  )
}
