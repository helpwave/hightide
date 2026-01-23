import type { TableHTMLAttributes } from 'react'
import type {
  Table as ReactTable
} from '@tanstack/react-table'
import { PropsUtil } from '@/src/utils/propsUtil'
import './types'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import { useTableBodyContext, useTableContainerContext, useTableHeaderContext } from './TableContext'

export interface TableDisplayProps<T> extends TableHTMLAttributes<HTMLTableElement> {
  table?: ReactTable<T>,
  containerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
}


/**
 * The standard table
 */
export const TableDisplay = <T,>({
  children,
  containerProps,
  ...props
}: TableDisplayProps<T>) => {
  const { table } = useTableBodyContext<T>()
  const { containerRef } = useTableContainerContext<T>()
  const { sizeVars } = useTableHeaderContext<T>()

  return (
    <div {...containerProps} ref={containerRef} data-name={PropsUtil.dataAttributes.name('table-container')}>
      <table
        {...props}

        data-name={PropsUtil.dataAttributes.name('table')}

        style={{
          ...sizeVars,
          width: Math.floor(Math.max(table.getTotalSize(), containerRef.current?.offsetWidth ?? table.getTotalSize())),
        }}
      >
        {children}
        <TableHeader />
        <TableBody />
      </table>
    </div>
  )
}