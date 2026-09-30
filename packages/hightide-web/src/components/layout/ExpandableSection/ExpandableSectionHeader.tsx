import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

import { ColoringUtils } from '../../../utils/coloring'
import { ExpansionIcon } from '../../display-and-visualization/ExpansionIcon'
import { useExpandableContext } from '../Expandable/ExpandableContext'

export type ExpandableSectionHeaderProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isUsingDefaultIcon?: boolean,
}

export function ExpandableSectionHeader({
  children,
  className,
  isUsingDefaultIcon = true,
  ...props
}: ExpandableSectionHeaderProps) {
  const { isExpanded, disabled } = useExpandableContext()

  return (
    <button
      type="button"
      {...props}
      data-expanded={isExpanded ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...ColoringUtils.dataColoringMode('interactive')}
      className={clsx('expandable-section-header', className)}
    >
      {children}
      {isUsingDefaultIcon && (
        <ExpansionIcon
          isExpanded={isExpanded}
          disabled={disabled}
          aria-hidden
          className="expandable-section-header-icon"
        />
      )}
    </button>
  )
}
