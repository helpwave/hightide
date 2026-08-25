import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type { UseMultiSelectFirstHighlightBehavior } from '../../../hooks/useMultiSelect'
import type { FormFieldInteractionStates } from '../../../types/formField'

export type MultiSelectOptionType<T = string> = {
  id: string,
  value: T,
  label?: string,
  display?: ReactNode,
  disabled?: boolean,
}

export type MultiSelectContextState<T> = Partial<FormFieldInteractionStates> & {
  value: T[],
  options: ReadonlyArray<MultiSelectOptionType<T>>,
  selectedIds: string[],
  highlightedId: string | null,
  isOpen: boolean,
}

export type MultiSelectContextComputedState<T> = {
  visibleOptionIds: ReadonlyArray<string>,
  idToOptionMap: Record<string, MultiSelectOptionType<T>>,
}

export type MultiSelectContextActions<T> = {
  registerOption: (option: MultiSelectOptionType<T>) => () => void,
  toggleSelection: (id: string, isSelected?: boolean) => void,
  highlightFirst: () => void,
  highlightLast: () => void,
  highlightNext: () => void,
  highlightPrevious: () => void,
  highlightItem: (id: string) => void,
  handleTypeaheadKey: (key: string) => void,
  setIsOpen: (open: boolean, behavior?: UseMultiSelectFirstHighlightBehavior) => void,
  toggleIsOpen: (behavior?: UseMultiSelectFirstHighlightBehavior) => void,
}

export type MultiSelectContextSearch = {
  hasSearch: boolean,
  searchQuery: string,
  setSearchQuery: (query: string) => void,
}

export type MultiSelectContextConfig = {
  searchableThreshold: number,
  color?: ColorPairToken,
}

export type MultiSelectContextType<T> = MultiSelectContextActions<T>
  & MultiSelectContextState<T>
  & MultiSelectContextComputedState<T>
  & {
    config: MultiSelectContextConfig,
    search: MultiSelectContextSearch,
  }

export const MultiSelectContext = createContext<MultiSelectContextType<unknown> | null>(null)

export function useMultiSelectContext<T>(): MultiSelectContextType<T> {
  const ctx = useContext(MultiSelectContext)
  if (!ctx) {
    throw new Error('useMultiSelectContext must be used within MultiSelectRoot')
  }
  return ctx as MultiSelectContextType<T>
}
