import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { DateTimeFilterContext, type DateTimeFilterContextValue } from './DateTimeFilterContext'
import type { FilterOperatorDatetime } from '../../filter-operator'
import { filterStateTransition, type FilterEvent, type FilterState } from '../filter-value'

export type DateTimeFilterStateManagerProps = DOMInputStateMangerProps<FilterState<FilterOperatorDatetime>, FilterEvent<FilterOperatorDatetime>>
  & {
    operatorOverrides?: FilterOperatorDatetime[],
    children?: ReactNode,
  }

export function DateTimeFilterStateManager({
  state,
  initialState,
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
  const machine = useStateMachineController<FilterState<FilterOperatorDatetime>, FilterEvent<FilterOperatorDatetime>>(state
    ? {
      state,
      transition: filterStateTransition,
      onStateChange,
      onStateEvent,
    }
    : {
      initialState,
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
