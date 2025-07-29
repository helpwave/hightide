import type { ReactNode } from 'react'
import { useRef } from 'react'
import React, { useCallback, useEffect, useId } from 'react'
import { Search } from 'lucide-react'
import clsx from 'clsx'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import { Input } from '../user-action/input/Input'
import { IconButton } from '../user-action/Button'
import type { UseSearchProps } from '../../hooks/useSearch'
import { useSearch } from '../../hooks/useSearch'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'
import type { BagFunction } from '@/src'
import { clamp } from '@/src'
import { ArrayUtil, ScrollArea } from '@/src'

type SelectableListItemType = {
  id: string,
  label: ReactNode,
  searchTags: string[],
  disabled?: boolean,
  isSelected?: boolean,
}

type SelectableListProps = {
  items: SelectableListItemType[],
  highlightedId: string,
  onHighlightedChange: (id?: string) => void,
  onSelected: (id: string) => void,
  multiSelect?: boolean,
}

export const SelectableList = ({
                                 items,
                                 highlightedId,
                                 onHighlightedChange,
                                 onSelected,
                                 multiSelect
                               }: SelectableListProps) => {
  let activeIdIndex = items.findIndex(value => value.id === highlightedId)
  activeIdIndex = clamp(activeIdIndex, [0, items.length - 1])

  // Refs for buttons
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const next = useCallback(() => {
    const value = ArrayUtil.moveItems(items, activeIdIndex + 1).find(value => !value.disabled)
    if (value) onHighlightedChange(value.id)
  }, [activeIdIndex, items])

  const previous = useCallback(() => {
    const value = ArrayUtil.moveItems(items, activeIdIndex).reverse().find(value => !value.disabled)
    if (value) onHighlightedChange(value.id)
  }, [activeIdIndex, items])

  const keyDown = useCallback((event: KeyboardEvent | React.KeyboardEvent) => {
    const key = event.key
    if (key === 'ArrowDown') {
      next()
    } else if (key === 'ArrowUp') {
      previous()
    } else if (key === 'Enter' || key === ' ') {
      onSelected(highlightedId)
    }
    event.preventDefault()
    event.stopPropagation()
  }, [next, previous])

  useEffect(() => {
    document.addEventListener('keydown', keyDown)
    return () => document.removeEventListener('keydown', keyDown)
  }, [keyDown])

  // Focus or scroll highlighted item
  useEffect(() => {
    const el = itemRefs.current[highlightedId]
    if (el) {
      el.scrollIntoView({ block: 'center' })
    }
  }, [highlightedId])

  return (
    <ScrollArea
      role="listbox"
      aria-multiselectable={multiSelect}
      onKeyDown={keyDown}
    >
      <div className="flex-col-2 p-2">
        {items.map(item => (
          <div
            key={item.id}
            ref={el => itemRefs.current[item.id] = el}
            onClick={() => {
              if(item.disabled) return
              onSelected(item.id)
              onHighlightedChange(item.id)
            }}
            className={clsx(
              'not-data-disabled:data-highlighted:bg-primary/20 not-data-disabled:cursor-pointer',
              'data-disabled:text-disabled-text data-disabled:cursor-not-allowed'
            )}

            data-disabled={item.disabled ? '' : undefined}
            data-highlighted={item.id === highlightedId ? '' : undefined}
          >
            {item.label}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}


type SearchableListAddonTranslation = {
  nothingFound: string,
}

type SearchableListTranslation = SearchableListAddonTranslation & FormTranslationType

const defaultSearchableListTranslation: Translation<SearchableListAddonTranslation> = {
  en: {
    nothingFound: 'Nothing found'
  },
  de: {
    nothingFound: 'Nichts gefunden'
  }
}

type ItemBag<T> = {
  value: T,
  /** The index in the unfiltered list */
  index: number,
  isSelected: boolean,
}

export type SearchableListProps<T> = UseSearchProps<T> & {
  autoFocus?: boolean,
  minimumItemsForSearch?: number,
  itemMapper: BagFunction<ItemBag<T>>,
  className?: string,
  resultListClassName?: string,
}

/**
 * A component for searching a list
 */
export const SearchableList = <T, >({
                                      overwriteTranslation,
                                      list,
                                      initialSearch = '',
                                      searchMapping,
                                      autoFocus,
                                      minimumItemsForSearch = 6,
                                      itemMapper,
                                      className,
                                      resultListClassName
                                    }: PropsForTranslation<SearchableListTranslation, SearchableListProps<T>>) => {
  const translation = useTranslation([defaultSearchableListTranslation, formTranslation], overwriteTranslation)
  const { result, hasResult, search, setSearch, updateSearch } = useSearch<T>({ list, initialSearch, searchMapping })
  const id = useId()
  const activeItem = result.filter()

  return (
    <div
      className={clsx('flex-col-2', className)}
      onKeyDown={event => {
        event.key === 'ArrowUp'
      }}
    >
      {list.length > minimumItemsForSearch && (
        <div className="flex-row-2 justify-between items-center">
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder={translation('search')}
            autoFocus={autoFocus}
            className="w-full"
          />
          <IconButton size="small" color="neutral" onClick={() => updateSearch()}>
            <Search className="w-full h-full"/>
          </IconButton>
        </div>
      )}
      {hasResult ? (
        <div className={clsx('flex-col-1 overflow-y-auto', resultListClassName)}>
          {result.map(itemMapper)}
        </div>
      ) : (
        <div className="flex-row-2 text-description py-2 px-2">{translation('nothingFound')}</div>
      )}
    </div>
  )
}