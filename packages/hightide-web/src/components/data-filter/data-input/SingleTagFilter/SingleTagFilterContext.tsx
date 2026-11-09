import { createContext, useContext } from 'react'
import type {
  DOMInputConfig,
  DOMInputContextValue
} from '../../../data-input/domInput'
import type { FilterOperatorTagsSingle } from '../../filter-operator'
import type { FilterTagOption } from '../filter-tag'
import type { FilterEvent, FilterState } from '../filter-value'

export type { FilterTagOption }

export interface SingleTagFilterConfig extends DOMInputConfig {
  tags: ReadonlyArray<FilterTagOption>,
  operatorOverrides?: FilterOperatorTagsSingle[],
}

export type SingleTagFilterContextValue = DOMInputContextValue<FilterState<FilterOperatorTagsSingle>, FilterEvent<FilterOperatorTagsSingle>, SingleTagFilterConfig>

export const SingleTagFilterContext = createContext<SingleTagFilterContextValue | null>(null)

export function useSingleTagFilterContext(): SingleTagFilterContextValue {
  const context = useContext(SingleTagFilterContext)
  if (!context) throw new Error('useSingleTagFilterContext must be used inside a SingleTagFilter.StateManager')
  return context
}
