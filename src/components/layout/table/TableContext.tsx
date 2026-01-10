import type { ColumnDef, Table as ReactTable } from '@tanstack/react-table'
import { createContext, useContext } from 'react'



export type TableContextType<T> = {
  table: ReactTable<T>,
  registerColumn: (column: ColumnDef<T>) => void,
  unregisterColumn: (columnId: string) => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableContext = createContext<TableContextType<any> | null>(null)

export const useTableContext = <T,>(): TableContextType<T> => {
  const context = useContext(TableContext)
  if (!context) throw new Error('useTableContext must be used within a <TableContext.Provider> like <Table>')
  return context as TableContextType<T>
}

