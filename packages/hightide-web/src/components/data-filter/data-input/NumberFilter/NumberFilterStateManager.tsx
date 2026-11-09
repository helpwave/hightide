import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { NumberFilterContext, type NumberFilterContextValue } from './NumberFilterContext'
import type { FilterOperatorNumber } from '../../filter-operator'
import { filterStateTransition, type FilterEvent, type FilterState } from '../filter-value'

export type NumberFilterStateManagerProps = DOMInputStateMangerProps<FilterState<FilterOperatorNumber>, FilterEvent<FilterOperatorNumber>>
  & {
    operatorOverrides?: FilterOperatorNumber[],
    children?: ReactNode,
  }

export function NumberFilterStateManager({
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
}: NumberFilterStateManagerProps) {
  const machine = useStateMachineController<FilterState<FilterOperatorNumber>, FilterEvent<FilterOperatorNumber>>(state
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

  const contextValue = useMemo<NumberFilterContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <NumberFilterContext.Provider value={contextValue}>
      {children}
    </NumberFilterContext.Provider>
  )
}
