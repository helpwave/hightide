import { useMemo } from 'react'
import { TextFilterContext, type TextFilterContextValue } from './TextFilterContext'
import type { FilterOperatorText } from '../../filter-operator'
import { useFilterState, type FilterStateManagerProps } from '../filter-value'

export type TextFilterStateManagerProps = FilterStateManagerProps<FilterOperatorText>

export function TextFilterStateManager({
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
}: TextFilterStateManagerProps) {
  const machine = useFilterState({
    state,
    value,
    initialValue,
    onValueChange,
    onStateChange,
    onStateEvent,
    defaultValue: {
      operator: 'contains',
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

  const contextValue = useMemo<TextFilterContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <TextFilterContext.Provider value={contextValue}>
      {children}
    </TextFilterContext.Provider>
  )
}
