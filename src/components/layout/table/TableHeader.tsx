import { PropsUtil } from '@/src/utils/propsUtil'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { Visibility } from '../Visibility'
import { TableSortButton } from './TableSortButton'
import { TableFilterButton } from './TableFilterButton'
import { useCallback, useEffect } from 'react'
import { TableStateContext, useTableStateWithoutSizingContext } from './TableContext'
import { DataTypeUtils, type DataType } from '../../user-interaction/data/data-types'

export type TableHeaderProps = {
  isSticky?: boolean,
}

export const TableHeader = ({ isSticky = false }: TableHeaderProps) => {
  const { table, columnSizingMode } = useTableStateWithoutSizingContext<unknown>()
  const isNaturalSizing = columnSizingMode === 'natural'

  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!table.getState().columnSizingInfo.isResizingColumn) return
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const deltaOffset = currentX - (table.getState().columnSizingInfo.startOffset ?? 0)

    const newWidth = (table.getState().columnSizingInfo.startSize ?? 0) + (table.getState().columnSizingInfo.deltaOffset ?? 0)

    table.setColumnSizing(prev => {
      return {
        ...prev,
        [table.getState().columnSizingInfo.isResizingColumn as string]: newWidth,
      }
    })
    table.setColumnSizingInfo((prev) => ({
      ...prev,
      deltaOffset,
    }))
  }, [table])

  const handleResizeEnd = useCallback(() => {
    if (!table.getState().columnSizingInfo.isResizingColumn) return
    const newWidth = (table.getState().columnSizingInfo.startSize ?? 0) + (table.getState().columnSizingInfo.deltaOffset ?? 0)

    table.setColumnSizing(prev => {
      return {
        ...prev,
        [table.getState().columnSizingInfo.isResizingColumn as string]: newWidth,
      }
    })
    table.setColumnSizingInfo({
      columnSizingStart: [],
      deltaOffset: null,
      deltaPercentage: null,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
    })
  }, [table])

  useEffect(() => {
    window.addEventListener('pointermove', handleResizeMove)
    window.addEventListener('pointerup', handleResizeEnd)
    return () => {
      window.removeEventListener('pointermove', handleResizeMove)
      window.removeEventListener('pointerup', handleResizeEnd)
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
                        const startX = e.clientX
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
