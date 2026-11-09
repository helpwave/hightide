import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { MultiTagsFilterContext, type MultiTagsFilterContextValue, type FilterTagOption } from './MultiTagsFilterContext'
import type { FilterOperatorTags } from '../../filter-operator'
import { filterStateTransition, type FilterEvent, type FilterState } from '../filter-value'

export type MultiTagsFilterStateManagerProps = DOMInputStateMangerProps<FilterState<FilterOperatorTags>, FilterEvent<FilterOperatorTags>>
  & {
    tags?: ReadonlyArray<FilterTagOption>,
    operatorOverrides?: FilterOperatorTags[],
    children?: ReactNode,
  }

export function MultiTagsFilterStateManager({
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
}: MultiTagsFilterStateManagerProps) {
  const machine = useStateMachineController<FilterState<FilterOperatorTags>, FilterEvent<FilterOperatorTags>>(state
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
