import { useMemo } from 'react'
import { BooleanFilterContext, type BooleanFilterContextValue } from './BooleanFilterContext'
import type { FilterOperatorBoolean } from '../../filter-operator'
import { useFilterState, type FilterStateManagerProps } from '../filter-value'

export type BooleanFilterStateManagerProps = FilterStateManagerProps<FilterOperatorBoolean>

export function BooleanFilterStateManager({
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
}: BooleanFilterStateManagerProps) {
  const machine = useFilterState({
    state,
    value,
    initialValue,
    onValueChange,
    onStateChange,
    onStateEvent,
    defaultValue: {
      operator: 'isTrue',
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

  const contextValue = useMemo<BooleanFilterContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <BooleanFilterContext.Provider value={contextValue}>
      {children}
    </BooleanFilterContext.Provider>
  )
}
