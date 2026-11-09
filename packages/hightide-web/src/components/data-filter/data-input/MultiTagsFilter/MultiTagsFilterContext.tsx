import { createContext, useContext } from 'react'
import type {
  DOMInputConfig,
  DOMInputContextValue
} from '../../../data-input/domInput'
import type { FilterOperatorTags } from '../../filter-operator'
import type { FilterTagOption } from '../filter-tag'
import type { FilterEvent, FilterState } from '../filter-value'

export type { FilterTagOption }

export interface MultiTagsFilterConfig extends DOMInputConfig {
  tags: ReadonlyArray<FilterTagOption>,
  operatorOverrides?: FilterOperatorTags[],
}

export type MultiTagsFilterContextValue = DOMInputContextValue<FilterState<FilterOperatorTags>, FilterEvent<FilterOperatorTags>, MultiTagsFilterConfig>

export const MultiTagsFilterContext = createContext<MultiTagsFilterContextValue | null>(null)

export function useMultiTagsFilterContext(): MultiTagsFilterContextValue {
  const context = useContext(MultiTagsFilterContext)
  if (!context) throw new Error('useMultiTagsFilterContext must be used inside a MultiTagsFilter.StateManager')
  return context
}
