import type { ForwardedRef, HTMLAttributes, ReactNode, RefObject } from 'react'
import { forwardRef, useEffect, useId, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useComboboxContext } from './ComboboxContext'
import { ColoringUtils } from '../../interaction'

export interface ComboboxOptionProps<T = string> extends HTMLAttributes<HTMLLIElement> {
  value: T,
  label: string,
  disabled?: boolean,
}

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps<unknown>>(function ComboboxOption<T = string>({
  children,
  value,
  label,
  disabled: disabledOverwrite = false,
  id: idProp,
  className,
  ...restProps
} : ComboboxOptionProps<T>, ref: ForwardedRef<HTMLLIElement>) {
  const context = useComboboxContext<T>()
  const { registerOption } = context
  const itemRef = useRef<HTMLLIElement>(null)
  const generatedId = useId()
  const optionId = idProp ?? `combobox-option-${generatedId}`

  const resolvedDisplay: ReactNode = children ?? label

  const disabled = useMemo(() =>
    disabledOverwrite ?? context.disabled,
  [context.disabled, disabledOverwrite])

  const interactable = useMemo(() =>
    !disabled && !context.readOnly,
  [context.readOnly, disabled])

  useEffect(() => {
    return registerOption({
      id: optionId,
      value,
      label,
      display: resolvedDisplay,
      disabled,
      ref: itemRef as React.RefObject<HTMLElement>,
    })
  }, [optionId, value, label, resolvedDisplay, disabled, registerOption])

  useEffect(() => {
    if (context.highlightedId === optionId) {
      itemRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' })
    }
  }, [context.highlightedId, optionId])

  const isVisible = context.visibleOptionIds.includes(optionId)
  const isHighlighted = context.highlightedId === optionId

  return (
    <li
      {...restProps}
      ref={(node) => {
        itemRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as RefObject<HTMLLIElement | null>).current = node
      }}
      id={optionId}
      hidden={!isVisible}

      role="option"
      aria-selected={isHighlighted}
      aria-disabled={disabled}
      aria-hidden={!isVisible}

      data-highlighted={isHighlighted ? '' : undefined}
      data-visible={isVisible ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...ColoringUtils.build({ color: 'surface-inverse', coloringStyle: 'foreground', mode: 'interactive' })}
      className={clsx('combobox-option', !isVisible && 'hidden', className)}
      onClick={(event) => {
        if (!interactable) {
          context.selectOption(optionId)
          restProps.onClick?.(event)
        }
      }}
      onMouseEnter={(event) => {
        if (!interactable) {
          context.highlightItem(optionId)
          restProps.onMouseEnter?.(event)
        }
      }}>
      {resolvedDisplay}
    </li>
  )
})

ComboboxOption.displayName = 'ComboboxOption'
