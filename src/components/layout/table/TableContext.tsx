import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnSizingState, type InitialTableState, type Table as ReactTable, type Row, type TableOptions, type TableState } from '@tanstack/react-table'
import type { ReactNode, RefObject } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { TableCell } from './TableCell'
import { ColumnSizeUtil } from './columnSizeUtil'
import { useResizeCallbackWrapper } from '@/src/hooks/useResizeCallbackWrapper'
import { TableFilter } from './TableFilter'

export type TableContextType<T> = {
  tableState: ReactTable<T>,
  table: {
    sizeVars: Record<string, number>,
  },
  container: {
    ref: RefObject<HTMLDivElement>,
  },
  column: {
    registerColumn: (column: ColumnDef<T>) => () => void,
  },
  body: {
    isUsingFillerRows: boolean,
    fillerRow: (columnId: string, table: ReactTable<T>) => ReactNode,
    onRowClick: (row: Row<T>, table: ReactTable<T>) => void,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableContext = createContext<TableContextType<any> | null>(null)

export const useTableContext = <T,>(): TableContextType<T> => {
  const context = useContext(TableContext)
  if (!context) throw new Error('useTableContext must be used within a <TableContext.Provider> like <Table>')
  return context as TableContextType<T>
}


export type TableProviderProps<T> = {
  data: T[],
  columns?: ColumnDef<T>[],
  children?: ReactNode,
  isUsingFillerRows?: boolean,
  fillerRow?: (columnId: string, table: ReactTable<T>) => ReactNode,
  initialState?: Omit<InitialTableState, 'columnSizing'>,
  onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
  state?: Omit<TableState, 'columnSizing'>,
} & Partial<TableOptions<T>>

export const TableProvider = <T,>({
  data,
  isUsingFillerRows = true,
  fillerRow,
  initialState,
  onRowClick,
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
        return (<TableCell>{cell.getValue() as string}</TableCell>)
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
      dateRange: TableFilter.dateRange,
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

  return (
    <TableContext.Provider
      value={{
        tableState: table,
        column: {
          registerColumn,
        },
        body: {
          isUsingFillerRows,
          fillerRow,
          onRowClick,
        },
        container: {
          ref: containerRef,
        },
        table: {
          sizeVars: columnSizeVars,
        },
      }}
    >
      {children}
    </TableContext.Provider>
  )
}

