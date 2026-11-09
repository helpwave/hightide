import { createContext, useContext } from 'react'
import type {
  DOMInputConfig,
  DOMInputContextValue
} from '../../../data-input/domInput'
import type { FilterOperatorDate } from '../../filter-operator'
import type { FilterEvent, FilterState } from '../filter-value'

export interface DateFilterConfig extends DOMInputConfig {
  operatorOverrides?: FilterOperatorDate[],
}

export type DateFilterContextValue = DOMInputContextValue<FilterState<FilterOperatorDate>, FilterEvent<FilterOperatorDate>, DateFilterConfig>

export const DateFilterContext = createContext<DateFilterContextValue | null>(null)

export function useDateFilterContext(): DateFilterContextValue {
  const context = useContext(DateFilterContext)
  if (!context) throw new Error('useDateFilterContext must be used inside a DateFilter.StateManager')
  return context
}
