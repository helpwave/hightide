import { useMemo } from 'react'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { UnknownTypeFilterContext, type UnknownTypeFilterContextValue } from './UnknownTypeFilterContext'
import type { FilterOperatorUnknownType } from '../../filter-operator'
import { filterStateTransition, type FilterStateManagerProps } from '../filter-value'

export type UnknownTypeFilterStateManagerProps = FilterStateManagerProps<FilterOperatorUnknownType>

export function UnknownTypeFilterStateManager({
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
}: UnknownTypeFilterStateManagerProps) {
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

  const contextValue = useMemo<UnknownTypeFilterContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <UnknownTypeFilterContext.Provider value={contextValue}>
      {children}
    </UnknownTypeFilterContext.Provider>
  )
}
