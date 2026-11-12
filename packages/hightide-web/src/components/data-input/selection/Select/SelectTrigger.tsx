import clsx from 'clsx'
import { X } from 'lucide-react'
import type React from 'react'
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import type { SelectOptionData } from './SelectContext'
import { useSelectContext } from './SelectContext'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ExpansionIcon } from '../../../visualization/ExpansionIcon'
import { IconButton } from '../../../interaction/IconButton'
import { ColoringUtils } from '../../../../utils/coloring'

export interface SelectTriggerProps<T = string> extends Omit<ComponentPropsWithoutRef<'button'>, 'value'> {
  placeholder?: ReactNode,
  disabled?: boolean,
  selectedDisplay?: (value: SelectOptionData<T> | null) => ReactNode,
  hideExpansionIcon?: boolean,
  appearance?: 'input' | 'text',
}

type SelectTriggerComponent = <T = string>(
  props: SelectTriggerProps<T> & {
    ref?: React.ForwardedRef<HTMLButtonElement>,
  }
) => React.ReactElement

const SelectTriggerImpl = forwardRef<
  HTMLButtonElement,
  SelectTriggerProps<unknown>
>(function SelectTrigger<T>(
  {
    placeholder,
    disabled: disabledOverride,
    selectedDisplay,
    hideExpansionIcon = false,
    appearance = 'input',
    className,
    ...props
  }: SelectTriggerProps<T>,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const translation = useHightideTranslation()
  const context = useSelectContext<T>()
  const { layout } = context
  const { registerTrigger } = layout

  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const unregister = registerTrigger(anchorRef)
    return () => unregister()
  }, [registerTrigger])

  const disabled = !!disabledOverride || !!context.isDisabled
  const readOnly = !!context.isReadOnly
  const invalid = context.isInvalid
  const hasValue = context.selectedId !== null
  const hasInteractions = !readOnly && !disabled
  const showClear = context.config.hasClearIcon && hasValue && hasInteractions
  const selectedOption = context.selectedId ? (context.idToOptionMap[context.selectedId] ?? null) : null

  return (
    <div
      ref={anchorRef}
      className="select-control"
    >
      <button
        {...props}
        ref={ref}
        type="button"
        id={context.config.ids.trigger}
        disabled={disabled}
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
        className={clsx(
          'select-button',
          appearance === 'text' ? 'pressable w-fit' : 'input-element',
          className
        )}
        data-appearance={appearance}
        data-size={appearance === 'text' ? 'sm' : undefined}
        {...(appearance === 'text' ? ColoringUtils.build({
          color: 'surface-inverse',
          mode: 'interactive',
          coloringStyle: 'foreground',
        }) : {})}
        data-value={hasValue ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        aria-invalid={invalid}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        aria-haspopup="dialog"
        aria-expanded={context.isOpen}
        aria-controls={context.isOpen ? context.config.ids.content : undefined}
      >
        {hasValue
          ? selectedDisplay?.(selectedOption) ?? selectedOption?.visual?.content ?? selectedOption?.label
          : placeholder ?? translation('clickToSelect')}
        {!hideExpansionIcon && <ExpansionIcon isExpanded={context.isOpen} size="md" />}
      </button>
      {showClear && (
        <IconButton
          className="select-clear"
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

export const SelectTrigger = SelectTriggerImpl as SelectTriggerComponent
