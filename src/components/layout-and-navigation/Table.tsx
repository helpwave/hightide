import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Pagination } from './Pagination'
import clsx from 'clsx'
import type {
  ColumnDef,
  ColumnSizingInfoState,
  ColumnSizingState,
  InitialTableState,
  RowSelectionState,
  SortDirection,
  TableMeta,
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
import { resolveSetState } from '../../util/resolveSetState'
import { range } from '../../util/array'
import type { IconButtonProps } from '../user-action/Button'
import { IconButton } from '../user-action/Button'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useRerender } from '../../hooks/useRerender'
import { Checkbox } from '../user-action/Checkbox'
import { clamp } from '../../util/math'

interface CustomTableMeta<T> extends TableMeta<T> {
  columnClassNames?: Record<string, string>,
}

/*
 * SortButton
 */

export type SortButtonProps = IconButtonProps & {
  sortDirection: SortDirection | false,
  invert?: boolean,
}

/**
 * An Extension of the normal button that displays the sorting state right of the content
 */
export const SortButton = ({
                             sortDirection,
                             invert = false,
                             color = 'neutral',
                             className,
                             ...buttonProps
                           }: SortButtonProps) => {
  let icon = <ChevronsUpDown className="w-full h-full"/>
  if (sortDirection) {
    let usedSortDirection = sortDirection
    if (invert) {
      usedSortDirection = usedSortDirection === 'desc' ? 'asc' : 'desc'
    }
    icon = usedSortDirection === 'asc' ? (<ChevronUp className="w-full h-full"/>) : (
      <ChevronDown className="w-full h-full"/>)
  }

  return (
    <IconButton
      size="tiny"
      color={color}
      className={clsx(className)}
      {...buttonProps}
    >
      {icon}
    </IconButton>
  )
}

/*
 * FillerRowElement
 */

export type FillerRowElementProps = {
  className?: string,
}
export const FillerRowElement = ({
                                   className
                                 }: FillerRowElementProps) => {
  return (
    <div className={clsx('flex flex-row items-center w-1/2 h-4 text-disabled-text font-bold', className)}>
      -
    </div>
  )
}

/*
 * Table
 */

export type TableProps<T> = {
  data: T[],
  setData: Dispatch<SetStateAction<T[]>>,
  columns: ColumnDef<T>[],
  fillerRow?: (columnId: string, table: Table<T>) => ReactNode,
  initialState?: Omit<InitialTableState, 'columnSizing' | 'columnSizingInfo'>,
  allowResizing?: boolean,
  className?: string,
  state: Omit<TableState, 'columnSizing' | 'columnSizingInfo'>,
  tableClassName?: string,
} & Partial<TableOptions<T>>

/**
 * The standard table
 */
export const Table = <T, >({
                             setData,
                             fillerRow,
                             initialState,
                             allowResizing = false,
                             className,
                             tableClassName,
                             defaultColumn,
                             meta,
                             state,
                             columns,
                             ...tableOptions
                           }: TableProps<T>) => {
  const rerender = useRerender()
  const ref = useRef<HTMLDivElement>(null)

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(columns.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.id]: currentValue.minSize ?? defaultColumn.minSize,
    }
  }, {}))
  const [columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>()

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
  }, [columns, computedColumnMaxWidths, computedColumnMinWidths, tableMinWidth])

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: initialState,
    defaultColumn: {
      minSize: 60,
      maxSize: 700,
      ...defaultColumn,
    },
    columns,
    state: {
      columnSizing,
      columnSizingInfo,
      ...state
    },
    onColumnSizingInfoChange: setColumnSizingInfo,
    onColumnSizingChange: updaterOrValue => {
      setColumnSizing(previous => {
        const newSizing = typeof updaterOrValue === 'function' ? updaterOrValue(previous) : updaterOrValue
        return updateColumnSizes(newSizing)
      })
    },
    enableColumnResizing: allowResizing,
    columnResizeMode: 'onChange',
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          }))
      },
      ...meta,
    },
    ...tableOptions,
  })

  const [hasInitializedSizing, setHasInitializedSizing] = useState(false)
  useEffect(() => {
    if (!hasInitializedSizing && ref.current) {
      setHasInitializedSizing(true)
      setColumnSizing(updateColumnSizes(columnSizing))
    }
  }, [columnSizing, hasInitializedSizing])

  useEffect(() => {
    window.addEventListener('resize', rerender)

    return () => {
      window.removeEventListener('resize', rerender)
    }
  }, [])

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }

    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing])

  return (
    <div ref={ref} className={clsx('col gap-y-4', className)}>
      <Scrollbars autoHeight={true} autoHide={true}>
        <table
          className={clsx(
            'table-fixed border-collapse mb-1',
            tableClassName
          )}
          style={{
            ...columnSizeVars,
            width: Math.max(table.getTotalSize(), ref.current?.offsetWidth ?? table.getTotalSize()),
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
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx('relative group', (table.options.meta as CustomTableMeta<T>)?.columnClassNames?.[header.id])}
                  >
                    <div className="row w-full">
                      {header.isPlaceholder ? null : (
                        <div className="row gap-x-1 items-center mb-2 pb-2 border-b-2 w-full">
                          {header.column.getCanSort() && (
                            <SortButton
                              sortDirection={header.column.getIsSorted()}
                              onClick={() => header.column.toggleSorting()}
                            />
                          )}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanFilter() ? (
                            <div>
                              Filter
                              { /* <Filter column={header.column} table={table}/> */}
                            </div>
                          ) : null}
                        </div>
                      )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onDoubleClick={() => header.column.resetSize()}
                          className="absolute top-0 bottom-4 right-1 w-2 rounded bg-primary cursor-col-resize select-none touch-none opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
          </thead>
          <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id} className="not-last:pr-2 py-1">
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
          {range(0, table.getState().pagination.pageSize - table.getRowModel().rows.length - 1, true).map((row, index) => {
            return (
              <tr key={'filler-' + index}>
                {columns.map((column) => {
                  return (
                    <td key={column.id} className="not-last:pr-2 py-1">
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
      <div className="row justify-center">
        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          onPageChanged={page => table.setPageIndex(page)}
        />
      </div>
    </div>
  )
}

export type FilterButtonProps = {}

export const FilterButton = ({})


export type TableUncontrolledProps<T> = Omit<TableProps<T>, 'setDate'> & {
  onChange: (value: T[]) => void,
}

export const TableUncontrolled = <T, >({ data, onChange, ...props }: TableUncontrolledProps<T>) => {
  const [usedDate, setUsedData] = useState<T[]>(data)

  useEffect(() => {
    setUsedData(data)
  }, [data])

  return (
    <Table
      {...props}
      data={usedDate}
      setData={value => {
        setUsedData(value)
        onChange(resolveSetState(value, usedDate))
      }}
    />
  )
}


export type TableWithSelectionProps<T> = TableProps<T> & {
  rowSelection: RowSelectionState,
  selectionRowId?: string,
}

export const TableWithSelection = <T, >({
                                          columns,
                                          state,
                                          fillerRow,
                                          rowSelection,
                                          meta,
                                          selectionRowId = 'selection',
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
        size: 40,
        minSize: 40,
        maxSize: 40,
        enableResizing: false,
        enableSorting: false,
      },
      ...columns,
    ]
  }, [columns])

  return (
    <Table
      columns={columnsWithSelection}
      fillerRow={(columnId, table) => {
        if(columnId === selectionRowId) {
          return (<Checkbox checked={false} disabled={true} containerClassName="max-w-6"/>)
        }
        return fillerRow ? fillerRow(columnId, table) : (<FillerRowElement/>)
      }}
      state={{
        rowSelection,
        ...state
      }}
      meta={{
        columnClassNames: {
          selection: 'overflow-hidden',
        },
        ...meta,
      }}
      {...props}
    />
  )
}