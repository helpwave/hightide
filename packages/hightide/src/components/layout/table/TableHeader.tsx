import { PropsUtil } from '@/src/utils/propsUtil'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { Visibility } from '../Visibility'
import { TableSortButton } from './TableSortButton'
import { TableFilterButton } from './TableFilterButton'
import { useCallback, useEffect, useRef } from 'react'
import { TableStateContext, useTableStateWithoutSizingContext } from './TableContext'
import { DataTypeUtils, type DataType } from '../../user-interaction/data/data-types'

export type TableHeaderProps = {
  isSticky?: boolean,
}

export const TableHeader = ({ isSticky = false }: TableHeaderProps) => {
  const { table, columnSizingMode } = useTableStateWithoutSizingContext<unknown>()
  const isNaturalSizing = columnSizingMode === 'natural'
  const resizeFrameRef = useRef<number | null>(null)
  const resizePointerXRef = useRef(0)

  const minColumnWidth = useCallback((columnId: string): number => {
    const column = table.getColumn(columnId)
    return column?.columnDef.minSize ?? table.options.defaultColumn?.minSize ?? 20
  }, [table])

  const applyResize = useCallback(() => {
    const info = table.getState().columnSizingInfo
    const columnId = info.isResizingColumn
    if (!columnId) return
    const deltaOffset = resizePointerXRef.current - (info.startOffset ?? 0)
    const newWidth = Math.max(minColumnWidth(columnId), (info.startSize ?? 0) + deltaOffset)
    table.setColumnSizing(prev => (prev[columnId] === newWidth ? prev : { ...prev, [columnId]: newWidth }))
    table.setColumnSizingInfo(prev => ({ ...prev, deltaOffset }))
  }, [table, minColumnWidth])

  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!table.getState().columnSizingInfo.isResizingColumn) return
    resizePointerXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX
    if (resizeFrameRef.current !== null) return
    resizeFrameRef.current = window.requestAnimationFrame(() => {
      resizeFrameRef.current = null
      applyResize()
    })
  }, [table, applyResize])

  const handleResizeEnd = useCallback((e: PointerEvent) => {
    if (!table.getState().columnSizingInfo.isResizingColumn) return
    if (typeof e.clientX === 'number' && e.clientX !== 0) {
      resizePointerXRef.current = e.clientX
    }
    if (resizeFrameRef.current !== null) {
      window.cancelAnimationFrame(resizeFrameRef.current)
      resizeFrameRef.current = null
    }
    applyResize()
    table.setColumnSizingInfo({
      columnSizingStart: [],
      deltaOffset: null,
      deltaPercentage: null,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
    })
  }, [table, applyResize])

  useEffect(() => {
    window.addEventListener('pointermove', handleResizeMove)
    window.addEventListener('pointerup', handleResizeEnd)
    return () => {
      window.removeEventListener('pointermove', handleResizeMove)
      window.removeEventListener('pointerup', handleResizeEnd)
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current)
        resizeFrameRef.current = null
      }
    }
  }, [handleResizeEnd, handleResizeMove, table])

  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableStateContext.Consumer key={headerGroup.id}>
          {(tableStateContext) => (
            <colgroup style={tableStateContext?.sizeVars}>
              {headerGroup.headers.map(header => (
                <col
                  key={header.id}
                  style={isNaturalSizing
                    ? (tableStateContext?.columnSizing?.[header.id] !== undefined
                      ? { width: `calc(var(--header-${header?.id}-size) * 1px)` }
                      : undefined)
                    : {
                      width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                />
              ))}
            </colgroup>
          )}
        </TableStateContext.Consumer>
      ))}
      <thead data-name="table-header">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id} data-name="table-header-row" className={clsx(table.options.meta?.headerRowClassName)}>
            {headerGroup.headers.map(header => {
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}


                  data-sticky={isSticky ? '' : undefined}
                  data-name="table-header-cell"
                  className={clsx('group/table-header-cell', header.column.columnDef.meta?.className)}
                  style={isNaturalSizing ? { minWidth: header.column.columnDef.minSize } : undefined}
                >
                  <Visibility isVisible={!header.isPlaceholder}>
                    <div className="table-header-cell-content">
                      <Visibility isVisible={header.column.getCanSort()}>
                        <TableSortButton
                          sortDirection={header.column.getIsSorted()}
                          sortingIndexDisplay={{
                            index: header.column.getIsSorted() ? (header.column.getSortIndex() + 1) : -1,
                            sortingsCount: table.getState().sorting.length,
                          }}
                          onClick={() => {
                            const sorted = header.column.getIsSorted()
                            const isMulti = header.column.getCanMultiSort()
                            if (!isMulti) {
                              table.resetSorting()
                            }
                            if (!sorted) {
                              header.column.toggleSorting(true, isMulti)
                              return
                            } else if (sorted === 'desc') {
                              header.column.toggleSorting(false, isMulti)
                            }
                            if (sorted === 'asc') {
                              header.column.clearSorting()
                            }
                          }}
                        />
                      </Visibility>
                      <Visibility isVisible={header.column.getCanFilter() && DataTypeUtils.types.includes(header.column.columnDef.filterFn as DataType)}>
                        <TableFilterButton
                          header={header}
                          filterType={header.column.columnDef.filterFn as DataType}
                        />
                      </Visibility>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </Visibility>
                  <Visibility isVisible={header.column.getCanResize()}>
                    <div
                      onPointerDown={(e) => {
                        e.preventDefault()
                        e.currentTarget.setPointerCapture(e.pointerId)
                        window.getSelection()?.removeAllRanges()
                        const startX = e.clientX
                        resizePointerXRef.current = startX
                        const renderedWidth = (e.currentTarget as HTMLElement).closest('th')?.getBoundingClientRect().width
                        table.setColumnSizingInfo({
                          columnSizingStart: Object.entries(table.getState().columnSizing),
                          startOffset: startX,
                          startSize: table.getState().columnSizing[header.column.id]
                            ?? (renderedWidth !== undefined ? Math.round(renderedWidth) : header.getSize()),
                          deltaOffset: 0,
                          deltaPercentage: null,
                          isResizingColumn: header.column.id,
                        })
                      }}

                      onDoubleClick={() => {
                        header.column.resetSize()
                      }}

                      data-name="table-resize-indicator"
                      data-active={PropsUtil.dataAttributes.bool(header.column.getCanResize() && header.column?.getIsResizing())}
                      data-disabled={PropsUtil.dataAttributes.bool(!header.column.getCanResize())}
                    />
                  </Visibility>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
    </>
  )
}
