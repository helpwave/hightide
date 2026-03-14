import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useMultiSelectContext } from './MultiSelectContext'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { MultiSelectOptionDisplayContext } from './MultiSelectOption'

export interface MultiSelectButtonProps<T = string>
  extends ComponentPropsWithoutRef<'div'> {
  placeholder?: ReactNode,
  disabled?: boolean,
  selectedDisplay?: (values: T[]) => ReactNode,
  hideExpansionIcon?: boolean,
}

export const MultiSelectButton = forwardRef<
  HTMLDivElement,
  MultiSelectButtonProps<unknown>
>(function MultiSelectButton<T>(
  {
    id,
    placeholder,
    disabled: disabledOverride,
    selectedDisplay,
    hideExpansionIcon = false,
    ...props
  }: MultiSelectButtonProps<T>,
  ref
) {
  const translation = useHightideTranslation()
  const context = useMultiSelectContext<T>()
  const { config, layout } = context
  const { setIds } = config
  const { registerTrigger } = layout

  useEffect(() => {
    if (id) setIds((prev) => ({ ...prev, trigger: id }))
  }, [id, setIds])

  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => innerRef.current!)

  useEffect(() => {
    const unregister = registerTrigger(innerRef)
    return () => unregister()
  }, [registerTrigger])

  const disabled = !!disabledOverride || !!context.disabled
  const invalid = context.invalid
  const hasValue = context.value.length > 0
  const selectedOptions = context.selectedIds
    .map((id) => context.idToOptionMap[id])
    .filter(Boolean)

  return (
    <div
      {...props}
      ref={innerRef}
      id={context.config.ids.trigger}
      onClick={(event) => {
        props.onClick?.(event)
        context.toggleIsOpen()
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (disabled) return
        switch (event.key) {
        case 'Enter':
        case ' ':
          context.toggleIsOpen()
          event.preventDefault()
          event.stopPropagation()
          break
        case 'ArrowDown':
          context.setIsOpen(true, 'first')
          event.preventDefault()
          event.stopPropagation()
          break
        case 'ArrowUp':
          context.setIsOpen(true, 'last')
          event.preventDefault()
          event.stopPropagation()
          break
        }
      }}
      data-name={props['data-name'] ?? 'multi-select-button'}
      data-value={hasValue ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-invalid={invalid}
      aria-disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={context.isOpen}
      aria-controls={context.isOpen ? context.config.ids.content : undefined}
    >
      <MultiSelectOptionDisplayContext.Provider value="trigger">
        {hasValue
          ? selectedDisplay?.(context.value) ?? (
            <div className="flex flex-wrap gap-x-1 gap-y-2">
              {selectedOptions.map((opt, index) => (
                <span key={opt.id}>
                  {opt.display}
                  {index < selectedOptions.length - 1 && <span>,</span>}
                </span>
              ))}
            </div>
          )
          : placeholder ?? translation('clickToSelect')}
      </MultiSelectOptionDisplayContext.Provider>
      {!hideExpansionIcon && <ExpansionIcon isExpanded={context.isOpen} />}
    </div>
  )
})
