import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pagination } from '../layout-and-navigation/Pagination'
import clsx from 'clsx'
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnSizingInfoState,
  ColumnSizingState,
  FilterFn,
  InitialTableState,
  PaginationState,
  Row,
  RowData,
  RowSelectionState,
  Table as ReactTable,
  TableOptions,
  TableState
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { range } from '../../util/array'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Checkbox } from '../user-action/Checkbox'
import { clamp } from '../../util/math'
import { noop } from '../../util/noop'
import type { TableFilterType } from './TableFilterButton'
import { TableFilterButton } from './TableFilterButton'
import { TableSortButton } from './TableSortButton'
import { FillerRowElement } from './FillerRowElement'
import { TableFilters } from './Filter'
import { useResizeCallbackWrapper } from '../../hooks/useResizeCallbackWrapper'
import { TableCell } from './TableCell'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string,
    filterType?: TableFilterType,
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    headerRowClassName?: TableFilterType,
    bodyRowClassName?: string,
  }


  interface FilterFns {
    dateRange: FilterFn<unknown>,
  }
}

export type TableProps<T> = {
  data: T[],
  columns: ColumnDef<T>[],
  fillerRow?: (columnId: string, table: ReactTable<T>) => ReactNode,
  initialState?: Omit<InitialTableState, 'columnSizing' | 'columnSizingInfo'>,
  className?: string,
  onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
  state?: Omit<TableState, 'columnSizing' | 'columnSizingInfo'>,
  tableClassName?: string,
} & Partial<TableOptions<T>>

/**
 * The standard table
 */
export const Table = <T, >({
                             data,
                             fillerRow,
                             initialState,
                             onRowClick = noop,
                             className,
                             tableClassName,
                             defaultColumn,
                             state,
                             columns,
                             ...tableOptions
                           }: TableProps<T>) => {
  const ref = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(columns.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.id]: currentValue.minSize ?? defaultColumn.minSize,
    }
  }, {}))
  const [columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
    ...initialState?.pagination
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState?.columnFilters)

  const computedColumnMinWidths = useMemo(() => {
    return columns.reduce((previousValue, column) => {
      return {
        ...previousValue,
        // every column is at least 12px wide
        [column.id]: (column.minSize ?? defaultColumn?.minSize ?? 12)
      }
    }, {})
  }, [columns, defaultColumn])

  const computedColumnMaxWidths = useMemo(() => {
    return columns.reduce((previousValue, column) => {
      return {
        ...previousValue,
        [column.id]: (column.maxSize ?? defaultColumn?.maxSize)
      }
    }, {})
  }, [columns, defaultColumn])

  const tableMinWidth = useMemo(() => {
    return columns.reduce((sum, column) => {
      return sum + computedColumnMinWidths[column.id]
    }, 0)
  }, [columns, computedColumnMinWidths])

  const updateColumnSizes = useMemo(() => {
    return (previous: ColumnSizingState) => {
      const updateSizing = {
        ...columnSizing,
        ...previous
      }

      const containerWidth = ref.current.offsetWidth

      // enforce min and max constraints
      columns.forEach((column) => {
        updateSizing[column.id] = clamp(updateSizing[column.id], computedColumnMinWidths[column.id], computedColumnMaxWidths[column.id] ?? containerWidth)
      })

      // table width of the current sizing
      const width = columns
        .reduce((previousValue, currentValue) => previousValue + updateSizing[currentValue.id], 0)

      if (width > containerWidth) {
        if (tableMinWidth >= containerWidth) {
          return columns.reduce((previousValue, currentValue) => ({
            ...previousValue,
            [currentValue.id]: computedColumnMinWidths[currentValue.id]
          }), {})
        }

        let reduceableColumns = columns
          .map(value => value.id)
          .filter(id => updateSizing[id] - computedColumnMinWidths[id] > 0)

        let spaceToReduce = width - containerWidth

        while (spaceToReduce > 0 && reduceableColumns.length > 0) {
          let maxReduceAmount = reduceableColumns.reduce((previousValue, id) => Math.max(previousValue, updateSizing[id] - computedColumnMinWidths[id]), 0)
          if (maxReduceAmount * reduceableColumns.length > spaceToReduce) {
            maxReduceAmount = spaceToReduce / reduceableColumns.length
          }

          reduceableColumns.forEach(id => {
            updateSizing[id] -= maxReduceAmount
          })

          spaceToReduce -= maxReduceAmount * reduceableColumns.length
          reduceableColumns = reduceableColumns.filter(id => updateSizing[id] - computedColumnMinWidths[id] > 0)
        }
      } else if (width <= containerWidth) {
        let distributableWidth = containerWidth - width

        // check max width violations
        const violatingColumns = columns.filter(value =>
          computedColumnMaxWidths[value.id] && (updateSizing[value.id] > computedColumnMaxWidths[value.id]))

        const violationColumnsAmount = violatingColumns.reduce(
          (previousValue, column) => previousValue + updateSizing[column.id] - computedColumnMaxWidths[column.id], 0
        )
        distributableWidth += violationColumnsAmount

        let enlargeableColumns = columns
          .filter(col => !computedColumnMaxWidths[col.id] || updateSizing[col.id] < computedColumnMaxWidths[col.id])
          .map(value => value.id)

        while (distributableWidth > 0 && enlargeableColumns.length > 0) {
          let minEnlargeableAmount = enlargeableColumns.reduce((previousValue, id) => Math.min(previousValue, computedColumnMaxWidths[id] ? computedColumnMaxWidths[id] - updateSizing[id] : distributableWidth), distributableWidth)
          if (minEnlargeableAmount * enlargeableColumns.length > distributableWidth) {
            minEnlargeableAmount = distributableWidth / enlargeableColumns.length
          }

          enlargeableColumns.forEach(id => {
            updateSizing[id] += minEnlargeableAmount
          })

          distributableWidth -= minEnlargeableAmount * enlargeableColumns.length
          enlargeableColumns = enlargeableColumns.filter(id => !computedColumnMaxWidths[id] || updateSizing[id] < computedColumnMaxWidths[id])
        }

        if (distributableWidth > 0) {
          updateSizing[columns[columns.length - 1].id] += distributableWidth
        }
      }
      return updateSizing
    }
  }, [columns, computedColumnMaxWidths, computedColumnMinWidths, tableMinWidth]) // eslint-disable-line react-hooks/exhaustive-deps

  const table = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: initialState,
    defaultColumn: {
      minSize: 60,
      maxSize: 700,
      cell: ({ cell }) => {
        return (<TableCell>{cell.getValue() as string}</TableCell>)
      },
      ...defaultColumn,
    },
    columns,
    state: {
      columnSizing,
      columnSizingInfo,
      pagination,
      columnFilters,
      ...state
    },
    filterFns: {
      ...tableOptions?.filterFns,
      dateRange: TableFilters.dateRange,
    },
    onColumnSizingInfoChange: updaterOrValue => {
      setColumnSizingInfo(updaterOrValue)
      if (tableOptions.onColumnSizingInfoChange) {
        tableOptions?.onColumnSizingInfoChange(updaterOrValue)
      }
    },
    onColumnSizingChange: updaterOrValue => {
      setColumnSizing(previous => {
        const newSizing = typeof updaterOrValue === 'function' ? updaterOrValue(previous) : updaterOrValue
        return updateColumnSizes(newSizing)
      })
      if (tableOptions.onColumnSizingChange) {
        tableOptions.onColumnSizingChange(updaterOrValue)
      }
    },
    onPaginationChange: updaterOrValue => {
      setPagination(updaterOrValue)
      if (tableOptions.onPaginationChange) {
        tableOptions.onPaginationChange(updaterOrValue)
      }
    },
    onColumnFiltersChange: updaterOrValue => {
      setColumnFilters(updaterOrValue)
      table.toggleAllRowsSelected(false)
      if (tableOptions.onColumnFiltersChange) {
        tableOptions.onColumnFiltersChange(updaterOrValue)
      }
    },
    autoResetPageIndex: false,
    columnResizeMode: 'onChange',
    ...tableOptions,
  })

  const [hasInitializedSizing, setHasInitializedSizing] = useState(false)
  useEffect(() => {
    if (!hasInitializedSizing && ref.current) {
      setHasInitializedSizing(true)
      table.setColumnSizing(updateColumnSizes(columnSizing))
    }
  }, [columnSizing, hasInitializedSizing]) // eslint-disable-line react-hooks/exhaustive-deps

  useResizeCallbackWrapper(useCallback(() => {
    table.setColumnSizing(updateColumnSizes)
  }, [updateColumnSizes])) // eslint-disable-line react-hooks/exhaustive-deps

  const pageCount = table.getPageCount()
  useEffect(() => {
    const totalPages = pageCount
    if (totalPages === 0) {
      if (pagination.pageIndex !== 0) {
        table.setPagination(prevState => ({
          ...prevState,
          pageIndex: 0,
        }))
      }
    } else if (pagination.pageIndex >= totalPages) {
      table.setPagination((prev) => ({
        ...prev,
        pageIndex: totalPages - 1,
      }))
    }
  }, [data, pageCount, pagination.pageSize, pagination.pageIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = Math.floor(header.getSize())
      colSizes[`--col-${header.column.id}-size`] = Math.floor(header.column.getSize())
    }

    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className={clsx('flex-col-4', className)}>
      <Scrollbars
        autoHeight={true}
        autoHeightMax={tableRef.current?.offsetHeight ? (tableRef.current?.offsetHeight + 2) : undefined}
        autoHide={true}
      >
        <table
          ref={tableRef}
          className={clsx(tableClassName)}
          style={{
            ...columnSizeVars,
            width: Math.floor(Math.max(table.getTotalSize() - columns.length, ref.current?.offsetWidth ?? table.getTotalSize())),
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <colgroup key={headerGroup.id}>
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
          ))}
          <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className={table.options.meta?.headerRowClassName}>
              {headerGroup.headers.map(header => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx('relative group', header.column.columnDef.meta?.className)}
                  >
                    <div className="flex-row-2 w-full">
                      {header.isPlaceholder ? null : (
                        <div className="flex-row-1 items-center">
                          {header.column.getCanSort() && (
                            <TableSortButton
                              sortDirection={header.column.getIsSorted()}
                              onClick={() => header.column.toggleSorting()}
                            />
                          )}
                          {header.column.getCanFilter() && header.column.columnDef.meta?.filterType ? (
                            <TableFilterButton
                              column={header.column}
                              filterType={header.column.columnDef.meta.filterType}
                            />
                          ) : null}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </div>
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => {
                          header.column.resetSize()
                        }}
                        className="table-resize-indicator w-2 rounded bg-primary cursor-col-resize select-none touch-none opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          opacity: !columnSizingInfo?.columnSizingStart ?
                            undefined : (columnSizingInfo?.columnSizingStart?.findIndex(([id, _]) => id === header.column.id) !== -1 ?
                              1 : (columnSizingInfo?.columnSizingStart?.length !== 0 ?
                                0 : undefined)),
                        }}
                      />
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id} onClick={() => onRowClick(row, table)} className={table.options.meta?.bodyRowClassName}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
          {range(table.getState().pagination.pageSize - table.getRowModel().rows.length, { allowEmptyRange: true }).map((row, index) => {
            return (
              <tr key={'filler-row-' + index}>
                {columns.map((column) => {
                  return (
                    <td key={column.id}>
                      {fillerRow ? fillerRow(column.id, table) : (<FillerRowElement/>)}
                    </td>
                  )
                })}
              </tr>
            )
          })}
          </tbody>
        </table>
      </Scrollbars>
      <div className="flex-row-2 justify-center">
        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          onPageChanged={page => table.setPageIndex(page)}
        />
      </div>
    </div>
  )
}


export type TableUncontrolledProps<T> = TableProps<T>

export const TableUncontrolled = <T, >({ data, ...props }: TableUncontrolledProps<T>) => {
  const [usedDate, setUsedData] = useState<T[]>(data)

  useEffect(() => {
    setUsedData(data)
  }, [data])

  return (
    <Table
      {...props}
      data={usedDate}
    />
  )
}


export type TableWithSelectionProps<T> = TableProps<T> & {
  rowSelection: RowSelectionState,
  disableClickRowClickSelection?: boolean,
  selectionRowId?: string,
}

export const TableWithSelection = <T, >({
                                          columns,
                                          state,
                                          fillerRow,
                                          rowSelection,
                                          disableClickRowClickSelection = false,
                                          selectionRowId = 'selection',
                                          onRowClick = noop,
                                          meta,
                                          ...props
                                        }: TableWithSelectionProps<T>) => {
  const columnsWithSelection = useMemo<ColumnDef<T>[]>(() => {
    return [
      {
        id: selectionRowId,
        header: ({ table }) => {
          return (
            <Checkbox
              checked={table.getIsSomeRowsSelected() ? 'indeterminate' : table.getIsAllRowsSelected()}
              onChangeTristate={value => {
                const newValue = !!value
                table.toggleAllRowsSelected(newValue)
              }}
              containerClassName="max-w-6"
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              disabled={!row.getCanSelect()}
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              containerClassName="max-w-6"
            />
          )
        },
        size: 60,
        minSize: 60,
        maxSize: 60,
        enableResizing: false,
        enableSorting: false,
      },
      ...columns,
    ]
  }, [columns, selectionRowId])

  return (
    <Table
      columns={columnsWithSelection}
      fillerRow={(columnId, table) => {
        if (columnId === selectionRowId) {
          return (<Checkbox checked={false} disabled={true} containerClassName="max-w-6"/>)
        }
        return fillerRow ? fillerRow(columnId, table) : (<FillerRowElement/>)
      }}
      state={{
        rowSelection,
        ...state
      }}
      onRowClick={(row, table) => {
        if (!disableClickRowClickSelection) {
          row.toggleSelected()
        }
        onRowClick(row, table)
      }}
      meta={{
        ...meta,
        bodyRowClassName: clsx(
          { 'cursor-pointer': !disableClickRowClickSelection },
          meta?.bodyRowClassName
        )
      }}
      {...props}
    />
  )
}