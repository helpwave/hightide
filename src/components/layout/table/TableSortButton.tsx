import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react'
import type { ButtonProps } from '../../user-interaction/Button'
import { Button } from '../../user-interaction/Button'
import clsx from 'clsx'
import type { SortDirection } from '@tanstack/react-table'
import { Visibility } from '@/src/components/layout/Visibility'
import { Tooltip } from '@/src/components/user-interaction/Tooltip'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

type SortingIndexDisplay = {
  index: number,
  sortingsCount: number,
}

export type TableSortButtonProps = ButtonProps & {
  sortDirection: SortDirection | false,
  sortingIndexDisplay?: SortingIndexDisplay,
  invert?: boolean,
}

/**
 * An Extension of the normal button that displays the sorting state right of the content
 */
export const TableSortButton = ({
  sortDirection,
  invert = false,
  color = 'neutral',
  size = 'xs',
  className,
  sortingIndexDisplay,
  ...props
}: TableSortButtonProps) => {
  const translation = useHightideTranslation()
  const { sortingsCount, index } = sortingIndexDisplay

  let icon = <ChevronsUpDown className="size-4"/>
  if (sortDirection) {
    let usedSortDirection = sortDirection
    if (invert) {
      usedSortDirection = usedSortDirection === 'desc' ? 'asc' : 'desc'
    }
    icon = usedSortDirection === 'asc' ?
      (<ChevronUp className="size-4"/>) : (<ChevronDown className="size-4"/>)
  }

  const hasSortingIndex = !!sortingIndexDisplay && sortingsCount > 1 && index > 0

  return (
    <Tooltip
      tooltip={(
        <div className="flex-col-2">
          <span>{translation('sSortingState', { sortDirection: sortDirection || 'none' })}</span>
          <Visibility isVisible={hasSortingIndex}>
            <span>{translation('rSortingOrderAfter', { otherSortings: index - 1  } )}</span>
          </Visibility>
        </div>
      )}
      position="top"
    >
      <Button
        layout={hasSortingIndex ? 'default' : 'icon'}
        color={color}
        size={size}
        className={clsx('relative', className)}
        {...props}
      >
        <Visibility isVisible={hasSortingIndex}>
          <div
            className={clsx('absolute bottom-0 right-1/2 translate-x-1/2 translate-y-2/3 z-1 primary coloring-solid rounded-full h-4 w-5 text-sm')}
          >
            {`${index}.`}
          </div>
        </Visibility>
        {icon}
      </Button>
    </Tooltip>
  )
}