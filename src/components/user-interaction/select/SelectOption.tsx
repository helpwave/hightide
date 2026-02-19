import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import type { HTMLAttributes, ReactNode, RefObject } from 'react'
import { forwardRef, useContext, useEffect, useRef, createContext } from 'react'
import type { SelectIconAppearance } from './SelectContext'
import { useSelectContext } from './SelectContext'

export type SelectOptionDisplayLocation = 'trigger' | 'list'

export const SelectOptionDisplayContext = createContext<SelectOptionDisplayLocation | null>(null)

export function useSelectOptionDisplayLocation(): SelectOptionDisplayLocation {
  const context = useContext(SelectOptionDisplayContext)
  if (!context) {
    throw new Error('useSelectOptionDisplayLocation must be used within a SelectOptionDisplayContext')
  }
  return context
}

//
// SelectOption
//
export interface SelectOptionProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
  value: string,
  label: string,
  disabled?: boolean,
  iconAppearance?: SelectIconAppearance,
  children?: ReactNode,
}

export const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>(
  function SelectOption({ children, label, value, disabled = false, iconAppearance, className, ...restProps }, ref) {
    const { state, config, item, trigger } = useSelectContext()
    const { register, unregister, toggleSelection, highlightItem } = item
    const itemRef = useRef<HTMLLIElement>(null)

    iconAppearance ??= config.iconAppearance

    const display: ReactNode = children ?? label

    useEffect(() => {
      register({
        value,
        label,
        display,
        disabled,
        ref: itemRef,
      })
      return () => unregister(value)
    }, [value, label, disabled, register, unregister, display])

    const isHighlighted = state.highlightedValue === value
    const isSelected = state.value.includes(value)
    const isVisible = state.visibleOptions.some(opt => opt.value === value)

    return (
      <li
        {...restProps}
        ref={(node) => {
          itemRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node
        }}
        id={value}
        role="option"
        aria-disabled={disabled}
        aria-selected={isSelected}
        aria-hidden={!isVisible}
        data-highlighted={isHighlighted ? '' : undefined}
        data-selected={isSelected ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-visible={isVisible ? '' : undefined}
        className={clsx(
          'flex-row-1 items-center px-2 py-1 rounded-md',
          'data-highlighted:bg-primary/20',
          'data-disabled:text-disabled data-disabled:cursor-not-allowed',
          'not-data-disabled:cursor-pointer',
          !isVisible && 'hidden',
          className
        )}
        onClick={(event) => {
          if (!disabled) {
            toggleSelection(value)
            if (!config.isMultiSelect) {
              trigger.toggleOpen(false)
            }
            restProps.onClick?.(event)
          }
        }}
        onMouseEnter={(event) => {
          if (!disabled) {
            highlightItem(value)
            restProps.onMouseEnter?.(event)
          }
        }}
      >
        {iconAppearance === 'left' && (state.value.length > 0 || config.isMultiSelect) && (
          <CheckIcon
            className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
            aria-hidden={true}
          />
        )}
        <SelectOptionDisplayContext.Provider value="list">
          {display}
        </SelectOptionDisplayContext.Provider>
        {iconAppearance === 'right' && (state.value.length > 0 || config.isMultiSelect) && (
          <CheckIcon
            className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
            aria-hidden={true}
          />
        )}
      </li>
    )
  }
)

///
/// MultiSelectOption
///
export type MultiSelectOptionProps = SelectOptionProps

export const MultiSelectOption = SelectOption
