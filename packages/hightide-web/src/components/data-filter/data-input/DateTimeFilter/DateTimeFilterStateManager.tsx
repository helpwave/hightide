import { useMemo } from 'react'
import { DateTimeFilterContext, type DateTimeFilterContextValue } from './DateTimeFilterContext'
import type { FilterOperatorDatetime } from '../../filter-operator'
import { useFilterState, type FilterStateManagerProps } from '../filter-value'

export type DateTimeFilterStateManagerProps = FilterStateManagerProps<FilterOperatorDatetime>

export function DateTimeFilterStateManager({
  state,
  value,
  initialValue,
  onValueChange,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  operatorOverrides,
  children,
}: DateTimeFilterStateManagerProps) {
  const machine = useFilterState({
    state,
    value,
    initialValue,
    onValueChange,
    onStateChange,
    onStateEvent,
    defaultValue: {
      operator: 'between',
      parameter: {},
    },
  })

  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
    operatorOverrides,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id, operatorOverrides])

  const contextValue = useMemo<DateTimeFilterContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <DateTimeFilterContext.Provider value={contextValue}>
      {children}
    </DateTimeFilterContext.Provider>
  )
}
