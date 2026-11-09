import { useSyncExternalStore } from 'react'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import type { DOMInputStateMangerProps } from '../../data-input/domInput'
import type { FilterOperator } from '../filter-operator'
import type { FilterParameter } from '../filter-functions'

export type FilterInputValue<O extends FilterOperator = FilterOperator> = {
  operator: O,
  parameter: FilterParameter,
}

export type FilterState<O extends FilterOperator = FilterOperator> = {
  value: FilterInputValue<O>,
}

export type FilterEvent<O extends FilterOperator = FilterOperator> = {
  type: 'change',
  value: FilterInputValue<O>,
}

export interface FilterStateManagerProps<Operator extends FilterOperator>
  extends DOMInputStateMangerProps<FilterState<Operator>, FilterEvent<Operator>> {
  operatorOverrides?: Operator[],
}

export const filterStateTransition = <O extends FilterOperator>(
  _state: FilterState<O>,
  event: FilterEvent<O>
): FilterState<O> => {
  switch (event.type) {
  case 'change':
    return { value: event.value }
  }
}

export function useFilterState<O extends FilterOperator>({
  value,
  initialValue,
  onValueChange,
  defaultValue,
}: {
  value?: FilterInputValue<O>,
  initialValue?: FilterInputValue<O>,
  onValueChange?: (value: FilterInputValue<O>) => void,
  defaultValue: FilterInputValue<O>,
}) {
  const store = useStateStore<FilterState<O>>({
    value: value ?? initialValue ?? defaultValue,
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

  return {
    store,
    state,
    onStateChange,
  }
}
