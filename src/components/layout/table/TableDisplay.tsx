import type { TableHTMLAttributes } from 'react'
import type {
  FilterFn,
  RowData,
  Table as ReactTable
} from '@tanstack/react-table'
import {
} from '@tanstack/react-table'
import type { TableFilterType } from '@/src/components/layout/table/TableFilterButton'
import { type BagFunctionOrValue } from '@/src/utils/bagFunctions'
import { PropsUtil } from '@/src/utils/propsUtil'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { useTableContext } from './TableContext'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string,
    filterType?: TableFilterType,
  }

  interface TableMeta<TData> {
    headerRowClassName?: string,
    bodyRowClassName?: BagFunctionOrValue<TData, string>,
  }

  interface FilterFns {
    dateRange: FilterFn<unknown>,
  }
}

export interface TableDisplayProps<T> extends TableHTMLAttributes<HTMLTableElement> {
  table?: ReactTable<T>,
  containerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
}


/**
 * The standard table
 */
export const TableDisplay = <T,>({
  containerProps,
  ...props
}: TableDisplayProps<T>) => {
  const { tableState, table: contextTableProps, container } = useTableContext<T>()

  return (
    <div {...containerProps} ref={container.ref} data-name={PropsUtil.dataAttributes.name('table-container')}>
      <table
        {...props}

        data-name={PropsUtil.dataAttributes.name('table')}

        style={{
          ...contextTableProps.sizeVars,
          width: Math.floor(Math.max(tableState.getTotalSize(), container.ref.current?.offsetWidth ?? tableState.getTotalSize())),
        }}
      >
        <TableHeader />
        <TableBody />
      </table>
    </div>
  )
}