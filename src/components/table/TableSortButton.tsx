import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import type { IconButtonProps } from '../user-action/Button'
import { IconButton } from '../user-action/Button'
import clsx from 'clsx'
import type { SortDirection } from '@tanstack/react-table'

export type TableSortButtonProps = IconButtonProps & {
  sortDirection: SortDirection | false,
  invert?: boolean,
}

/**
 * An Extension of the normal button that displays the sorting state right of the content
 */
export const TableSortButton = ({
                             sortDirection,
                             invert = false,
                             color = 'neutral',
                             className,
                             ...buttonProps
                           }: TableSortButtonProps) => {
  let icon = <ChevronsUpDown className="w-full h-full"/>
  if (sortDirection) {
    let usedSortDirection = sortDirection
    if (invert) {
      usedSortDirection = usedSortDirection === 'desc' ? 'asc' : 'desc'
    }
    icon = usedSortDirection === 'asc' ? (<ChevronUp className="w-full h-full"/>) : (
      <ChevronDown className="w-full h-full"/>)
  }

  return (
    <IconButton
      size="tiny"
      color={color}
      className={clsx(className)}
      {...buttonProps}
    >
      {icon}
    </IconButton>
  )
}