import type { ColumnDef } from '@tanstack/react-table'

export const NO_COLUMN_ID = 'no-column'

export const createNoColumnPlaceholderColumn = <T>(
  columnName: string
): ColumnDef<T> => ({
  id: NO_COLUMN_ID,
  accessorFn: () => '',
  header: columnName,
  filterFn: 'text',
  enableSorting: false,
  enableColumnFilter: false,
  enableHiding: false,
  meta: {
    columnLabel: columnName,
  },
})

export const hasNonExcludedColumns = <T>(
  columns: ColumnDef<T>[],
  excludeIds: string[]
): boolean => columns.some(column => !excludeIds.includes(column.id ?? ''))
