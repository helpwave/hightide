import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import type { HTMLAttributes, ReactNode, RefObject } from 'react'
import { createContext, forwardRef, useContext, useEffect, useId, useRef } from 'react'
import type { MultiSelectIconAppearance } from './MultiSelectContext'
import { useMultiSelectContext } from './MultiSelectContext'

export type MultiSelectOptionDisplayLocation = 'trigger' | 'list';

export const MultiSelectOptionDisplayContext =
  createContext<MultiSelectOptionDisplayLocation | null>(null)

export function useMultiSelectOptionDisplayLocation(): MultiSelectOptionDisplayLocation {
  const context = useContext(MultiSelectOptionDisplayContext)
  if (!context) {
    throw new Error(
      'useMultiSelectOptionDisplayLocation must be used within a MultiSelectOptionDisplayContext'
    )
  }
  return context
}

export interface MultiSelectOptionProps<T = string> extends HTMLAttributes<HTMLLIElement> {
  value: T,
  label: string,
  disabled?: boolean,
  iconAppearance?: MultiSelectIconAppearance,
}

export const MultiSelectOption = forwardRef<
  HTMLLIElement,
  MultiSelectOptionProps<unknown>
>(function MultiSelectOption<T = string>(
  {
    children,
    label,
    value,
    disabled = false,
    iconAppearance,
    ...props
  }: MultiSelectOptionProps<T>,
  ref
) {
  const context = useMultiSelectContext<T>()
  const { registerOption } = context
  const itemRef = useRef<HTMLLIElement>(null)

  const display: ReactNode = children ?? label
  const iconAppearanceResolved = iconAppearance ?? context.config.iconAppearance

  const generatedId = useId()
  const optionId = props?.id ?? 'multi-select-option-' + generatedId

  useEffect(() => {
    return registerOption({
      id: optionId,
      value,
      label,
      display,
      disabled: Boolean(disabled),
      ref: itemRef as React.RefObject<HTMLElement>,
    })
  }, [optionId, value, label, disabled, registerOption, display])

  const isHighlighted = context.highlightedId === optionId
  const isSelected = context.selectedIds.includes(optionId)
  const isVisible = context.visibleOptionIds.includes(optionId)

  return (
    <li
      {...props}
      ref={(node) => {
        itemRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node
      }}
      id={optionId}
      hidden={!isVisible}
      role="option"
      aria-disabled={disabled}
      aria-selected={isSelected}
      aria-hidden={!isVisible}

      data-name="multi-select-list-option"
      data-highlighted={isHighlighted ? '' : undefined}
      data-selected={isSelected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-visible={isVisible ? '' : undefined}

      onClick={(event) => {
        if (!disabled) {
          context.toggleSelection(optionId)
          props.onClick?.(event)
        }
      }}
      onMouseEnter={(event) => {
        if (!disabled) {
          context.highlightItem(optionId)
          props.onMouseEnter?.(event)
        }
      }}
    >
      {iconAppearanceResolved === 'left' && (
        <CheckIcon
          className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
      <MultiSelectOptionDisplayContext.Provider value="list">
        {display}
      </MultiSelectOptionDisplayContext.Provider>
      {iconAppearanceResolved === 'right' && (
        <CheckIcon
          className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
    </li>
  )
})
