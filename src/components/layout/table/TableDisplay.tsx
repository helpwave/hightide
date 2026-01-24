import type { TableHTMLAttributes } from 'react'
import './types'
import { TableBody } from './TableBody'
import type { TableHeaderProps } from './TableHeader'
import { TableHeader } from './TableHeader'
import { useTableDataContext, useTableContainerContext, useTableHeaderContext } from './TableContext'
import clsx from 'clsx'

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
  const { table } = useTableDataContext<T>()
  const { containerRef } = useTableContainerContext<T>()
  const { sizeVars } = useTableHeaderContext<T>()

  return (
    <div {...containerProps} ref={containerRef} className={clsx('table-container', containerProps?.className)}>
      <table
        {...props}
        className={clsx('table', props.className)}

        style={{
          ...sizeVars,
          width: Math.floor(Math.max(table.getTotalSize(), containerRef.current?.offsetWidth ?? table.getTotalSize())),
        }}
      >
        {children}
        <TableHeader {...tableHeaderProps} />
        <TableBody />
      </table>
    </div>
  )
}