import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { SelectOptionType } from './SelectContext'
import { useSelectContext } from './SelectContext'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { SelectOptionDisplayContext } from './SelectOption'

export interface SelectButtonProps<T = string> extends ComponentPropsWithoutRef<'div'> {
  placeholder?: ReactNode,
  disabled?: boolean,
  selectedDisplay?: (value: SelectOptionType<T> | null) => ReactNode,
  hideExpansionIcon?: boolean,
}

export const SelectButton = forwardRef<HTMLDivElement, SelectButtonProps<unknown>>(
  function SelectButton<T>(
    {
      id,
      placeholder,
      disabled: disabledOverride,
      selectedDisplay,
      hideExpansionIcon = false,
      ...props
    }: SelectButtonProps<T>,
    ref
  ) {
    const translation = useHightideTranslation()
    const context = useSelectContext<T>()
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
    const hasValue = context.selectedId !== null
    const selectedOption = context.idToOptionMap[context.selectedId] ?? null

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
        data-name={props['data-name'] ?? 'select-button'}
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
        <SelectOptionDisplayContext.Provider value="trigger">
          {hasValue
            ? selectedDisplay?.(selectedOption) ?? (selectedOption.display)
            : placeholder ?? translation('clickToSelect')}
        </SelectOptionDisplayContext.Provider>
        {!hideExpansionIcon && <ExpansionIcon isExpanded={context.isOpen} />}
      </div>
    )
  }
)
