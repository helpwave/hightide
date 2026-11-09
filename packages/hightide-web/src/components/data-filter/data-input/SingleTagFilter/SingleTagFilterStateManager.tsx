import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { SingleTagFilterContext, type SingleTagFilterContextValue, type FilterTagOption } from './SingleTagFilterContext'
import type { FilterOperatorTagsSingle } from '../../filter-operator'
import { filterStateTransition, type FilterEvent, type FilterState } from '../filter-value'

export type SingleTagFilterStateManagerProps = DOMInputStateMangerProps<FilterState<FilterOperatorTagsSingle>, FilterEvent<FilterOperatorTagsSingle>>
  & {
    tags?: ReadonlyArray<FilterTagOption>,
    operatorOverrides?: FilterOperatorTagsSingle[],
    children?: ReactNode,
  }

export function SingleTagFilterStateManager({
  state,
  initialState,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  tags = [],
  operatorOverrides,
  children,
}: SingleTagFilterStateManagerProps) {
  const machine = useStateMachineController<FilterState<FilterOperatorTagsSingle>, FilterEvent<FilterOperatorTagsSingle>>(state
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
    tags,
    operatorOverrides,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id, tags, operatorOverrides])

  const contextValue = useMemo<SingleTagFilterContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <SingleTagFilterContext.Provider value={contextValue}>
      {children}
    </SingleTagFilterContext.Provider>
  )
}
