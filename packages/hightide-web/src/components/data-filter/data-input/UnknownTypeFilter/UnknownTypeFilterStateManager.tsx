import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { UnknownTypeFilterContext, type UnknownTypeFilterContextValue } from './UnknownTypeFilterContext'
import type { FilterOperatorUnknownType } from '../../filter-operator'
import { filterStateTransition, type FilterEvent, type FilterState } from '../filter-value'

export type UnknownTypeFilterStateManagerProps = DOMInputStateMangerProps<FilterState<FilterOperatorUnknownType>, FilterEvent<FilterOperatorUnknownType>>
  & {
    operatorOverrides?: FilterOperatorUnknownType[],
    children?: ReactNode,
  }

export function UnknownTypeFilterStateManager({
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
}: UnknownTypeFilterStateManagerProps) {
  const machine = useStateMachineController<FilterState<FilterOperatorUnknownType>, FilterEvent<FilterOperatorUnknownType>>(state
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
