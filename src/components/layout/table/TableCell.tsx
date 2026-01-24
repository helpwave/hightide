import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'

export type TableCellProps = PropsWithChildren<{
  className?: string,
}>

export const TableCell = ({
  children,
  className,
}: TableCellProps) => {
  return (
    <span className={clsx('table-default-cell', className)}>
      {children}
    </span>
  )
}