import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import type { SelectOptionType } from './SelectContext'
import { useSelectContext } from './SelectContext'
import { useHightideTranslation } from '@helpwave/hightide-utils'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { SelectOptionDisplayContext } from './SelectOption'
import { ReactUtils } from '@helpwave/hightide-utils'

export interface SelectButtonProps<T = string> extends ComponentPropsWithoutRef<'div'> {
  'placeholder'?: ReactNode,
  'disabled'?: boolean,
  'selectedDisplay'?: (value: SelectOptionType<T> | null) => ReactNode,
  'hideExpansionIcon'?: boolean,
  'data-name'?: string,
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
    ref: ForwardedRef<HTMLDivElement>
  ) {
    const translation = useHightideTranslation()
    const context = useSelectContext<T>()
    const { config, layout } = context
    const { setIds } = config
    const { registerTrigger } = layout

    useEffect(() => {
      if (id) setIds((prev) => ({ ...prev, trigger: id }))
    }, [id, setIds])

    const innerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const unregister = registerTrigger(innerRef)
      return () => unregister()
    }, [registerTrigger])

    const disabled = !!disabledOverride || !!context.disabled
    const readOnly = !!context.readOnly
    const invalid = context.invalid
    const hasValue = context.selectedId !== null
    const hasInteractions = !readOnly && !disabled
    const selectedOption = context.selectedId ? (context.idToOptionMap[context.selectedId] ?? null) : null

    return (
      <div
        {...props}
        ref={ReactUtils.assingRefsBuilder([innerRef, ref])}
        id={context.config.ids.trigger}
        onClick={(event) => {
          if (!hasInteractions) return
          props.onClick?.(event)
          context.toggleIsOpen()
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event)
          if (!hasInteractions) return
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
        data-readonly={readOnly ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-invalid={invalid}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        aria-haspopup="dialog"
        aria-expanded={context.isOpen}
        aria-controls={context.isOpen ? context.config.ids.content : undefined}
      >
        <SelectOptionDisplayContext.Provider value="trigger">
          {hasValue
            ? selectedDisplay?.(selectedOption) ?? (selectedOption?.display)
            : placeholder ?? translation('clickToSelect')}
        </SelectOptionDisplayContext.Provider>
        {!hideExpansionIcon && <ExpansionIcon isExpanded={context.isOpen} />}
      </div>
    )
  }
)
