import type { InputHTMLAttributes, KeyboardEvent } from 'react'
import { forwardRef, useCallback } from 'react'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

import { TextInput } from '../input/TextInput'
import { useComboboxContext } from './ComboboxContext'
import clsx from 'clsx'

export type ComboboxInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(props, ref) {
    const translation = useHightideTranslation()
    const context = useComboboxContext()
    const { highlightNext, highlightPrevious, highlightFirst, highlightLast, highlightedId, selectOption } = context

    const {
      disabled,
      readOnly,
      required,
      onKeyDown,
      placeholder,
      className,
      ...inputProps
    } = props

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event)
        switch (event.key) {
        case 'ArrowDown':
          highlightNext()
          event.preventDefault()
          break
        case 'ArrowUp':
          highlightPrevious()
          event.preventDefault()
          break
        case 'Home':
          highlightFirst()
          event.preventDefault()
          break
        case 'End':
          highlightLast()
          event.preventDefault()
          break
        case 'Enter':
          if (highlightedId) {
            selectOption(highlightedId)
            event.preventDefault()
          }
          break
        default:
          break
        }
      },
      [onKeyDown, highlightedId, selectOption, highlightNext, highlightPrevious, highlightFirst, highlightLast]
    )

    return (
      <TextInput
        ref={ref}
        value={context.search.searchQuery}
        onValueChange={context.search.setSearchQuery}
        isInvalid={context.invalid}
        isDisabled={disabled ?? context.disabled}
        isReadOnly={readOnly ?? context.readOnly}
        isRequired={required ?? context.required}
        inputProps={{
          ...inputProps,
          'onKeyDown': handleKeyDown,
          'placeholder': placeholder ?? translation('search'),
          'role': 'combobox',
          'aria-expanded': context.visibleOptionIds.length > 0,
          'aria-controls': context.config.ids.listbox,
          'aria-activedescendant': context.highlightedId ?? undefined,
          'aria-autocomplete': 'list',
          'className': clsx('combobox-input', className),
        }}
      />
    )
  }
)
