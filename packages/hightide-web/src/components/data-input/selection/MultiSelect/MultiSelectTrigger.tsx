import clsx from 'clsx'
import { X } from 'lucide-react'
import type React from 'react'
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useMultiSelectContext } from './MultiSelectContext'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ExpansionIcon } from '../../../visualization/ExpansionIcon'
import { IconButton } from '../../../interaction/IconButton'

export interface MultiSelectTriggerProps<T = string>
  extends ComponentPropsWithoutRef<'div'> {
  placeholder?: ReactNode,
  disabled?: boolean,
  selectedDisplay?: (values: T[]) => ReactNode,
  hideExpansionIcon?: boolean,
}

type MultiSelectTriggerComponent = <T = string>(
  props: MultiSelectTriggerProps<T> & {
    ref?: React.ForwardedRef<HTMLDivElement>,
  }
) => React.ReactElement

const MultiSelectTriggerImpl = forwardRef<
  HTMLDivElement,
  MultiSelectTriggerProps<unknown>
>(function MultiSelectTrigger<T>(
  {
    placeholder,
    disabled: disabledOverride,
    selectedDisplay,
    hideExpansionIcon = false,
    ...props
  }: MultiSelectTriggerProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const translation = useHightideTranslation()
  const context = useMultiSelectContext<T>()
  const disabled = !!disabledOverride || !!context.isDisabled
  const readOnly = !!context.isReadOnly
  const invalid = context.isInvalid
  const hasValue = context.value.length > 0
  const hasInteractions = !readOnly && !disabled
  const showClear = context.config.hasClearIcon && hasValue && hasInteractions
  const selectedOptions = context.selectedIds
    .map((id) => context.idToOptionMap[id])
    .filter(Boolean)

  return (
    <div
      ref={(element) => {
        context.layout.triggerRef.current = element
      }}
      className="multi-select-control"
    >
      <div
        {...props}
        ref={ref}
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
            break
          case 'ArrowDown':
            context.setIsOpen(true, 'first')
            event.preventDefault()
            break
          case 'ArrowUp':
            context.setIsOpen(true, 'last')
            event.preventDefault()
            break
          }
        }}
        className={clsx('multi-select-button input-element', props.className)}
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
        {hasValue
          ? selectedDisplay?.(context.value) ?? (
            <div className="flex flex-wrap gap-x-1 gap-y-2">
              {selectedOptions.map((opt, index) => (
                <span key={opt.id}>
                  {opt.visual?.content ?? opt.label}
                  {index < selectedOptions.length - 1 && <span>,</span>}
                </span>
              ))}
            </div>
          )
          : placeholder ?? translation('clickToSelect')}
        {!hideExpansionIcon && <ExpansionIcon isExpanded={context.isOpen} size="md" />}
      </div>
      {showClear && (
        <IconButton
          className="multi-select-clear"
          tooltip={translation('clearValue')}
          variant="foreground"
          color="neutral"
          size="sm"
          icon={X}
          onMouseDown={(event) => {
            event.preventDefault()
          }}
          onClick={(event) => {
            event.stopPropagation()
            context.clear()
          }}
        />
      )}
    </div>
  )
})

export const MultiSelectTrigger =
  MultiSelectTriggerImpl as MultiSelectTriggerComponent
