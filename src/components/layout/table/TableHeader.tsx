import { PropsUtil } from '@/src/utils/propsUtil'
import { flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { Visibility } from '../Visibility'
import { TableSortButton } from './TableSortButton'
import { TableFilterButton } from './TableFilterButton'
import { useCallback, useEffect } from 'react'
import type { TableFilterCategory } from './TableFilter'
import { isTableFilterCategory } from './TableFilter'
import { TableStateContext, useTableStateWithoutSizingContext } from './TableContext'

export type TableHeaderProps = {
  isSticky?: boolean,
}

export const TableHeader = ({ isSticky = false }: TableHeaderProps) => {
  const { table } = useTableStateWithoutSizingContext<unknown>()

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
          {({ sizeVars }) => (
            <colgroup style={sizeVars}>
              {headerGroup.headers.map(header => (
                <col
                  key={header.id}
                  style={{
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
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id} className={clsx('table-header-row', table.options.meta?.headerRowClassName)}>
            {headerGroup.headers.map(header => {
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}


                  data-sticky={isSticky ? '' : undefined}
                  className={clsx('table-header-cell group/table-header-cell', header.column.columnDef.meta?.className)}
                >
                  <Visibility isVisible={!header.isPlaceholder}>
                    <div className="flex-row-1 items-center">
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
                      <Visibility isVisible={header.column.getCanFilter() && isTableFilterCategory(header.column.columnDef.filterFn)}>
                        <TableFilterButton
                          column={header.column}
                          filterType={header.column.columnDef.filterFn as TableFilterCategory}
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
                        const startX = 'touches' in e ? e.touches[0].clientX : e.clientX
                        table.setColumnSizingInfo({
                          columnSizingStart: Object.entries(table.getState().columnSizing),
                          startOffset: startX,
                          startSize: table.getState().columnSizing[header.column.id] ?? 0,
                          deltaOffset: 0,
                          deltaPercentage: null,
                          isResizingColumn: header.column.id,
                        })
                      }}

                      onDoubleClick={() => {
                        header.column.resetSize()
                      }}

                      className="table-resize-indicator"
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