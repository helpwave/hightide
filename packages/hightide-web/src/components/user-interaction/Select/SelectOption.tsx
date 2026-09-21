import clsx from 'clsx'
import { CheckIcon } from 'lucide-react'
import type React from 'react'
import type { ForwardedRef, HTMLAttributes, RefObject } from 'react'
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef } from 'react'
import type { SelectIconAppearance, SelectOptionIdentity } from './SelectContext'
import { useSelectContext } from './SelectContext'

export type SelectOptionDisplayLocation = 'trigger' | 'list';

export const SelectOptionDisplayContext = createContext<SelectOptionDisplayLocation | null>(null)

export function useSelectOptionDisplayLocation(): SelectOptionDisplayLocation {
  const context = useContext(SelectOptionDisplayContext)
  if (!context) {
    throw new Error('useSelectOptionDisplayLocation must be used within a SelectOptionDisplayContext')
  }
  return context
}

export type SelectOptionProps<T = string> = (
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
  iconAppearance?: SelectIconAppearance,
}

type SelectOptionComponent = <T = string>(
  props: SelectOptionProps<T> & {
    ref?: React.ForwardedRef<HTMLLIElement>,
  }
) => React.ReactElement | null

const toIdentity = <T,>(value: T, valueId: string | undefined): SelectOptionIdentity<T> => {
  if (valueId === undefined) {
    return { value, id: value as string }
  }
  return { value, id: valueId }
}

const SelectOptionImpl = forwardRef<
  HTMLLIElement,
  SelectOptionProps<unknown>
>(function SelectOption<T>(
  {
    children,
    label,
    value,
    valueId,
    disabled = false,
    iconAppearance,
    ...props
  }: SelectOptionProps<T>,
  ref: ForwardedRef<HTMLLIElement>
) {
  const context = useSelectContext<T>()
  const { registerOption } = context
  const itemRef = useRef<HTMLLIElement>(null)
  const identity = useMemo(() => toIdentity<T>(value, valueId), [value, valueId])
  const resolvedLabel: string = valueId === undefined ? (label ?? (value as string)) : label
  const display = children ?? resolvedLabel
  const iconAppearanceResolved = iconAppearance ?? context.config.iconAppearance
  const optionId = identity.id

  useEffect(() => {
    return registerOption({
      value: identity,
      label: resolvedLabel,
      display,
      disabled,
      ref: itemRef as React.RefObject<HTMLElement>,
    })
  }, [disabled, display, identity, registerOption, resolvedLabel])

  const isHighlighted = context.highlightedId === optionId
  const isSelected = context.selectedId === optionId
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

      data-name="select-list-option"
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
      {iconAppearanceResolved === 'left' && context.selectedId !== null && (
        <CheckIcon
          className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
      <SelectOptionDisplayContext.Provider value="list">{display}</SelectOptionDisplayContext.Provider>
      {iconAppearanceResolved === 'right' && context.selectedId !== null && (
        <CheckIcon
          className={clsx('w-4 h-4', { 'opacity-0': !isSelected || disabled })}
          aria-hidden={true}
        />
      )}
    </li>
  )
})

export const SelectOption = SelectOptionImpl as SelectOptionComponent
