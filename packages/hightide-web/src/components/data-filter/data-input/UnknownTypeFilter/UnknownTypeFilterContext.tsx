import { createContext, useContext } from 'react'
import type {
  DOMInputConfig,
  DOMInputContextValue
} from '../../../data-input/domInput'
import type { FilterOperatorUnknownType } from '../../filter-operator'
import type { FilterEvent, FilterState } from '../filter-value'

export interface UnknownTypeFilterConfig extends DOMInputConfig {
  operatorOverrides?: FilterOperatorUnknownType[],
}

export type UnknownTypeFilterContextValue = DOMInputContextValue<FilterState<FilterOperatorUnknownType>, FilterEvent<FilterOperatorUnknownType>, UnknownTypeFilterConfig>

export const UnknownTypeFilterContext = createContext<UnknownTypeFilterContextValue | null>(null)

export function useUnknownTypeFilterContext(): UnknownTypeFilterContextValue {
  const context = useContext(UnknownTypeFilterContext)
  if (!context) throw new Error('useUnknownTypeFilterContext must be used inside a UnknownTypeFilter.StateManager')
  return context
}
