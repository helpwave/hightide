import type {
  PaginationState,
  Table } from '@tanstack/react-table'
import {
  type ColumnDef,
  type Table as ReactTable,
  type Row
} from '@tanstack/react-table'
import type { ReactNode, RefObject } from 'react'
import { createContext, useContext } from 'react'

export type TableBodyContextType<T> = {
  table: ReactTable<T>,
  columns: ColumnDef<T>[],
  data: T[],
  pagination: PaginationState,
  isUsingFillerRows: boolean,
  fillerRow: (columnId: string, table: ReactTable<T>) => ReactNode,
  onRowClick: (row: Row<T>, table: ReactTable<T>) => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableBodyContext = createContext<TableBodyContextType<any> | null>(null)

export const useTableBodyContext = <T,>(): TableBodyContextType<T> => {
  const context = useContext(TableBodyContext)
  if (!context) throw new Error('useTableBodyContext must be used within a <TableBodyContext.Provider> like <TableBody>')
  return context as TableBodyContextType<T>
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