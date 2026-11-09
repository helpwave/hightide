import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { BooleanFilterContext, type BooleanFilterContextValue } from './BooleanFilterContext'
import type { FilterOperatorBoolean } from '../../filter-operator'
import { filterStateTransition, type FilterEvent, type FilterState } from '../filter-value'

export type BooleanFilterStateManagerProps = DOMInputStateMangerProps<FilterState<FilterOperatorBoolean>, FilterEvent<FilterOperatorBoolean>>
  & {
    operatorOverrides?: FilterOperatorBoolean[],
    children?: ReactNode,
  }

export function BooleanFilterStateManager({
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
}: BooleanFilterStateManagerProps) {
  const machine = useStateMachineController<FilterState<FilterOperatorBoolean>, FilterEvent<FilterOperatorBoolean>>(state
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
