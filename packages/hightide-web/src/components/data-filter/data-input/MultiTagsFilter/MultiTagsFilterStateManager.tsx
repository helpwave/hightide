import { useMemo } from 'react'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { MultiTagsFilterContext, type MultiTagsFilterContextValue, type FilterTagOption } from './MultiTagsFilterContext'
import type { FilterOperatorTags } from '../../filter-operator'
import { filterStateTransition, type FilterStateManagerProps } from '../filter-value'

export type MultiTagsFilterStateManagerProps = FilterStateManagerProps<FilterOperatorTags> & {
  tags?: ReadonlyArray<FilterTagOption>,
}

export function MultiTagsFilterStateManager({
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
}: MultiTagsFilterStateManagerProps) {
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

  const contextValue = useMemo<MultiTagsFilterContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <MultiTagsFilterContext.Provider value={contextValue}>
      {children}
    </MultiTagsFilterContext.Provider>
  )
}
