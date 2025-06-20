import type { PropsWithChildren, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

type IconBuilder = (expanded: boolean) => ReactNode

export type ExpandableProps = PropsWithChildren<{
  label: ReactNode,
  icon?: IconBuilder,
  initialExpansion?: boolean,
  /**
   * Whether the expansion should only happen when the header is clicked or on the entire component
   */
  clickOnlyOnHeader?: boolean,
  disabled?: boolean,
  className?: string,
  headerClassName?: string,
}>

const DefaultIcon: IconBuilder = (expanded) => expanded ?
  (<ChevronUp size={16} className="min-w-[16px]"/>)
  : (<ChevronDown size={16} className="min-w-[16px]"/>)

/**
 * A Component for showing and hiding content
 */
export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(({
                                                                         children,
                                                                         label,
                                                                         icon,
                                                                         initialExpansion = false,
                                                                         clickOnlyOnHeader = true,
                                                                         disabled = false,
                                                                         className = '',
                                                                         headerClassName = ''
                                                                       }, ref) => {
  const [isExpanded, setIsExpanded] = useState(initialExpansion)
  icon ??= DefaultIcon

  return (
    <div
      ref={ref}
      className={clsx('col gap-y-0 bg-surface text-on-surface group rounded-lg shadow-sm', { 'cursor-pointer': !clickOnlyOnHeader && !disabled }, className)}
      onClick={() => !clickOnlyOnHeader && !disabled && setIsExpanded(!isExpanded)}
    >
      <div
        className={clsx(
          'row py-2 px-4 rounded-lg justify-between items-center bg-surface text-on-surface select-none',
          {
            'group-hover:brightness-95': !isExpanded,
            'hover:brightness-95': isExpanded && !disabled,
            'cursor-pointer': clickOnlyOnHeader && !disabled,
          },
          headerClassName
        )}
        onClick={() => clickOnlyOnHeader && !disabled && setIsExpanded(!isExpanded)}
      >
        {label}
        {icon(isExpanded)}
      </div>
      {isExpanded && (
        <div className="col px-4 pb-2">
          {children}
        </div>
      )}
    </div>
  )
})

Expandable.displayName = 'Expandable'
