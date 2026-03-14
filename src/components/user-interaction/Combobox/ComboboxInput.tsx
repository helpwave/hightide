import { type ComponentProps, forwardRef, useCallback } from 'react'
import { Input } from '@/src/components/user-interaction/input/Input'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { useComboboxContext } from './ComboboxContext'

export type ComboboxInputProps = Omit<ComponentProps<typeof Input>, 'value'>

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(props, ref) {
    const translation = useHightideTranslation()
    const context = useComboboxContext()
    const { highlightNext, highlightPrevious, highlightFirst, highlightLast, highlightedId, selectOption } = context

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(event)
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
      [props, highlightedId, selectOption, highlightNext, highlightPrevious, highlightFirst, highlightLast]
    )

    return (
      <Input
        {...props}
        ref={ref}
        value={context.search.searchQuery}
        onValueChange={context.search.setSearchQuery}
        onKeyDown={handleKeyDown}
        placeholder={props.placeholder ?? translation('search')}
        role="combobox"
        aria-expanded={context.visibleOptionIds.length > 0}
        aria-controls={context.config.ids.listbox}
        aria-activedescendant={context.highlightedId ?? undefined}
        aria-autocomplete="list"
      />
    )
  }
)
