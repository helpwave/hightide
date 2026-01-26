import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ColumnSizeUtil } from './columnSizeUtil'
import { TableDataContext, TableColumnDefinitionContext, TableContainerContext, TableHeaderContext } from './TableContext'
import { TableFilter } from './TableFilter'
import type { ColumnDef, ColumnSizingState, InitialTableState, Row, TableOptions, TableState , Table as ReactTable } from '@tanstack/react-table'
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useResizeCallbackWrapper } from '@/src/hooks/useResizeCallbackWrapper'
import { TableCell } from './TableCell'

export type TableProviderProps<T> = {
    data: T[],
    columns?: ColumnDef<T>[],
    children?: ReactNode,
    isUsingFillerRows?: boolean,
    fillerRowCell?: (columnId: string, table: ReactTable<T>) => ReactNode,
    initialState?: Omit<InitialTableState, 'columnSizing'>,
    onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
    onFillerRowClick?: (index: number, table: ReactTable<T>) => void,
    state?: Omit<TableState, 'columnSizing'>,
  } & Partial<TableOptions<T>>

export const TableProvider = <T,>({
  data,
  isUsingFillerRows = true,
  fillerRowCell,
  initialState,
  onRowClick,
  onFillerRowClick,
  defaultColumn: defaultColumnOverwrite,
  state,
  columns: columnsProp,
  children,
  ...tableOptions
}: TableProviderProps<T>) => {
  const [registeredColumns, setRegisteredColumns] = useState<ColumnDef<T>[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const registerColumn = useCallback((column: ColumnDef<T>) => {
    setRegisteredColumns(prev => {
      return [...prev, column]
    })
    return () => {
      setRegisteredColumns(prev => {
        return prev.filter(value => value.id !== column.id)
      })
    }
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
        return (<TableCell>{String(cell.getValue())}</TableCell>)
      },
      enableResizing: true,
      enablePinning: true,
      ...defaultColumnOverwrite,
    }
  }, [defaultColumnOverwrite])

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(columns.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.id]: currentValue.size ??  defaultColumn.size ?? currentValue.minSize ?? defaultColumn.minSize,
    }
  }, {}))

  const [columnOrder, setColumnOrder] = useState<string[]>(state?.columnOrder ?? initialState?.columnOrder ?? [])
  useEffect(() => {
    setColumnOrder(prev => {
      const columnIds = columns.map(column => column.id)
      const newColumnIds = columnIds.filter(columnId => !prev.includes(columnId))
      const withoutRemovedColumns = prev.filter(columnId => !columnIds.includes(columnId))
      return [...withoutRemovedColumns, ...newColumnIds]
    })
  }, [columns])

  const adjustColumnSizes = useCallback((previousSizing: ColumnSizingState, newSizing: ColumnSizingState) => {
    return ColumnSizeUtil.calculate({
      previousSizing,
      newSizing,
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
        width: Math.floor(containerRef.current?.getBoundingClientRect().width ?? 0),
        behaviour: 'equalOrHigher',
      },
    })
  }, [columns, defaultColumn.maxSize, defaultColumn.minSize])

  useEffect(() => {
    setColumnSizing(prev => adjustColumnSizes(prev, prev))
  }, [adjustColumnSizes, columns, defaultColumn.maxSize, defaultColumn.minSize])

  useResizeCallbackWrapper(useCallback(() => {
    setColumnSizing(prev => adjustColumnSizes(prev, prev))
  }, [adjustColumnSizes]))

  const table = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState,
    defaultColumn,
    columns,
    state: {
      ...state,
      columnSizing,
      columnOrder,
    },
    filterFns: {
      ...tableOptions?.filterFns,
      text: TableFilter.text,
      number: TableFilter.number,
      date: TableFilter.date,
      dateTime: TableFilter.dateTime,
      boolean: TableFilter.boolean,
      tags: TableFilter.tags,
      tagsSingle: TableFilter.tagsSingle,
      generic: TableFilter.generic,
    },
    onColumnSizingChange: updaterOrValue => {
      setColumnSizing(previous => {
        const newSizing = typeof updaterOrValue === 'function' ? updaterOrValue(previous) : updaterOrValue
        return adjustColumnSizes(previous,newSizing)
      })
    },
    onColumnOrderChange: updaterOrValue => {
      setColumnOrder(updaterOrValue)
      if (tableOptions.onColumnOrderChange) {
        tableOptions.onColumnOrderChange(updaterOrValue)
      }
    },
    autoResetPageIndex: false,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    ...tableOptions,
  })

  const columnSizeVars = useMemo(() => {
    return ColumnSizeUtil.toSizeVars(columnSizing)
  }, [columnSizing])

  const pagination = table.getState().pagination
  const rowSelection = table.getState().rowSelection
  const rows = table.getRowModel().rows
  const columnFilters = table.getState().columnFilters
  const columnVisibility = table.getState().columnVisibility
  const columnPinning = table.getState().columnPinning
  const columnSorting = table.getState().sorting
  // We need to include more state values than needed such that the consumer catch all changes properly
  const tableDataContextValue = useMemo(() => ({
    table,
    columns,
    data,
    pagination,
    rowSelection,
    isUsingFillerRows,
    fillerRowCell,
    onRowClick,
    onFillerRowClick,
    rows,
    columnOrder,
    columnFilters,
    columnVisibility,
    columnPinning,
    columnSorting,
  }), [table, data, pagination, rowSelection, isUsingFillerRows, fillerRowCell, onRowClick, onFillerRowClick, columns, rows, columnOrder, columnFilters, columnVisibility, columnPinning, columnSorting])

  const tableColumnDefinitionContextValue = useMemo(() => ({
    table,
    registerColumn,
  }), [table, registerColumn])

  const tableHeaderContextValue = useMemo(() => ({
    table,
    sizeVars: columnSizeVars,
  }), [table, columnSizeVars])

  const tableContainerContextValue = useMemo(() => ({
    table,
    containerRef,
  }), [table, containerRef])

  return (
    <TableDataContext.Provider value={tableDataContextValue}>
      <TableColumnDefinitionContext.Provider value={tableColumnDefinitionContextValue}>
        <TableHeaderContext.Provider value={tableHeaderContextValue}>
          <TableContainerContext.Provider value={tableContainerContextValue}>
            {children}
          </TableContainerContext.Provider>
        </TableHeaderContext.Provider>
      </TableColumnDefinitionContext.Provider>
    </TableDataContext.Provider>
  )
}