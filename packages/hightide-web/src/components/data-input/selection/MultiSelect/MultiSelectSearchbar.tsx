import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInput, type TextInputProps } from '../../text/TextInput'
import { useMultiSelectContext } from './MultiSelectContext'
import { useSelectionListKeyDown } from '../useSelectionListKeyDown'

export type MultiSelectSearchbarProps = Omit<TextInputProps, 'value' | 'onValueChange'>

export const MultiSelectSearchbar = forwardRef<HTMLInputElement, MultiSelectSearchbarProps>(function MultiSelectSearchbar(
  props,
  ref: ForwardedRef<HTMLInputElement>
) {
  const translation = useHightideTranslation()
  const context = useMultiSelectContext()
  const showSearch = context.search.hasSearch
  const keyHandler = useSelectionListKeyDown({
    isSearchVisible: showSearch,
    highlightedId: context.highlightedId,
    highlightNext: context.highlightNext,
    highlightPrevious: context.highlightPrevious,
    highlightFirst: context.highlightFirst,
    highlightLast: context.highlightLast,
    onConfirm: context.toggleSelection,
    onTypeahead: context.handleTypeaheadKey,
    confirmOnSpace: true,
  })

  if (!showSearch) return null

  return (
    <TextInput
      value={context.search.searchQuery ?? ''}
      onValueChange={context.search.setSearchQuery}
      isInvalid={props.isInvalid}
      isDisabled={props.isDisabled}
      isReadOnly={props.isReadOnly}
      isRequired={props.isRequired}
      initialValue={props.initialValue}
      onStateEvent={props.onStateEvent}
      inputRef={ReactUtils.assingRefsBuilder([ref, props.inputRef])}
      inputProps={{
        ...props.inputProps,
        'id': context.config.ids.searchInput,
        'onKeyDown': (event) => {
          props.inputProps?.onKeyDown?.(event)
          keyHandler(event)
        },
        'placeholder': props.inputProps?.placeholder ?? translation('filterOptions'),
        'role': 'combobox',
        'aria-autocomplete': 'list',
        'aria-expanded': context.isOpen,
        'aria-controls': context.config.ids.listbox,
        'aria-activedescendant': context.highlightedId
          ? context.config.ids.listbox + '-' + context.highlightedId
          : undefined,
        'aria-label': props.inputProps?.['aria-label'] ?? translation('filterOptions'),
        'className': clsx('mx-2 mt-2 shrink-0', props.inputProps?.className),
      }}
    />
  )
})
