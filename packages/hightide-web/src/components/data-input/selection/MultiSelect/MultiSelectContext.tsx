import type { Dispatch, RefObject, SetStateAction } from 'react'
import { createContext, useContext } from 'react'
import type { SelectionOptionData } from '../option'
import type { UseMultiSelectFirstHighlightBehavior } from './useMultiSelect'

export type MultiSelectOptionData<T> = SelectionOptionData<T>

export interface MultiSelectContextIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export interface MultiSelectContextState<T> {
  isInvalid: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
  isRequired: boolean,
  value: T[],
  options: ReadonlyArray<MultiSelectOptionData<T>>,
  selectedIds: string[],
  highlightedId: string | null,
  isOpen: boolean,
}

export interface MultiSelectContextComputedState<T> {
  visibleOptionIds: ReadonlyArray<string>,
  idToOptionMap: Record<string, MultiSelectOptionData<T>>,
}

export interface MultiSelectContextActions {
  toggleSelection(id: string, isSelected?: boolean): void,
  highlightFirst(): void,
  highlightLast(): void,
  highlightNext(): void,
  highlightPrevious(): void,
  highlightItem(id: string): void,
  handleTypeaheadKey(key: string): void,
  setIsOpen(open: boolean, behavior?: UseMultiSelectFirstHighlightBehavior): void,
  toggleIsOpen(behavior?: UseMultiSelectFirstHighlightBehavior): void,
}

export interface MultiSelectContextLayout {
  triggerRef: RefObject<HTMLElement | null>,
  registerTrigger(element: RefObject<HTMLElement | null>): () => void,
}

export interface MultiSelectContextSearch {
  hasSearch: boolean,
  searchQuery?: string,
  setSearchQuery(query: string): void,
}

export type MultiSelectIconAppearance = 'left' | 'right' | 'none';

export interface MultiSelectContextConfig {
  iconAppearance: MultiSelectIconAppearance,
  ids: MultiSelectContextIds,
  setIds: Dispatch<SetStateAction<MultiSelectContextIds>>,
}

export interface MultiSelectContextType<T> extends MultiSelectContextActions, MultiSelectContextState<T>, MultiSelectContextComputedState<T> {
  optionRefs: Record<string, RefObject<HTMLLIElement | null>>,
  config: MultiSelectContextConfig,
  layout: MultiSelectContextLayout,
  search: MultiSelectContextSearch,
}

const MultiSelectContext = createContext<MultiSelectContextType<unknown> | null>(null)

export function useMultiSelectContext<T>(): MultiSelectContextType<T> {
  const ctx = useContext(MultiSelectContext)
  if (!ctx) throw new Error('useMultiSelectContext must be used inside a MultiSelect.Provider')
  return ctx as MultiSelectContextType<T>
}

export { MultiSelectContext }
