import type { Key } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Row } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual'
import clsx from 'clsx'
import { useTableContainerContext, useTableStateWithoutSizingContext } from './TableContext'
import { PropsUtil } from '@/src/utils/propsUtil'
import { BagFunctionUtil } from '@/src/utils/bagFunctions'
import { range } from '@/src/utils/array'
import { FillerCell } from './FillerCell'

export type TableVirtualizationOptions = {
  estimateRowHeight?: number,
  overscan?: number,
  scroll?: 'window' | 'container',
}

export type VirtualizedTableBodyProps = TableVirtualizationOptions

export const VirtualizedTableBody = ({
  estimateRowHeight = 48,
  overscan = 8,
  scroll = 'window',
}: VirtualizedTableBodyProps) => {
  const { table, onRowClick, isUsingFillerRows, fillerRowCell } = useTableStateWithoutSizingContext<unknown>()
  const { containerRef } = useTableContainerContext<unknown>()
  const rows = table.getRowModel().rows

  const bodyRef = useRef<HTMLTableSectionElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [scrollMargin, setScrollMargin] = useState(0)

  useEffect(() => setIsMounted(true), [])

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

  const columnCount = Math.max(1, table.getVisibleLeafColumns().length)
  const rowCount = containerRef.current && isUsingFillerRows ?
    Math.floor(containerRef.current.clientHeight) / estimateRowHeight : 1

  if (rows.length === 0) {
    return (
      <tbody ref={bodyRef}>
        {range(rowCount).map((_, index) => (
          <tr key={index} data-name="table-body-filler-row">
            {table.getVisibleLeafColumns().map((col, colIndex) => (
              <td key={colIndex} data-name="table-body-filler-cell">
                {fillerRowCell(col.id, table) ?? <FillerCell/>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }

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
