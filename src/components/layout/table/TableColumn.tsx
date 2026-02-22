import type { ColumnDef } from '@tanstack/react-table'
import { memo,  useEffect,  useMemo, useState } from 'react'
import { useTableColumnDefinitionContext } from './TableContext'
import type { DataType } from '../../user-interaction/data/data-types'
import { useLogOnce } from '@/src/hooks/useLogOnce'

export type TableColumnProps<T> = ColumnDef<T> & {
  filterType?: DataType,
}

const TableColumnComponent = <T,>({
  filterType,
  ...props
}: TableColumnProps<T>) => {
  const { registerColumn } = useTableColumnDefinitionContext<T>()

  const filterFn = filterType ?? props.filterFn

  useLogOnce(
    'TableColumn: For filterType === multiTags or singleTag, filterData.tags must be set.',
    (filterType === 'multiTags' || filterType === 'singleTag') && props.meta?.filterData?.tags === undefined
  )

  const [column] = useState<ColumnDef<T>>({
    ...props,
    filterFn,
  } as ColumnDef<T>)

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
    prevProps.enableSorting === nextProps.enableSorting &&
    prevProps.meta === nextProps.meta,
    prevProps.cell === nextProps.cell
  }
)

export const TableColumn = <T,>(props: TableColumnProps<T>) => {
  const TableColumnComponent = useMemo(() => TableColumnFactory<T>(), [])
  return <TableColumnComponent {...props} />
}