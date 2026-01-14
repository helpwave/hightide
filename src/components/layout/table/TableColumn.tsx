import type { ColumnDef } from '@tanstack/react-table'
import { memo, useEffect, useMemo, useState } from 'react'
import { useTableContext } from './TableContext'
import type { TableFilterType } from './TableFilterButton'

export type TableColumnProps<T> = ColumnDef<T> & {
  filterType?: TableFilterType,
}

const TableColumnComponent = <T,>({
  filterType,
  ...props
}: TableColumnProps<T>) => {
  const { column: { registerColumn } } = useTableContext<T>()

  const [column] = useState<ColumnDef<T>>({
    ...props,
    meta: {
      ...props.meta,
      filterType,
    },
  })

  useEffect(() => {
    const unsubscribe =registerColumn(column)

    return () => {
      unsubscribe()
    }
  }, [registerColumn, column])

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