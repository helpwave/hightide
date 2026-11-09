import { createContext, useContext } from 'react'
import type {
  DOMInputConfig,
  DOMInputContextValue
} from '../../../data-input/domInput'
import type { FilterOperatorNumber } from '../../filter-operator'
import type { FilterEvent, FilterState } from '../filter-value'

export interface NumberFilterConfig extends DOMInputConfig {
  operatorOverrides?: FilterOperatorNumber[],
}

export type NumberFilterContextValue = DOMInputContextValue<FilterState<FilterOperatorNumber>, FilterEvent<FilterOperatorNumber>, NumberFilterConfig>

export const NumberFilterContext = createContext<NumberFilterContextValue | null>(null)

export function useNumberFilterContext(): NumberFilterContextValue {
  const context = useContext(NumberFilterContext)
  if (!context) throw new Error('useNumberFilterContext must be used inside a NumberFilter.StateManager')
  return context
}
