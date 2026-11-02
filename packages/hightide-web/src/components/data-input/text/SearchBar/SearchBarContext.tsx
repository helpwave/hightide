import { createContext, useContext } from 'react'
import type { DOMInputConfig, DOMInputContextValue } from '../../domInput'
import type { SearchBarEvent, SearchBarState } from './SearchBarState'

export type SearchBarContextValue = DOMInputContextValue<SearchBarState, SearchBarEvent, DOMInputConfig> & {
  onSearch: (value: string) => void,
}

export const SearchBarContext = createContext<SearchBarContextValue | null>(null)

export function useSearchBarContext(): SearchBarContextValue {
  const context = useContext(SearchBarContext)
  if (!context) throw new Error('useSearchBarContext must be used inside a SearchBar.StateManager')
  return context
}
