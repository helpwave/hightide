import { createContext, useContext } from 'react'
import type {
  DOMInputConfig,
  DOMInputContextValue
} from '../../../data-input/domInput'
import type { FilterOperatorDatetime } from '../../filter-operator'
import type { FilterEvent, FilterState } from '../filter-value'

export interface DateTimeFilterConfig extends DOMInputConfig {
  operatorOverrides?: FilterOperatorDatetime[],
}

export type DateTimeFilterContextValue = DOMInputContextValue<FilterState<FilterOperatorDatetime>, FilterEvent<FilterOperatorDatetime>, DateTimeFilterConfig>

export const DateTimeFilterContext = createContext<DateTimeFilterContextValue | null>(null)

export function useDateTimeFilterContext(): DateTimeFilterContextValue {
  const context = useContext(DateTimeFilterContext)
  if (!context) throw new Error('useDateTimeFilterContext must be used inside a DateTimeFilter.StateManager')
  return context
}
