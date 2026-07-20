import type { PropsWithChildren } from 'react'

export type TableCellProps = PropsWithChildren<{
  className?: string,
}>

export const TableCell = ({
  children,
  className,
}: TableCellProps) => {
  return (
    <span data-name="table-default-cell" className={className}>
      {children}
    </span>
  )
}