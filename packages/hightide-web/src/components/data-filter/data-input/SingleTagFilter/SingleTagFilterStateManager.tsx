import { useMemo } from 'react'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { SingleTagFilterContext, type SingleTagFilterContextValue, type FilterTagOption } from './SingleTagFilterContext'
import type { FilterOperatorTagsSingle } from '../../filter-operator'
import { filterStateTransition, type FilterStateManagerProps } from '../filter-value'

export type SingleTagFilterStateManagerProps = FilterStateManagerProps<FilterOperatorTagsSingle> & {
  tags?: ReadonlyArray<FilterTagOption>,
}

export function SingleTagFilterStateManager({
  state,
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
