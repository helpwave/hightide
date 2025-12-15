import type { PropsWithChildren, ReactNode } from 'react'
import { forwardRef, useCallback, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

export type ExpansionIconProps = {
  isExpanded?: boolean,
  className?: string,
}

export const ExpansionIcon = ({ isExpanded, className }: ExpansionIconProps) => {
  return (
    <ChevronDown
      aria-hidden={true}
      className={clsx(
        'min-w-6 w-6 min-h-6 h-6 transition-transform motion-safe:duration-200 motion-reduce:duration-0 ease-in-out',
        { 'rotate-180': isExpanded },
        className
      )}
    />
  )
}

type IconBuilder = (expanded: boolean) => ReactNode

export type ExpandableProps = PropsWithChildren<{
  id?: string,
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

/**
 * A Component for showing and hiding content
 */
export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(function Expandable({
                                                                                            children,
                                                                                            id: providedId,
                                                                                            label,
                                                                                            icon,
                                                                                            isExpanded = false,
                                                                                            onChange,
                                                                                            clickOnlyOnHeader = true,
                                                                                            disabled = false,
                                                                                            className,
                                                                                            headerClassName,
                                                                                            contentClassName,
                                                                                            contentExpandedClassName,
                                                                                          }, ref) {

  const defaultIcon = useCallback((expanded: boolean) => <ExpansionIcon isExpanded={expanded}/>, [])
  icon ??= defaultIcon

  const generatedId = useId()
  const id = providedId ?? generatedId

  return (
    <div
      ref={ref}
      onClick={() => !clickOnlyOnHeader && !disabled && onChange?.(!isExpanded)}

      className={clsx(
        'flex-col-0 surface coloring-solid group rounded-lg shadow-sm',
        { 'cursor-pointer': !clickOnlyOnHeader && !disabled }, className
      )}
    >
      <button
        onClick={() => clickOnlyOnHeader && !disabled && onChange?.(!isExpanded)}

        className={clsx(
          'flex-row-2 py-2 px-4 rounded-lg justify-between items-center coloring-solid-hover select-none',
          {
            'group-hover:brightness-97': !isExpanded,
            'hover:brightness-97': isExpanded && !disabled,
            'cursor-pointer': clickOnlyOnHeader && !disabled,
          },
          headerClassName
        )}

        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
        aria-disabled={disabled ?? undefined}
      >
        {label}
        {icon(isExpanded)}
      </button>
      <div
        id={`${id}-content`}
        className={clsx(
          'flex-col-2 px-4 transition-all duration-300 ease-in-out',
          {
            [clsx('max-h-96 opacity-100 pb-2 overflow-y-auto', contentExpandedClassName)]: isExpanded,
            'max-h-0 opacity-0 overflow-hidden': !isExpanded,
          },
          contentClassName
        )}

        role="region"
      >
        {children}
      </div>
    </div>
  )
})

export const ExpandableUncontrolled = forwardRef<HTMLDivElement, ExpandableProps>(function ExpandableUncontrolled({
                                                                                                                    isExpanded,
                                                                                                                    onChange,
                                                                                                                    ...props
                                                                                                                  },
                                                                                                                  ref) {
  const [usedIsExpanded, setUsedIsExpanded] = useOverwritableState(isExpanded, onChange)

  return (
    <Expandable
      {...props}
      ref={ref}
      isExpanded={usedIsExpanded}
      onChange={setUsedIsExpanded}
    />
  )
})
