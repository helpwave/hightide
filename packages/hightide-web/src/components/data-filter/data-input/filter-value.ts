import { useRef } from 'react'
import { useInputStateManager, type StateStore } from '@helpwave/hightide-utils/hooks'
import type { DOMInputStateManagerProps } from '../../data-input/domInput'
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
  extends DOMInputStateManagerProps<FilterState<Operator>, FilterEvent<Operator>> {
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

function sameDate(left: Date | undefined, right: Date | undefined): boolean {
  if (left === right) return true
  if (left === undefined || right === undefined) return false
  return left.getTime() === right.getTime()
}

function sameList(left: unknown[] | undefined, right: unknown[] | undefined): boolean {
  if (left === right) return true
  if (left === undefined || right === undefined || left.length !== right.length) return false
  return left.every((item, index) => Object.is(item, right[index]))
}

function sameParameter(left: FilterParameter, right: FilterParameter): boolean {
  return left.stringValue === right.stringValue
    && left.numberValue === right.numberValue
    && left.numberMin === right.numberMin
    && left.numberMax === right.numberMax
    && left.booleanValue === right.booleanValue
    && sameDate(left.dateValue, right.dateValue)
    && sameDate(left.dateMin, right.dateMin)
    && sameDate(left.dateMax, right.dateMax)
    && Object.is(left.uuidValue, right.uuidValue)
    && sameList(left.uuidValues, right.uuidValues)
}

function sameFilterInputValue<O extends FilterOperator>(
  left: FilterInputValue<O>,
  right: FilterInputValue<O>
): boolean {
  return left.operator === right.operator && sameParameter(left.parameter, right.parameter)
}

function useStableFilterInputValue<O extends FilterOperator>(value: FilterInputValue<O>): FilterInputValue<O> {
  const ref = useRef(value)
  if (!sameFilterInputValue(ref.current, value)) {
    ref.current = value
  }
  return ref.current
}

export function useFilterState<O extends FilterOperator>({
  value,
  initialValue,
  onValueChange,
  defaultValue,
  state,
  onStateChange,
  onStateEvent,
}: {
  value?: FilterInputValue<O>,
  initialValue?: FilterInputValue<O>,
  onValueChange?: DOMInputStateManagerProps<FilterState<O>, FilterEvent<O>>['onValueChange'],
  defaultValue: FilterInputValue<O>,
  state?: StateStore<FilterState<O>>,
  onStateChange?: DOMInputStateManagerProps<FilterState<O>, FilterEvent<O>>['onStateChange'],
  onStateEvent?: (event: FilterEvent<O>) => void,
}) {
  const resolved = value ?? initialValue ?? defaultValue
  const stableValue = useStableFilterInputValue(resolved)
  return useInputStateManager<FilterState<O>, FilterEvent<O>>({
    state,
    value: value === undefined ? undefined : stableValue,
    initialValue: stableValue,
    onValueChange,
    onStateChange,
    onStateEvent,
    transition: filterStateTransition,
    initialState: { value: stableValue },
  })
}
