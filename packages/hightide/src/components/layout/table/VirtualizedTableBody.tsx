import { memo, useRef } from 'react'
import type { Cell, Row, Table } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { useTableContainerContext, useTableStateWithoutSizingContext } from './TableContext'
import { PropsUtil } from '@/src/utils/propsUtil'
import { BagFunctionUtil } from '@helpwave/hightide-utils'
import { range } from '@helpwave/hightide-utils'
import { FillerCell } from './FillerCell'
import { useVirtualizedRows } from '../virtualization/useVirtualizedRows'
import type { VirtualizationScroll } from '../virtualization/virtualizationScroll'

export type TableVirtualizationOptions = {
  estimateRowHeight?: number,
  overscan?: number,
  scroll?: VirtualizationScroll,
  /** Called for infinite scroll while nearing the bottom of the scroll region. */
  onReachBottom?: () => void,
  reachBottomThresholdPx?: number,
}

export type VirtualizedTableBodyProps = TableVirtualizationOptions

type VirtualizedTableRowProps = {
  row: Row<unknown>,
  cells: Cell<unknown, unknown>[],
  table: Table<unknown>,
  dataIndex?: number,
  measureRef?: (node: Element | null) => void,
  onRowClick?: (row: Row<unknown>, table: Table<unknown>) => void,
  className?: string,
}

const VirtualizedTableRow = memo(({
  row,
  cells,
  table,
  dataIndex,
  measureRef,
  onRowClick,
  className,
}: VirtualizedTableRowProps) => (
  <tr
    data-index={dataIndex}
    ref={measureRef}
    onClick={onRowClick ? () => onRowClick(row, table) : undefined}
    data-clickable={PropsUtil.dataAttributes.bool(!!onRowClick)}
    data-name="table-body-row"
    className={className}
  >
    {cells.map(cell => (
      <td key={cell.id} data-name="table-body-cell" className={clsx(cell.column.columnDef.meta?.className)}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
))
VirtualizedTableRow.displayName = 'VirtualizedTableRow'

export const VirtualizedTableBody = ({
  estimateRowHeight = 48,
  overscan = 8,
  scroll = 'window',
  onReachBottom,
  reachBottomThresholdPx,
}: VirtualizedTableBodyProps) => {
  const { table, onRowClick, isUsingFillerRows, fillerRowCell } = useTableStateWithoutSizingContext<unknown>()
  const { containerRef } = useTableContainerContext<unknown>()
  const rows = table.getRowModel().rows

  const bodyRef = useRef<HTMLTableSectionElement | null>(null)

  const { virtualizer, offset, isMounted } = useVirtualizedRows({
    scroll,
    count: rows.length,
    estimateRowHeight,
    overscan,
    getItemKey: (index: number) => rows[index]?.id ?? index,
    contentRef: bodyRef,
    containerRef,
    onReachBottom,
    reachBottomThresholdPx,
  })

  const bodyRowClassName = table.options.meta?.bodyRowClassName
  const renderRow = (row: Row<unknown>, measured: boolean, dataIndex?: number) => (
    <VirtualizedTableRow
      key={row.id}
      row={row}
      cells={row.getVisibleCells()}
      table={table}
      dataIndex={dataIndex}
      measureRef={measured ? virtualizer.measureElement : undefined}
      onRowClick={onRowClick}
      className={bodyRowClassName !== undefined ? clsx(BagFunctionUtil.resolve(bodyRowClassName, row.original)) : undefined}
    />
  )

  const columnCount = Math.max(1, table.getVisibleLeafColumns().length)
  const rowCount = containerRef.current && isUsingFillerRows
    ? Math.max(1, Math.floor(containerRef.current.clientHeight / estimateRowHeight))
    : 1

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
        {rows.map(row => renderRow(row, false))}
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
        return renderRow(row, true, virtualRow.index)
      })}
      {paddingBottom > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columnCount} style={{ height: paddingBottom, padding: 0, border: 0 }}/>
        </tr>
      )}
    </tbody>
  )
}
