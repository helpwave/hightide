import { useMemo } from 'react'
import { NumberFilterContext, type NumberFilterContextValue } from './NumberFilterContext'
import type { FilterOperatorNumber } from '../../filter-operator'
import { useFilterState, type FilterStateManagerProps } from '../filter-value'

export type NumberFilterStateManagerProps = FilterStateManagerProps<FilterOperatorNumber>

export function NumberFilterStateManager({
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
}: NumberFilterStateManagerProps) {
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
