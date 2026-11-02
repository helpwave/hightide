import clsx from 'clsx'
import type { SelectionListElementProps } from '../option'
import { ColoringUtils } from '../../../interaction'
import { useComboboxContext } from './ComboboxContext'

export type ComboboxListElementProps<T> = SelectionListElementProps<T>

export function ComboboxListItemElement<T>({
  option,
  optionRef,
  isHighlighted,
  isVisible,
}: ComboboxListElementProps<T>) {
  const context = useComboboxContext<T>()
  const disabled = Boolean(option.disabled) || context.isDisabled
  const interactable = !disabled && !context.isReadOnly
  const domId = context.config.ids.listbox + '-' + option.id

  return (
    <li
      ref={optionRef}
      id={domId}
      tabIndex={-1}
      hidden={!isVisible}
      role="option"
      aria-selected={isHighlighted}
      aria-disabled={disabled}
      aria-hidden={!isVisible}
      data-highlighted={isHighlighted ? '' : undefined}
      data-visible={isVisible ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      {...ColoringUtils.build({ color: 'surface-inverse', coloringStyle: 'foreground', mode: 'interactive' })}
      className={clsx('combobox-option', option.visual?.className)}
      style={option.visual?.style}
      onClick={() => {
        if (interactable) context.selectOption(option.id)
      }}
    >
      {option.visual?.content ?? option.label}
    </li>
  )
}
