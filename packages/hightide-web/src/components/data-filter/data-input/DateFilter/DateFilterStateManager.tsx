import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { DateFilterContext, type DateFilterContextValue } from './DateFilterContext'
import type { FilterOperatorDate } from '../../filter-operator'
import { filterStateTransition, type FilterEvent, type FilterState } from '../filter-value'

export type DateFilterStateManagerProps = DOMInputStateMangerProps<FilterState<FilterOperatorDate>, FilterEvent<FilterOperatorDate>>
  & {
    operatorOverrides?: FilterOperatorDate[],
    children?: ReactNode,
  }

export function DateFilterStateManager({
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
}: DateFilterStateManagerProps) {
  const machine = useStateMachineController<FilterState<FilterOperatorDate>, FilterEvent<FilterOperatorDate>>(state
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
