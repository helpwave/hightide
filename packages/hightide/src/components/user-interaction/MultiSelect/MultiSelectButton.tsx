import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { useMultiSelectContext } from './MultiSelectContext'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { ExpansionIcon } from '@/src/components/display-and-visualization/ExpansionIcon'
import { MultiSelectOptionDisplayContext } from './MultiSelectOption'
import { ReactRefsUtil } from '@/src/utils/reactRefs'

export interface MultiSelectButtonProps<T = string>
  extends ComponentPropsWithoutRef<'div'> {
  'placeholder'?: ReactNode,
  'disabled'?: boolean,
  'selectedDisplay'?: (values: T[]) => ReactNode,
  'hideExpansionIcon'?: boolean,
  'data-name'?: string,
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
  ref: ForwardedRef<HTMLDivElement>
) {
  const translation = useHightideTranslation()
  const context = useMultiSelectContext<T>()
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
  const hasValue = context.value.length > 0
  const hasInteractions = !readOnly && !disabled
  const selectedOptions = context.selectedIds
    .map((id) => context.idToOptionMap[id])
    .filter(Boolean)

  return (
    <div
      {...props}
      ref={ReactRefsUtil.assingRefsBuilder([innerRef, ref])}
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
      data-name={props['data-name'] ?? 'multi-select-button'}
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
