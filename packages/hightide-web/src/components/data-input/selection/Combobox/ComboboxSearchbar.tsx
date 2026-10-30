import type { ForwardedRef, InputHTMLAttributes, KeyboardEvent } from 'react'
import { forwardRef, useEffect } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInput } from '../../text/TextInput'
import { useComboboxContext } from './ComboboxContext'
import { useSelectionListKeyDown } from '../useSelectionListKeyDown'

export type ComboboxSearchbarProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>

export const ComboboxSearchbar = forwardRef<HTMLInputElement, ComboboxSearchbarProps>(
  function ComboboxSearchbar(props, ref: ForwardedRef<HTMLInputElement>) {
    const translation = useHightideTranslation()
    const context = useComboboxContext()
    const { setIds } = context.config
    const {
      id,
      disabled,
      readOnly,
      required,
      onKeyDown,
      onFocus,
      placeholder,
      className,
      ...inputProps
    } = props

    useEffect(() => {
      if (id) setIds((prev) => ({ ...prev, trigger: id }))
    }, [id, setIds])

    const keyHandler = useSelectionListKeyDown({
      isSearchVisible: true,
      highlightedId: context.highlightedId,
      highlightNext: context.highlightNext,
      highlightPrevious: context.highlightPrevious,
      highlightFirst: context.highlightFirst,
      highlightLast: context.highlightLast,
      onConfirm: context.selectOption,
      confirmOnSpace: false,
    })

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.key === 'Escape') {
        context.setIsOpen(false)
        event.preventDefault()
        return
      }
      keyHandler(event)
    }

    return (
      <TextInput
        id={context.config.ids.trigger}
        inputRef={ReactUtils.assingRefsBuilder([context.layout.searchbarRef, ref])}
        value={context.search.searchQuery}
        onValueChange={context.search.setSearchQuery}
        isInvalid={context.isInvalid}
        isDisabled={disabled ?? context.isDisabled}
        isReadOnly={readOnly ?? context.isReadOnly}
        isRequired={required ?? context.isRequired}
        inputProps={{
          ...inputProps,
          'id': context.config.ids.trigger,
          'onKeyDown': handleKeyDown,
          'onFocus': (event) => {
            onFocus?.(event)
            if (!context.isDisabled && !context.isReadOnly) context.setIsOpen(true)
          },
          'placeholder': placeholder ?? translation('search'),
          'role': 'combobox',
          'aria-expanded': context.isOpen,
          'aria-controls': context.config.ids.listbox,
          'aria-activedescendant': context.highlightedId
            ? context.config.ids.listbox + '-' + context.highlightedId
            : undefined,
          'aria-autocomplete': 'list',
          'className': clsx('combobox-input', className),
        }}
      />
    )
  }
)
