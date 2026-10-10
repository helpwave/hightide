import type { ForwardedRef } from 'react'
import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { useSelectContext } from './SelectContext'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { PopUp, type PopUpProps } from '../../layout/PopUp/PopUp'
import { TextInput, type TextInputProps } from '../input/TextInput'
import { Visibility } from '../../layout/Visibility'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

export interface SelectContentProps extends PopUpProps {
  searchInputProps?: Omit<TextInputProps, 'value' | 'onValueChange'>,
}

export const SelectContent = forwardRef<HTMLUListElement, SelectContentProps>(function SelectContent<T>({
  id, options, searchInputProps, ...props
}: SelectContentProps, ref: ForwardedRef<HTMLUListElement>) {
  const translation = useHightideTranslation()
  const innerRef = useRef<HTMLUListElement>(null)

  const context = useSelectContext<T>()
  const { config, handleTypeaheadKey, toggleSelection, highlightNext, highlightPrevious, highlightFirst, highlightLast, highlightedId } = context
  const { setIds } = config

  useEffect(() => {
    if (id) setIds((prev) => ({ ...prev, content: id }))
  }, [id, setIds])

  const showSearch = context.search.hasSearch
  const listboxAriaLabel = showSearch ? translation('searchResults') : undefined

  const keyHandler = useCallback(
    (event: React.KeyboardEvent) => {
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
        event.preventDefault()
        highlightFirst()
        break
      case 'End':
        event.preventDefault()
        highlightLast()
        break
      case 'Enter':
      case ' ':
        if (showSearch && event.key === ' ') return
        if (highlightedId) {
          toggleSelection(highlightedId)
          event.preventDefault()
        }
        break
      default:
        if (!showSearch && !event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
          handleTypeaheadKey(event.key)
          event.preventDefault()
        }
        break
      }
    },
    [showSearch, handleTypeaheadKey, toggleSelection, highlightedId, highlightNext, highlightPrevious, highlightFirst, highlightLast]
  )

  return (
    <PopUp
      {...props}
      id={context.config.ids.content}
      isOpen={context.isOpen}
      anchor={context.layout.triggerRef}
      options={options}
      forceMount={true}
      onClose={() => {
        context.setIsOpen(false)
        props.onClose?.()
      }}
      aria-labelledby={context.config.ids.trigger}
      className={clsx('select-content', props.className)}
    >
      {showSearch && (
        <TextInput
          value={context.search.searchQuery}
          onValueChange={context.search.setSearchQuery}
          isInvalid={searchInputProps?.isInvalid}
          isDisabled={searchInputProps?.isDisabled}
          isReadOnly={searchInputProps?.isReadOnly}
          isRequired={searchInputProps?.isRequired}
          initialValue={searchInputProps?.initialValue}
          onStateEvent={searchInputProps?.onStateEvent}
          inputRef={searchInputProps?.inputRef}
          inputProps={{
            ...searchInputProps?.inputProps,
            'id': context.config.ids.searchInput,
            'onKeyDown': (event) => {
              searchInputProps?.inputProps?.onKeyDown?.(event)
              keyHandler(event)
            },
            'placeholder': searchInputProps?.inputProps?.placeholder ?? translation('filterOptions'),
            'role': 'combobox',
            'aria-autocomplete': 'list',
            'aria-expanded': context.isOpen,
            'aria-controls': context.config.ids.listbox,
            'aria-activedescendant': context.highlightedId
              ? context.config.ids.listbox + '-' + context.highlightedId
              : undefined,
            'aria-label': searchInputProps?.inputProps?.['aria-label'] ?? translation('filterOptions'),
            'className': clsx('mx-2 mt-2 shrink-0', searchInputProps?.inputProps?.className),
          }}
        />
      )}
      <ul
        ref={ReactUtils.assingRefsBuilder([innerRef, ref])}
        id={context.config.ids.listbox}
        onKeyDown={showSearch ? undefined : keyHandler}
        role="listbox"
        aria-multiselectable={false}
        aria-orientation="vertical"
        aria-label={listboxAriaLabel}
        tabIndex={showSearch ? undefined : 0}
        className={clsx('flex-col-1 p-2 overflow-auto')}
      >
        {props.children}
        <Visibility isVisible={showSearch}>
          <li
            role="option"
            aria-selected={false}
            aria-disabled={true}
            aria-live="polite"
            aria-atomic={true}
            className={clsx('select-list-status', { 'sr-only': context.visibleOptionIds.length > 0 })}
          >
            {translation('nResultsFound', { count: context.visibleOptionIds.length })}
          </li>
        </Visibility>
      </ul>
    </PopUp>
  )
})
