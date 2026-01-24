import type {
  PaginationState,
  RowSelectionState,
  Table } from '@tanstack/react-table'
import {
  type ColumnDef,
  type Table as ReactTable,
  type Row
} from '@tanstack/react-table'
import type { ReactNode, RefObject } from 'react'
import { createContext, useContext } from 'react'

export type TableDataContextType<T> = {
  table: ReactTable<T>,
  columns: ColumnDef<T>[],
  rows: Row<T>[],
  rowSelection: RowSelectionState,
  data: T[],
  pagination: PaginationState,
  isUsingFillerRows: boolean,
  fillerRow: (columnId: string, table: ReactTable<T>) => ReactNode,
  onRowClick: (row: Row<T>, table: ReactTable<T>) => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableDataContext = createContext<TableDataContextType<any> | null>(null)

export const useTableDataContext = <T,>(): TableDataContextType<T> => {
  const context = useContext(TableDataContext)
  if (!context) throw new Error('useTableDataContext must be used within a <TableDataContext.Provider> like <TableData>')
  return context as TableDataContextType<T>
}


export type TableColumnDefinitionContextType<T> = {
  table: Table<T>,
  registerColumn: (column: ColumnDef<T>) => () => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableColumnDefinitionContext = createContext<TableColumnDefinitionContextType<any> | null>(null)

export const useTableColumnDefinitionContext = <T,>(): TableColumnDefinitionContextType<T> => {
  const context = useContext(TableColumnDefinitionContext)
  if (!context) throw new Error('useTableColumnDefinitionContext must be used within a <TableColumnDefinitionContext.Provider> like <TableColumnDefinition>')
  return context as TableColumnDefinitionContextType<T>
}


export type TableHeaderContextType<T> = {
  table: Table<T>,
  sizeVars: Record<string, number>,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableHeaderContext = createContext<TableHeaderContextType<any> | null>(null)

export const useTableHeaderContext = <T,>(): TableHeaderContextType<T> => {
  const context = useContext(TableHeaderContext)
  if (!context) throw new Error('useTableHeaderContext must be used within a <TableHeaderContext.Provider> like <TableHeader>')
  return context as TableHeaderContextType<T>
}


export type TableContainerContextType<T> = {
  table: Table<T>,
  containerRef: RefObject<HTMLDivElement>,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableContainerContext = createContext<TableContainerContextType<any> | null>(null)

export const useTableContainerContext = <T,>(): TableContainerContextType<T> => {
  const context = useContext(TableContainerContext)
  if (!context) throw new Error('useTableContainerContext must be used within a <TableContainerContext.Provider> like <TableContainer>')
  return context as TableContainerContextType<T>
}