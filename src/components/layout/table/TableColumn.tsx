import type { ColumnDef } from '@tanstack/react-table'
import { memo, useEffect, useMemo } from 'react'
import { useTableContext } from './TableContext'
import type { TableFilterType } from './TableFilterButton'

export type TableColumnProps<T> = ColumnDef<T> & {
  filterType?: TableFilterType,
}

const TableColumnComponent = <T,>({
  filterType,
  ...props
}: TableColumnProps<T>) => {
  const { registerColumn, unregisterColumn } = useTableContext<T>()

  const column = useMemo<ColumnDef<T>>(() => ({
    ...props,
    meta: {
      ...props.meta,
      filterType,
    },
  }), [])

  useEffect(() => {
    const currentColumnId = column.id ?? ''

    registerColumn(column)

    return () => {
      unregisterColumn(currentColumnId)
    }
  }, [registerColumn, unregisterColumn, column])

  return null
}

const TableColumnFactory = <T,>() => memo(
  TableColumnComponent<T>,
  (prevProps, nextProps) => {
    return prevProps.filterType === nextProps.filterType &&
    prevProps.id === nextProps.id &&
    prevProps['accessorKey'] === nextProps['accessorKey'] &&
    prevProps.enableColumnFilter === nextProps.enableColumnFilter &&
    prevProps.enableGlobalFilter === nextProps.enableGlobalFilter &&
    prevProps.enableGrouping === nextProps.enableGrouping &&
    prevProps.enableHiding === nextProps.enableHiding &&
    prevProps.enablePinning === nextProps.enablePinning &&
    prevProps.enableResizing === nextProps.enableResizing &&
    prevProps.enableSorting === nextProps.enableSorting
  }
)

export const TableColumn = <T,>(props: TableColumnProps<T>) => {
  const TableColumnComponent = useMemo(() => TableColumnFactory<T>(), [])
  return <TableColumnComponent {...props} />
}