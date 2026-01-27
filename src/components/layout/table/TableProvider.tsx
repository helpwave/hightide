import type { ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ColumnSizeUtil } from './columnSizeUtil'
import type { TableStateWithoutSizingContextType } from './TableContext'
import { TableColumnDefinitionContext, TableContainerContext, TableStateContext, TableStateWithoutSizingContext } from './TableContext'
import { TableFilter } from './TableFilter'
import type { ColumnDef, InitialTableState, Row, TableOptions, TableState , Table as ReactTable } from '@tanstack/react-table'
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { TableCell } from './TableCell'
import { ColumnSizingWithTargetFeature } from './ColumnSizingWithTargetFeature'
import { useResizeCallbackWrapper } from '@/src/hooks/useResizeCallbackWrapper'
import { AutoColumnOrderFeature } from './AutoColumnOrderFeature'

export type TableProviderProps<T> = {
    data: T[],
    columns?: ColumnDef<T>[],
    children?: ReactNode,
    isUsingFillerRows?: boolean,
    fillerRowCell?: (columnId: string, table: ReactTable<T>) => ReactNode,
    initialState?: InitialTableState,
    onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
    onFillerRowClick?: (index: number, table: ReactTable<T>) => void,
    state?: Partial<TableState>,
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
  const [,setTableState] = useState<TableState>({
    columnSizing: {},
    columnOrder: [],
    columnFilters: [],
    columnVisibility: {},
    columnPinning: {},
    sorting: [],
    columnSizingInfo: {
      columnSizingStart: [],
      startOffset: 0,
      startSize: 0,
      deltaOffset: 0,
      deltaPercentage: 0,
      isResizingColumn: false,
    },
    rowPinning: {},
    globalFilter: undefined,
    expanded: {},
    grouping: [],
    rowSelection: {},
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  })

  const [targetWidth, setTargetWidth] =  useState<number | undefined>(undefined)
  useLayoutEffect(() => {
    const width = containerRef.current?.getBoundingClientRect().width
    setTargetWidth(width !== undefined ? Math.floor(width) : undefined)
  }, [containerRef])
  useResizeCallbackWrapper(useCallback(() => {
    const width = containerRef.current?.getBoundingClientRect().width
    setTargetWidth(width !== undefined ? Math.floor(width) : undefined)
  }, [containerRef]))

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

  const table = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
      cell: useCallback(({ cell }) => {
        return (<TableCell>{String(cell.getValue())}</TableCell>)
      }, []),
      enableResizing: true,
      enablePinning: true,
      ...defaultColumnOverwrite,
    },
    columns,
    state: {
      ...state,
    },
    onStateChange: (updaterOrValue) => {
      setTableState(prev => {
        return typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue
      })
      tableOptions.onStateChange?.(updaterOrValue)
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
    _features: [
      ...(tableOptions._features ?? []),
      ColumnSizingWithTargetFeature,
      AutoColumnOrderFeature,
    ],
    columnSizingTarget: targetWidth,
    autoResetPageIndex: false,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    ...tableOptions,
  })

  const pagination = table.getState().pagination
  const pageCount = table.getPageCount()

  // Fix pagination index when page count changes
  useEffect(() => {
    if(pageCount === -1) {
      return
    }
    if(pagination.pageIndex > pageCount - 1) {
      table.setPageIndex(pageCount - 1)
    }
  }, [table, pagination.pageIndex, pageCount])

  // Fix column order when columns change
  useEffect(() => {
    table.setColumnOrder(prev => [...prev])
  }, [table, columns])

  // Fix column sizing when target width changes
  useEffect(() => {
    table.setColumnSizing(prev => ({ ...prev }))
  }, [table, targetWidth])


  const tableColumnDefinitionContextValue = useMemo(() => ({
    table,
    registerColumn,
  }), [table, registerColumn])


  const tableContainerContextValue = useMemo(() => ({
    table,
    containerRef,
  }), [table, containerRef])

  const relevantTableState: Omit<TableState, 'columnSizing' | 'columnSizingInfo'> = (() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { columnSizing, columnSizingInfo, ...rest } = table.getState()
    return rest
  })()

  const rowModel = table.getRowModel()
  const tableStateWithoutSizingContextValue = useMemo<TableStateWithoutSizingContextType<T>>(() => ({
    table,
    isUsingFillerRows,
    fillerRowCell,
    onRowClick,
    onFillerRowClick,
    columnVisibility: relevantTableState.columnVisibility,
    columnOrder: relevantTableState.columnOrder,
    columnPinning: relevantTableState.columnPinning,
    rowPinning: relevantTableState.rowPinning,
    globalFilter: relevantTableState.globalFilter,
    expanded: relevantTableState.expanded,
    grouping: relevantTableState.grouping,
    rowSelection: relevantTableState.rowSelection,
    pagination: relevantTableState.pagination,
    sorting: relevantTableState.sorting,
    columnFilters: relevantTableState.columnFilters,
    data,
    columns,
    rowModel,
  }), [
    table,
    data,
    columns,
    rowModel,
    isUsingFillerRows,
    fillerRowCell,
    onRowClick,
    onFillerRowClick,
    relevantTableState.columnVisibility,
    relevantTableState.columnOrder,
    relevantTableState.columnPinning,
    relevantTableState.rowPinning,
    relevantTableState.globalFilter,
    relevantTableState.expanded,
    relevantTableState.grouping,
    relevantTableState.rowSelection,
    relevantTableState.pagination,
    relevantTableState.sorting,
    relevantTableState.columnFilters
  ])

  const columnSizing = table.getState().columnSizing
  const columnSizingInfo = table.getState().columnSizingInfo
  const tableStateContextValue = useMemo(() => ({
    ...tableStateWithoutSizingContextValue,
    sizeVars: ColumnSizeUtil.toSizeVars(columnSizing),
    columnSizingInfo,
    columnSizing,
  }), [columnSizing, columnSizingInfo, tableStateWithoutSizingContextValue])

  return (
    <TableStateWithoutSizingContext.Provider value={tableStateWithoutSizingContextValue}>
      <TableStateContext.Provider value={tableStateContextValue}>
        <TableColumnDefinitionContext.Provider value={tableColumnDefinitionContextValue}>
          <TableContainerContext.Provider value={tableContainerContextValue}>
            {children}
          </TableContainerContext.Provider>
        </TableColumnDefinitionContext.Provider>
      </TableStateContext.Provider>
    </TableStateWithoutSizingContext.Provider>
  )
}