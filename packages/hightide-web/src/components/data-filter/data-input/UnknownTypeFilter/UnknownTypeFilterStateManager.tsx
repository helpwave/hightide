import { useMemo } from 'react'
import { UnknownTypeFilterContext, type UnknownTypeFilterContextValue } from './UnknownTypeFilterContext'
import type { FilterOperatorUnknownType } from '../../filter-operator'
import { useFilterState, type FilterStateManagerProps } from '../filter-value'

export type UnknownTypeFilterStateManagerProps = FilterStateManagerProps<FilterOperatorUnknownType>

export function UnknownTypeFilterStateManager({
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
}: UnknownTypeFilterStateManagerProps) {
  const machine = useFilterState({
    state,
    value,
    initialValue,
    onValueChange,
    onStateChange,
    onStateEvent,
    defaultValue: {
      operator: 'isNotUndefined',
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
