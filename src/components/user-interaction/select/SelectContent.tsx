import type { ComponentProps } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useSelectContext } from './SelectContext'
import clsx from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { PopUp, type PopUpProps } from '@/src/components/layout/popup/PopUp'
import { Input } from '@/src/components/user-interaction/input/Input'
import { Visibility } from '../../layout/Visibility'

export interface SelectContentProps extends PopUpProps {
  showSearch?: boolean,
  searchInputProps?: Omit<ComponentProps<typeof Input>, 'value' | 'onValueChange'>,
}

export const SelectContent = forwardRef<HTMLUListElement, SelectContentProps>(function SelectContent({
  id,
  options,
  showSearch: showSearchOverride,
  searchInputProps,
  ...props
}, ref) {
  const translation = useHightideTranslation()
  const innerRef = useRef<HTMLUListElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => innerRef.current)

  const { trigger, state, config, item, ids, setIds, search } = useSelectContext()

  useEffect(() => {
    if (id) {
      setIds(prev => ({
        ...prev,
        content: id,
      }))
    }
  }, [id, setIds])

  const showSearch = showSearchOverride ?? search.showSearch
  const listboxAriaLabel = showSearch ? translation('searchResults') : undefined

  const keyHandler = (event: React.KeyboardEvent) => {
    switch (event.key) {
    case 'ArrowDown':
      item.moveHighlightedIndex(1)
      event.preventDefault()
      break
    case 'ArrowUp':
      item.moveHighlightedIndex(-1)
      event.preventDefault()
      break
    case 'Home':
      event.preventDefault()
      item.highlightFirst()
      break
    case 'End':
      event.preventDefault()
      item.highlightLast()
      break
    case 'Enter':
    case ' ':
      if(showSearch && event.key === ' ') return

      if (state.highlightedValue) {
        item.toggleSelection(state.highlightedValue)
        if (!config.isMultiSelect) {
          trigger.toggleOpen(false)
        }
        event.preventDefault()
      }
      break
    }
  }

  return (
    <PopUp
      {...props}
      id={ids.content}
      isOpen={state.isOpen}
      anchor={trigger.ref}
      options={options}
      forceMount={true}
      onClose={() => {
        trigger.toggleOpen(false)
        props.onClose?.()
      }}
      aria-labelledby={ids.trigger}
      className="gap-y-1"
    >
      {showSearch && (
        <Input
          {...searchInputProps}
          ref={searchInputRef}
          id={ids.searchInput}
          value={search.searchQuery}
          onValueChange={search.setSearchQuery}
          onKeyDown={keyHandler}

          placeholder={searchInputProps?.placeholder ?? translation('filterOptions')}

          role="combobox"
          aria-autocomplete="list"
          aria-expanded={state.isOpen}
          aria-controls={ids.listbox}
          aria-activedescendant={state.highlightedValue ? ids.listbox + '-' + state.highlightedValue : undefined}
          aria-label={searchInputProps?.['aria-label'] ?? translation('filterOptions')}

          className={clsx('mx-2 mt-2 shrink-0', searchInputProps?.className)}
        />
      )}
      <ul
        ref={innerRef}
        id={ids.listbox}
        onKeyDown={showSearch ? undefined : keyHandler}

        role="listbox"
        aria-multiselectable={config.isMultiSelect}
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
            className={clsx('text-description', { 'sr-only': state.visibleOptions.length > 0 })}
          >
            {translation('nResultsFound', { count: state.visibleOptions.length })}
          </li>
        </Visibility>
      </ul>
    </PopUp>
  )
})


///
/// MultiSelectContent
///
export type MultiSelectContentProps = SelectContentProps

export const MultiSelectContent = SelectContent
