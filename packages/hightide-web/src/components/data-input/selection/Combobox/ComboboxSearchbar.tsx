import type { ForwardedRef, InputHTMLAttributes, KeyboardEvent } from 'react'
import { forwardRef, useEffect } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { IconButton } from '../../../interaction/IconButton'
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

    const isDisabled = disabled ?? context.isDisabled
    const isReadOnly = readOnly ?? context.isReadOnly
    const showClear = context.config.hasClearIcon && !isDisabled && !isReadOnly && (context.search.searchQuery.length > 0 || context.value !== null)

    return (
      <div className="combobox-control">
        <TextInput
          id={context.config.ids.trigger}
          inputRef={ReactUtils.assingRefsBuilder([context.layout.searchbarRef, ref])}
          value={context.search.searchQuery}
          onValueChange={context.search.setSearchQuery}
          isInvalid={context.isInvalid}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
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
            'aria-expanded': context.config.isInline || context.isOpen,
            'aria-controls': context.config.ids.listbox,
            'aria-activedescendant': context.highlightedId
              ? context.config.ids.listbox + '-' + context.highlightedId
              : undefined,
            'aria-autocomplete': 'list',
            'className': clsx('combobox-input', className),
          }}
        />
        {showClear && (
          <IconButton
            className="combobox-clear"
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
  }
)
