import { useMemo } from 'react'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { NumberFilterContext, type NumberFilterContextValue } from './NumberFilterContext'
import type { FilterOperatorNumber } from '../../filter-operator'
import { filterStateTransition, type FilterStateManagerProps } from '../filter-value'

export type NumberFilterStateManagerProps = FilterStateManagerProps<FilterOperatorNumber>

export function NumberFilterStateManager({
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
}: NumberFilterStateManagerProps) {
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
