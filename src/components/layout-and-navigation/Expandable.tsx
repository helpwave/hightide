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
}>


export type ExpansionIconProps = {
  isExpanded: boolean,
  className?: string,
}

export const ExpansionIcon = ({ isExpanded, className }: ExpansionIconProps) => {
  return (
    <ChevronDown
      className={clsx(
        'min-w-4 w-4 min-h-4 h-4 transition-transform duration-200 ease-in-out',
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
                                                                                          }, ref) {
  const defaultIcon = useCallback((expanded: boolean) => <ExpansionIcon isExpanded={expanded}/>, [])
  icon ??= defaultIcon

  return (
    <div
      ref={ref}
      className={clsx('col gap-y-0 bg-surface text-on-surface group rounded-lg shadow-sm', { 'cursor-pointer': !clickOnlyOnHeader && !disabled }, className)}
      onClick={() => !clickOnlyOnHeader && !disabled && onChange(!isExpanded)}
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
        onClick={() => clickOnlyOnHeader && !disabled && onChange(!isExpanded)}
      >
        {label}
        {icon(isExpanded)}
      </div>
      <div
        className={clsx(
          'col px-4 transition-all duration-300 ease-in-out',
          {
            'max-h-96 opacity-100 pb-2': isExpanded,
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
