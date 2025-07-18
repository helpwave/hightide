import type { PropsWithChildren, ReactNode } from 'react'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { noop } from '../../util/noop'

type IconBuilder = (expanded: boolean) => ReactNode

export type ExpandableProps = PropsWithChildren<{
  label: ReactNode,
  icon?: IconBuilder,
  isExpanded?: boolean,
  onChange?: (isExpanded: boolean) => void,
  /**
   * Whether the expansion should only happen when the header is clicked or on the entire component
   */
  clickOnlyOnHeader?: boolean,
  disabled?: boolean,
  className?: string,
  headerClassName?: string,
  contentClassName?: string,
  contentExpandedClassName?: string,
}>


export type ExpansionIconProps = {
  isExpanded: boolean,
  className?: string,
}

export const ExpansionIcon = ({ isExpanded, className }: ExpansionIconProps) => {
  return (
    <ChevronDown
      className={clsx(
        'min-w-6 w-6 min-h-6 h-6 transition-transform duration-200 ease-in-out',
        { 'rotate-180': isExpanded },
        className
      )}
    />
  )
}


/**
 * A Component for showing and hiding content
 */
export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(function Expandable({
                                                                                            children,
                                                                                            label,
                                                                                            icon,
                                                                                            isExpanded = false,
                                                                                            onChange = noop,
                                                                                            clickOnlyOnHeader = true,
                                                                                            disabled = false,
                                                                                            className,
                                                                                            headerClassName,
                                                                                            contentClassName,
                                                                                            contentExpandedClassName,
                                                                                          }, ref) {
  const defaultIcon = useCallback((expanded: boolean) => <ExpansionIcon isExpanded={expanded}/>, [])
  icon ??= defaultIcon

  return (
    <div
      ref={ref}
      className={clsx('flex-col-0 bg-surface text-on-surface group rounded-lg shadow-sm', { 'cursor-pointer': !clickOnlyOnHeader && !disabled }, className)}
      onClick={() => !clickOnlyOnHeader && !disabled && onChange(!isExpanded)}
    >
      <div
        className={clsx(
          'flex-row-2 py-2 px-4 rounded-lg justify-between items-center bg-surface text-on-surface select-none',
          {
            'group-hover:brightness-97': !isExpanded,
            'hover:brightness-97': isExpanded && !disabled,
            'cursor-pointer': clickOnlyOnHeader && !disabled,
          },
          headerClassName
        )}
        onClick={() => clickOnlyOnHeader && !disabled && onChange(!isExpanded)}
      >
        {label}
        {icon(isExpanded)}
      </div>
      <div
        className={clsx(
          'flex-col-2 px-4 transition-all duration-300 ease-in-out',
          {
            [clsx('max-h-96 opacity-100 pb-2 overflow-y-auto', contentExpandedClassName)]: isExpanded,
            'max-h-0 opacity-0 overflow-hidden': !isExpanded,
          },
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  )
})

export const ExpandableUncontrolled = forwardRef<HTMLDivElement, ExpandableProps>(function ExpandableUncontrolled({
                                                                                                                    isExpanded,
                                                                                                                    onChange = noop,
                                                                                                                    ...props
                                                                                                                  },
                                                                                                                  ref) {
  const [usedIsExpanded, setUsedIsExpanded] = useState(isExpanded)

  useEffect(() => {
    setUsedIsExpanded(isExpanded)
  }, [isExpanded])

  return (
    <Expandable
      {...props}
      ref={ref}
      isExpanded={usedIsExpanded}
      onChange={value => {
        onChange(value)
        setUsedIsExpanded(value)
      }}
    />
  )
})
