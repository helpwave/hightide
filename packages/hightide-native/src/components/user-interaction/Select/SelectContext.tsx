import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type { UseSelectFirstHighlightBehavior } from '../../../hooks/useSelect'
import type { FormFieldInteractionStates } from '../../../types/formField'

export type SelectOptionType<T = string> = {
  id: string,
  value: T,
  label?: string,
  display?: ReactNode,
  disabled?: boolean,
}

export type SelectContextState<T> = Partial<FormFieldInteractionStates> & {
  selectedId: string | null,
  options: ReadonlyArray<SelectOptionType<T>>,
  highlightedId: string | null,
  isOpen: boolean,
}

export type SelectContextComputedState<T> = {
  visibleOptionIds: ReadonlyArray<string>,
  idToOptionMap: Record<string, SelectOptionType<T>>,
}

export type SelectContextActions<T> = {
  registerOption: (option: SelectOptionType<T>) => () => void,
  toggleSelection: (id: string) => void,
  highlightFirst: () => void,
  highlightLast: () => void,
  highlightNext: () => void,
  highlightPrevious: () => void,
  highlightItem: (id: string) => void,
  handleTypeaheadKey: (key: string) => void,
  setIsOpen: (open: boolean, behavior?: UseSelectFirstHighlightBehavior) => void,
  toggleIsOpen: (behavior?: UseSelectFirstHighlightBehavior) => void,
}

export type SelectContextSearch = {
  hasSearch: boolean,
  searchQuery: string,
  setSearchQuery: (query: string) => void,
}

export type SelectContextConfig = {
  searchableThreshold: number,
  color?: ColorPairToken,
}

export type SelectContextType<T> = SelectContextActions<T>
  & SelectContextState<T>
  & SelectContextComputedState<T>
  & {
    config: SelectContextConfig,
    search: SelectContextSearch,
  }

export const SelectContext = createContext<SelectContextType<unknown> | null>(null)

export function useSelectContext<T>(): SelectContextType<T> {
  const ctx = useContext(SelectContext)
  if (!ctx) {
    throw new Error('useSelectContext must be used within SelectRoot')
  }
  return ctx as SelectContextType<T>
}
