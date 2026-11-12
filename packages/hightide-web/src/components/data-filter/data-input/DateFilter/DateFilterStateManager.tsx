import { useMemo } from 'react'
import { DateFilterContext, type DateFilterContextValue } from './DateFilterContext'
import type { FilterOperatorDate } from '../../filter-operator'
import { useFilterState, type FilterStateManagerProps } from '../filter-value'

export type DateFilterStateManagerProps = FilterStateManagerProps<FilterOperatorDate>

export function DateFilterStateManager({
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
}: DateFilterStateManagerProps) {
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

  const contextValue = useMemo<DateFilterContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <DateFilterContext.Provider value={contextValue}>
      {children}
    </DateFilterContext.Provider>
  )
}
