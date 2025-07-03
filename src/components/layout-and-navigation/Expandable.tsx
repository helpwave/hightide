import type { PropsWithChildren, ReactNode } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
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

const DefaultIcon: IconBuilder = (expanded) => expanded ?
  (<ChevronUp className="min-w-4 w-4"/>)
  : (<ChevronDown className="min-w-4 w-4"/>)


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
  icon ??= DefaultIcon

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
      {isExpanded && (
        <div className={clsx('col px-4 pb-2', contentClassName)}>
          {children}
        </div>
      )}
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
