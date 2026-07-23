import type { ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useEventCallbackStabilizer } from '@helpwave/hightide-utils/hooks'
import { ColumnSizeUtil } from './columnSizeUtil'
import type { ColumnSizingMode, TableColumnDefinitionContextType, TableContainerContextType, TableStateWithoutSizingContextType } from './TableContext'
import { TableColumnDefinitionContext, TableContainerContext, TableStateContext, TableStateWithoutSizingContext } from './TableContext'
import { TableFilter } from './TableFilter'
import type { ColumnDef, InitialTableState, Row, TableOptions, TableState , Table as ReactTable, CellContext, Table } from '@tanstack/react-table'
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { TableCell } from './TableCell'
import { ColumnSizingWithTargetFeature } from './ColumnSizingWithTargetFeature'
import { useWindowResizeObserver } from '../../../hooks/useWindowResizeObserver'
import { AutoColumnOrderFeature } from './AutoColumnOrderFeature'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { createNoColumnPlaceholderColumn, hasNonExcludedColumns } from './placeholderColumn'
import { FillerCell } from './FillerCell'

export type TableProviderProps<T> = {
  data: T[],
  columns?: ColumnDef<T>[],
  children?: ReactNode,
  placeholderColumnExcludeIds?: string[],
  isUsingFillerRows?: boolean,
  columnSizingMode?: ColumnSizingMode,
  fillerRowCell?: (columnId: string, table: ReactTable<T>) => ReactNode,
  initialState?: InitialTableState,
  onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
  onFillerRowClick?: (index: number, table: ReactTable<T>) => void,
  state?: Partial<TableState>,
} & Partial<TableOptions<T>>

export const TableProvider = <T,>({
  data,
  isUsingFillerRows = true,
  columnSizingMode = 'fill',
  fillerRowCell: fillerRowCellOverwrite,
  initialState,
  onRowClick,
  onFillerRowClick,
  defaultColumn: defaultColumnOverwrite,
  state,
  columns: columnsProp,
  placeholderColumnExcludeIds,
  children,
  ...tableOptions
}: TableProviderProps<T>) => {
  const translation = useHightideTranslation()
  const onRowClickStable = useEventCallbackStabilizer(onRowClick)
  const onFillerRowClickStable = useEventCallbackStabilizer(onFillerRowClick)

  const [registeredColumns, setRegisteredColumns] = useState<ColumnDef<T>[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [tableState, setTableState] = useState<TableState>({
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

  const negotiatesWidths = columnSizingMode === 'fill'
  const [targetWidth, setTargetWidth] =  useState<number | undefined>(undefined)
  const computeWidth = useCallback(() => {
    const el = containerRef?.current
    let width = el?.getBoundingClientRect().width

    if(width === undefined || !el) return width
    const styles = getComputedStyle(el)
    let leftBorderWidth = parseFloat(styles.borderLeftWidth)
    if(isNaN(leftBorderWidth)) leftBorderWidth = 0
    let rightBorderWidth = parseFloat(styles.borderRightWidth)
    if(isNaN(rightBorderWidth)) rightBorderWidth = 0
    width = width - leftBorderWidth - rightBorderWidth
    return Math.floor(width)
  }, [containerRef])

  useLayoutEffect(() => {
    if(!negotiatesWidths) return
    setTargetWidth(computeWidth())
  }, [computeWidth, negotiatesWidths])

  useWindowResizeObserver(useCallback(() => {
    if(!negotiatesWidths) return
    setTargetWidth(computeWidth())
  }, [computeWidth, negotiatesWidths]))

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
    const merged = columnsProp ? [...contextColumns, ...columnsProp] : contextColumns

    const nonVisibleColumnIds: string[] = merged
      .reduce((prev, next) => {
        const id = next.id
        if(!id || (tableState?.columnVisibility[id] ?? true)) return prev
        return [...prev, id]
      },[] as string[])

    const excludedIds = [
      ...(placeholderColumnExcludeIds ?? []),
      ...nonVisibleColumnIds,
    ]

    if (!hasNonExcludedColumns(merged, excludedIds)) {
      return [...merged, createNoColumnPlaceholderColumn<T>(translation)]
    }

    return merged
  }, [columnsProp, registeredColumns, placeholderColumnExcludeIds, translation, tableState.columnVisibility])

  const defaultCell = useCallback((value : CellContext<T, unknown>) => {
    let parsedValue: string = ''
    if(typeof value === 'string') parsedValue = value
    else parsedValue = String(value.cell.getValue())
    return (<TableCell>{parsedValue}</TableCell>)
  }, [])

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
      cell: defaultCell,
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
      multiTags: TableFilter.multiTags,
      singleTag: TableFilter.singleTag,
      unknownType: TableFilter.unknownType,
    },
    _features: [
      ...(tableOptions._features ?? []),
      ColumnSizingWithTargetFeature,
      AutoColumnOrderFeature,
    ],
    columnSizingTarget: negotiatesWidths ? targetWidth : undefined,
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

  // Fix column sizing when target width changes or column visibility changes
  const columnVisibility = table.getState().columnVisibility
  const columnOrder = table.getState().columnOrder
  const columnPinning = table.getState().columnPinning
  useEffect(() => {
    table.setColumnSizing(prev => ({ ...prev }))
  }, [table, targetWidth, columnVisibility, columnOrder, columnPinning])


  const tableColumnDefinitionContextValue: TableColumnDefinitionContextType<T> = useMemo(() => ({
    table,
    registerColumn,
  }), [table, registerColumn])


  const tableContainerContextValue: TableContainerContextType<T> = useMemo(() => ({
    table,
    containerRef,
  }), [table, containerRef])

  const relevantTableState: Omit<TableState, 'columnSizing' | 'columnSizingInfo'> = (() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { columnSizing, columnSizingInfo, ...rest } = table.getState()
    return rest
  })()

  const rowModel = table.getRowModel()
  const fillerRowCell = useCallback((columnId: string, table: Table<T>) => {
    if(fillerRowCellOverwrite) return fillerRowCellOverwrite(columnId, table)
    return <FillerCell/>
  }, [fillerRowCellOverwrite])
  const tableStateWithoutSizingContextValue = useMemo<TableStateWithoutSizingContextType<T>>(() => ({
    table,
    isUsingFillerRows,
    columnSizingMode,
    fillerRowCell,
    onRowClick: onRowClickStable,
    onFillerRowClick: onFillerRowClickStable,
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
    columnSizingMode,
    fillerRowCell,
    onRowClickStable,
    onFillerRowClickStable,
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
    targetWidth,
  }), [columnSizing, columnSizingInfo, tableStateWithoutSizingContextValue, targetWidth])

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
