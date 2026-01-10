import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnSizingInfoState,
  ColumnSizingState,
  FilterFn,
  InitialTableState,
  Row,
  RowData,
  RowSelectionState,
  Table as ReactTable,
  TableOptions,
  TableState
} from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { TableCell } from '@/src/components/layout/table/TableCell'
import { TableFilter } from '@/src/components/layout/table/TableFilter'
import type { TableFilterType } from '@/src/components/layout/table/TableFilterButton'
import { FillerCell } from '@/src/components/layout/table/FillerCell'
import { Checkbox } from '@/src/components/user-interaction/Checkbox'
import { type BagFunctionOrValue } from '@/src/utils/bagFunctions'
import { PropsUtil } from '@/src/utils/propsUtil'
import { TableBody } from './TableBody'
import { ColumnSizeUtil } from './columnSizeUtil'
import { useResizeCallbackWrapper } from '@/src/hooks/useResizeCallbackWrapper'
import { TableHeader } from './TableHeader'
import { TableContext } from './TableContext'
import { TablePageSizeController, TablePagination } from './TablePagination'
import { TableColumn } from './TableColumn'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string,
    filterType?: TableFilterType,
  }

  interface TableMeta<TData> {
    headerRowClassName?: string,
    bodyRowClassName?: BagFunctionOrValue<TData, string>,
  }


  interface FilterFns {
    dateRange: FilterFn<unknown>,
  }
}

export type TableProps<T> = {
  data: T[],
  columns?: ColumnDef<T>[],
  children?: ReactNode,
  fillerRow?: (columnId: string, table: ReactTable<T>) => ReactNode,
  initialState?: Omit<InitialTableState, 'columnSizing' | 'columnSizingInfo'>,
  containerClassName?: string,
  onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
  state?: Omit<TableState, 'columnSizing' | 'columnSizingInfo'>,
  tableClassName?: string,
} & Partial<TableOptions<T>>


/**
 * The standard table
 */
export const Table = <T,>({
  data,
  fillerRow,
  initialState,
  onRowClick,
  tableClassName,
  containerClassName: tableContainerClassName,
  defaultColumn: defaultColumnOverwrite,
  state,
  columns: columnsProp,
  children,
  ...tableOptions
}: TableProps<T>) => {
  const ref = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const [registeredColumns, setRegisteredColumns] = useState<ColumnDef<T>[]>([])

  const registerColumn = useCallback((column: ColumnDef<T>) => {
    setRegisteredColumns(prev => {
      return [...prev, column]
    })
  }, [])

  const unregisterColumn = useCallback((columnId: string) => {
    setRegisteredColumns(prev => {
      return prev.filter(column => column.id !== columnId)
    })
  }, [])

  const columns = useMemo(() => {
    const contextColumns = Array.from(registeredColumns.values())
    if (columnsProp) {
      return [...contextColumns, ...columnsProp]
    }
    return contextColumns
  }, [columnsProp, registeredColumns])

  const defaultColumn = useMemo(() => {
    return {
      minSize: 60,
      maxSize: 800,
      cell: ({ cell }) => {
        return (<TableCell>{cell.getValue() as string}</TableCell>)
      },
      ...defaultColumnOverwrite,
    }
  }, [defaultColumnOverwrite])

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(columns.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.id]: currentValue.size ??  defaultColumn.size ?? currentValue.minSize ?? defaultColumn.minSize,
    }
  }, {}))

  const [columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState?.columnFilters)



  const updateColumnSizes = useCallback((newColumnSizing: ColumnSizingState) => {
    return ColumnSizeUtil.calculate({
      previousSizing: columnSizing,
      newSizing: newColumnSizing,
      minWidthsPerColumn: columns.reduce((previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue.id]: currentValue.minSize ?? defaultColumn.minSize,
        }
      }, {}),
      maxWidthsPerColumn: columns.reduce((previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue.id]: currentValue.maxSize ?? defaultColumn.maxSize,
        }
      }, {}),
      columnIds: columns.map(column => column.id),
      target: {
        width: ref.current?.offsetWidth,
        behaviour: 'equalOrHigher',
      },
    })
  }, [columnSizing, columns, defaultColumn.maxSize, defaultColumn.minSize])

  useResizeCallbackWrapper(useCallback(() => {
    setColumnSizing(updateColumnSizes(columnSizing))
  }, [updateColumnSizes, columnSizing]))

  const table = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: initialState,
    defaultColumn,
    columns,
    state: {
      columnSizing,
      columnSizingInfo,
      columnFilters,
      ...state
    },
    filterFns: {
      ...tableOptions?.filterFns,
      dateRange: TableFilter.dateRange,
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

  useEffect(() => {
    table.setColumnSizing(updateColumnSizes(columnSizing))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columnSizeVars = useMemo(() => {
    return ColumnSizeUtil.toSizeVars(table)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, table.getState().columnSizingInfo, table.getState().columnSizing])


  return (
    <TableContext.Provider value={{ table, registerColumn, unregisterColumn }}>
      {children}
      <div ref={ref} data-name={PropsUtil.dataAttributes.name('table-container')} className={tableContainerClassName}>
        <table
          ref={tableRef}

          data-name={PropsUtil.dataAttributes.name('table')}

          style={{
            ...columnSizeVars,
            width: Math.floor(Math.max(table.getTotalSize() - columns.length, ref.current?.offsetWidth ?? table.getTotalSize())),
          }}

          className={tableClassName}
        >
          <TableHeader table={table} />
          <TableBody
            table={table}
            onRowClick={onRowClick}
            fillerRow={fillerRow}
            isUsingFillerRows={table.getRowModel().rows.length < table.getState().pagination.pageSize}
          />
        </table>
      </div>
      <div className="flex-row-8 justify-center relative w-full">
        <TablePagination />
        <TablePageSizeController buttonProps={{ className: 'min-w-24' }} tooltipProps={{ containerClassName: 'top-0 right-0' }} />
      </div>
    </TableContext.Provider>
  )
}


export type TableWithSelectionProps<T> = TableProps<T> & {
  rowSelection: RowSelectionState,
  disableClickRowClickSelection?: boolean,
  selectionRowId?: string,
}

export const TableWithSelection = <T,>({
  children,
  state,
  fillerRow,
  rowSelection,
  disableClickRowClickSelection = false,
  selectionRowId = 'selection',
  onRowClick,
  meta,
  ...props
}: TableWithSelectionProps<T>) => {
  return (
    <Table
      fillerRow={(columnId, table) => {
        if (columnId === selectionRowId) {
          return (<Checkbox value={false} disabled={true} className="max-w-6" />)
        }
        return fillerRow ? fillerRow(columnId, table) : (<FillerCell />)
      }}
      state={{
        rowSelection,
        ...state
      }}
      onRowClick={(row, table) => {
        if (!disableClickRowClickSelection) {
          row.toggleSelected()
        }
        onRowClick?.(row, table)
      }}
      meta={{
        ...meta,
        bodyRowClassName: clsx(
          { 'cursor-pointer': !disableClickRowClickSelection },
          meta?.bodyRowClassName
        )
      }}
      {...props}
    >
      <TableColumn
        id={selectionRowId}
        header={({ table }) => {
          return (
            <Checkbox
              value={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onValueChange={value => {
                const newValue = !!value
                table.toggleAllRowsSelected(newValue)
              }}
            />
          )
        }}
        cell={({ row }) => {
          return (
            <Checkbox
              disabled={!row.getCanSelect()}
              value={row.getIsSelected()}
              onValueChange={row.getToggleSelectedHandler()}
            />
          )
        }}
        size={60}
        minSize={60}
        maxSize={60}
        enableResizing={false}
        enableSorting={false}
      />
      {children}
    </Table>
  )
}