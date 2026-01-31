import type { TableHTMLAttributes } from 'react'
import './types'
import { TableBody } from './TableBody'
import type { TableHeaderProps } from './TableHeader'
import { TableHeader } from './TableHeader'
import { useTableContainerContext, useTableStateContext } from './TableContext'

export interface TableDisplayProps extends TableHTMLAttributes<HTMLTableElement> {
  containerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
  tableHeaderProps?: Omit<TableHeaderProps, 'children' | 'table'>,
}


/**
 * A display component for a table that requires a TableProvider for the table context
 */
export const TableDisplay = <T,>({
  children,
  containerProps,
  tableHeaderProps,
  ...props
}: TableDisplayProps) => {
  const { table } = useTableStateContext<T>()
  const { containerRef } = useTableContainerContext<T>()

  return (
    <div {...containerProps} ref={containerRef} data-name={containerProps?.['data-name'] ?? 'table-container'}>
      <table
        {...props}
        data-name={props['data-name'] ?? 'table'}

        style={{
          width: Math.floor(Math.max(table.getTotalSize(), containerRef.current?.offsetWidth ?? table.getTotalSize())),
          ...props.style,
        }}
      >
        {children}
        <TableHeader {...tableHeaderProps} />
        <TableBody />
      </table>
    </div>
  )
}