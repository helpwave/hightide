import { createContext, useContext } from 'react'
import type {
  DOMInputConfig,
  DOMInputContextValue
} from '../../../data-input/domInput'
import type { FilterOperatorText } from '../../filter-operator'
import type { FilterEvent, FilterState } from '../filter-value'

export interface TextFilterConfig extends DOMInputConfig {
  operatorOverrides?: FilterOperatorText[],
}

export type TextFilterContextValue = DOMInputContextValue<FilterState<FilterOperatorText>, FilterEvent<FilterOperatorText>, TextFilterConfig>

export const TextFilterContext = createContext<TextFilterContextValue | null>(null)

export function useTextFilterContext(): TextFilterContextValue {
  const context = useContext(TextFilterContext)
  if (!context) throw new Error('useTextFilterContext must be used inside a TextFilter.StateManager')
  return context
}
