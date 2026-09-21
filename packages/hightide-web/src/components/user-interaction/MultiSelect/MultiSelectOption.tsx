import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import type React from 'react'
import type { ForwardedRef, HTMLAttributes, RefObject } from 'react'
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef } from 'react'
import type { MultiSelectIconAppearance, MultiSelectOptionIdentity } from './MultiSelectContext'
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

export type MultiSelectOptionProps<T = string> = (
  T extends string
    ? {
        valueId?: undefined,
        value: T,
        label?: string,
      }
    : {
        valueId: string,
        value: T,
        label: string,
      }
) & Omit<HTMLAttributes<HTMLLIElement>, 'value' | 'valueId'> & {
  disabled?: boolean,
  iconAppearance?: MultiSelectIconAppearance,
}

type MultiSelectOptionComponent = <T = string>(
  props: MultiSelectOptionProps<T> & {
    ref?: React.ForwardedRef<HTMLLIElement>,
  }
) => React.ReactElement | null

const toIdentity = <T,>(value: T, valueId: string | undefined): MultiSelectOptionIdentity<T> => {
  if (valueId === undefined) {
    return { value, id: value as string }
  }
  return { value, id: valueId }
}

const MultiSelectOptionImpl = forwardRef<
  HTMLLIElement,
  MultiSelectOptionProps<unknown>
>(function MultiSelectOption<T>(
  {
    children,
    label,
    value,
    valueId,
    disabled = false,
    iconAppearance,
    ...props
  }: MultiSelectOptionProps<T>,
  ref: ForwardedRef<HTMLLIElement>
) {
  const context = useMultiSelectContext<T>()
  const { registerOption } = context
  const itemRef = useRef<HTMLLIElement>(null)
  const identity = useMemo(() => toIdentity<T>(value, valueId), [value, valueId])
  const resolvedLabel = valueId === undefined ? (label ?? (value as string)) : label
  const display = children ?? resolvedLabel
  const iconAppearanceResolved = iconAppearance ?? context.config.iconAppearance
  const optionId = identity.id

  useEffect(() => {
    return registerOption({
      value: identity,
      label: resolvedLabel,
      display,
      disabled: Boolean(disabled),
      ref: itemRef as React.RefObject<HTMLElement>,
    })
  }, [disabled, display, identity, registerOption, resolvedLabel])

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

export const MultiSelectOption = MultiSelectOptionImpl as MultiSelectOptionComponent
