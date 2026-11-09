import { createContext, useContext } from 'react'
import type {
  DOMInputConfig,
  DOMInputContextValue
} from '../../../data-input/domInput'
import type { FilterOperatorBoolean } from '../../filter-operator'
import type { FilterEvent, FilterState } from '../filter-value'

export interface BooleanFilterConfig extends DOMInputConfig {
  operatorOverrides?: FilterOperatorBoolean[],
}

export type BooleanFilterContextValue = DOMInputContextValue<FilterState<FilterOperatorBoolean>, FilterEvent<FilterOperatorBoolean>, BooleanFilterConfig>

export const BooleanFilterContext = createContext<BooleanFilterContextValue | null>(null)

export function useBooleanFilterContext(): BooleanFilterContextValue {
  const context = useContext(BooleanFilterContext)
  if (!context) throw new Error('useBooleanFilterContext must be used inside a BooleanFilter.StateManager')
  return context
}
