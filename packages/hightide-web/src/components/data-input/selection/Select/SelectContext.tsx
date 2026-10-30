import type { Dispatch, RefObject, SetStateAction } from 'react'
import { createContext, useContext } from 'react'
import type { SelectionOptionData } from '../option'
import type { UseSelectFirstHighlightBehavior } from './useSelect'

export type SelectOptionData<T> = SelectionOptionData<T>

export interface SelectContextIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export interface SelectContextState<T> {
  isInvalid: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
  isRequired: boolean,
  selectedId: string | null,
  options: ReadonlyArray<SelectOptionData<T>>,
  highlightedId: string | null,
  isOpen: boolean,
}

export interface SelectContextComputedState<T> {
  visibleOptionIds: ReadonlyArray<string>,
  idToOptionMap: Record<string, SelectOptionData<T>>,
}

export interface SelectContextActions {
  toggleSelection(id: string): void,
  highlightFirst(): void,
  highlightLast(): void,
  highlightNext(): void,
  highlightPrevious(): void,
  highlightItem(id: string): void,
  handleTypeaheadKey(key: string): void,
  setIsOpen(open: boolean, behavior?: UseSelectFirstHighlightBehavior): void,
  toggleIsOpen(behavior?: UseSelectFirstHighlightBehavior): void,
}

export interface SelectContextLayout {
  triggerRef: RefObject<HTMLElement | null>,
  registerTrigger(element: RefObject<HTMLElement | null>): () => void,
}

export interface SelectContextSearch {
  hasSearch: boolean,
  searchQuery?: string,
  setSearchQuery(query: string): void,
}

export type SelectIconAppearance = 'left' | 'right' | 'none';

export interface SelectContextConfig {
  iconAppearance: SelectIconAppearance,
  ids: SelectContextIds,
  setIds: Dispatch<SetStateAction<SelectContextIds>>,
}

export interface SelectContextType<T> extends SelectContextActions, SelectContextState<T>, SelectContextComputedState<T> {
  optionRefs: Record<string, RefObject<HTMLLIElement | null>>,
  config: SelectContextConfig,
  layout: SelectContextLayout,
  search: SelectContextSearch,
}

export const SelectContext = createContext<SelectContextType<unknown> | null>(null)

export function useSelectContext<T>(): SelectContextType<T> {
  const ctx = useContext(SelectContext)
  if (!ctx) throw new Error('useSelectContext must be used inside a Select.Provider')
  return ctx as SelectContextType<T>
}
