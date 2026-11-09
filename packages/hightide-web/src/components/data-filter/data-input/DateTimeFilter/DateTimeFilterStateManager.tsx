import { useMemo } from 'react'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { DateTimeFilterContext, type DateTimeFilterContextValue } from './DateTimeFilterContext'
import type { FilterOperatorDatetime } from '../../filter-operator'
import { filterStateTransition, type FilterStateManagerProps } from '../filter-value'

export type DateTimeFilterStateManagerProps = FilterStateManagerProps<FilterOperatorDatetime>

export function DateTimeFilterStateManager({
  state,
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
  const machine = useStateMachine({
    state,
    transition: filterStateTransition,
    onStateChange,
    onStateEvent,
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
