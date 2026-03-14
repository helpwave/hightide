import type { Dispatch, ReactNode, RefObject, SetStateAction } from 'react'
import { createContext, useContext } from 'react'
import type { FormFieldInteractionStates } from '@/src/components/form/FieldLayout'
import type { UseMultiSelectFirstHighlightBehavior } from './useMultiSelect'

export interface MultiSelectOptionType<T = string> {
  id: string,
  value: T,
  label?: string,
  display?: ReactNode,
  disabled?: boolean,
  ref: RefObject<HTMLElement>,
}

export interface MultiSelectContextIds {
  trigger: string,
  content: string,
  listbox: string,
  searchInput: string,
}

export interface MultiSelectContextState<T> extends FormFieldInteractionStates {
  value: T[],
  options: ReadonlyArray<MultiSelectOptionType<T>>,
  selectedIds: string[],
  highlightedId: string | null,
  isOpen: boolean,
}

export interface MultiSelectContextComputedState<T> {
  visibleOptionIds: ReadonlyArray<string>,
  idToOptionMap: Record<string, MultiSelectOptionType<T>>,
}

export interface MultiSelectContextActions<T> {
  registerOption(option: MultiSelectOptionType<T>): () => void,
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
  triggerRef: RefObject<HTMLElement>,
  registerTrigger(element: RefObject<HTMLElement>): () => void,
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

export interface MultiSelectContextType<T> extends MultiSelectContextActions<T>, MultiSelectContextState<T>, MultiSelectContextComputedState<T> {
  config: MultiSelectContextConfig,
  layout: MultiSelectContextLayout,
  search: MultiSelectContextSearch,
}

const MultiSelectContext = createContext<MultiSelectContextType<unknown> | null>(null)

export function useMultiSelectContext<T>(): MultiSelectContextType<T> {
  const ctx = useContext(MultiSelectContext)
  if (!ctx) throw new Error('useMultiSelectContext must be used within MultiSelectRoot')
  return ctx as MultiSelectContextType<T>
}

export { MultiSelectContext }
