import type {
  Row,
  RowModel,
  Table,
  TableState
} from '@tanstack/react-table'
import {
  type ColumnDef,
  type Table as ReactTable
} from '@tanstack/react-table'
import type { ReactNode, RefObject } from 'react'
import { createContext, useContext } from 'react'


export interface TableStateWithoutSizingContextType<T> extends Omit<TableState, 'columnSizing' | 'columnSizingInfo'> {
  table: ReactTable<T>,
  data: T[],
  columns: ColumnDef<T>[],
  rowModel: RowModel<T>,
  isUsingFillerRows: boolean,
  fillerRowCell: (columnId: string, table: ReactTable<T>) => ReactNode,
  onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
  onFillerRowClick?: (index: number, table: ReactTable<T>) => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableStateWithoutSizingContext = createContext<TableStateWithoutSizingContextType<any> | null>(null)

/**
 * Context for the table state without sizing
 *
 * Use this context to access the table state without sizing
 *
 * This is done to avoid re-rendering the table when the sizing changes rapidly
 */
export const useTableStateWithoutSizingContext = <T,>(): TableStateWithoutSizingContextType<T> => {
  const context = useContext(TableStateWithoutSizingContext)
  if (!context) throw new Error('useTableStateWithoutSizingContext must be used within a <TableStateWithoutSizingContext.Provider> like <TableStateWithoutSizing>')
  return context as TableStateWithoutSizingContextType<T>
}



export interface TableStateContextType<T> extends TableState {
  table: Table<T>,
  data: T[],
  columns: ColumnDef<T>[],
  rowModel: RowModel<T>,
  isUsingFillerRows: boolean,
  fillerRowCell: (columnId: string, table: ReactTable<T>) => ReactNode,
  onRowClick?: (row: Row<T>, table: ReactTable<T>) => void,
  onFillerRowClick?: (index: number, table: ReactTable<T>) => void,
  sizeVars: Record<string, number>,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableStateContext = createContext<TableStateContextType<any> | null>(null)

/**
 * Context for the table state
 *
 * Use this context to access the table state and only do cheap operations on it as it can be re-rendered frequently
 */
export const useTableStateContext = <T,>(): TableStateContextType<T> => {
  const context = useContext(TableStateContext)
  if (!context) throw new Error('useTableStateContext must be used within a <TableStateContext.Provider> like <TableState>')
  return context as TableStateContextType<T>
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