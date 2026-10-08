import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { useMultiSelectContext } from './MultiSelectContext'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { PopUp, type PopUpProps } from '../../layout/PopUp/PopUp'
import { TextInput } from '../input/TextInput'
import { Visibility } from '../../layout/Visibility'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

export interface MultiSelectContentProps extends PopUpProps {
  searchInputProps?: Omit<ComponentProps<typeof TextInput>, 'value' | 'onValueChange'>,
}

export const MultiSelectContent = forwardRef<
  HTMLUListElement,
  MultiSelectContentProps
>(function MultiSelectContent<T>(
  { id, options, searchInputProps, ...props }: MultiSelectContentProps,
  ref: ForwardedRef<HTMLUListElement>
) {
  const translation = useHightideTranslation()
  const innerRef = useRef<HTMLUListElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const context = useMultiSelectContext<T>()
  const { config, highlightNext, highlightPrevious, highlightFirst, highlightLast, highlightedId, handleTypeaheadKey, toggleSelection } = context
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
        if (
          !showSearch &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey &&
            event.key.length === 1
        ) {
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
      className={clsx('multi-select-content', props.className)}
    >
      {showSearch && (
        <TextInput
          {...searchInputProps}
          ref={searchInputRef}
          id={context.config.ids.searchInput}
          value={context.search.searchQuery ?? ''}
          onValueUpdate={context.search.setSearchQuery}
          onKeyDown={keyHandler}
          placeholder={searchInputProps?.placeholder ?? translation('filterOptions')}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={context.isOpen}
          aria-controls={context.config.ids.listbox}
          aria-activedescendant={
            context.highlightedId ? context.highlightedId : undefined
          }
          aria-label={searchInputProps?.['aria-label'] ?? translation('filterOptions')}
          className={clsx('mx-2 mt-2 shrink-0', searchInputProps?.className)}
        />
      )}
      <ul
        ref={ReactUtils.assingRefsBuilder([innerRef, ref])}
        id={context.config.ids.listbox}
        onKeyDown={showSearch ? undefined : keyHandler}
        role="listbox"
        aria-multiselectable={true}
        aria-orientation="vertical"
        aria-label={listboxAriaLabel}
        tabIndex={showSearch ? undefined : 0}
        className="multi-select-list flex-col-1 p-2 overflow-auto"
      >
        {props.children}
        <Visibility isVisible={showSearch}>
          <li
            role="option"
            aria-selected={false}
            aria-disabled={true}
            aria-live="polite"
            aria-atomic={true}
            className={clsx('multi-select-list-status', {
              'sr-only': context.visibleOptionIds.length > 0,
            })}
          >
            {translation('nResultsFound', {
              count: context.visibleOptionIds.length,
            })}
          </li>
        </Visibility>
      </ul>
    </PopUp>
  )
})
