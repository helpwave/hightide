import type { ReactNode } from 'react'
import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../../data-input/domInput'
import { useStateMachineController } from '@helpwave/hightide-utils/hooks'
import { TextFilterContext, type TextFilterContextValue } from './TextFilterContext'
import type { FilterOperatorText } from '../../filter-operator'
import { filterStateTransition, type FilterEvent, type FilterState } from '../filter-value'

export type TextFilterStateManagerProps = DOMInputStateMangerProps<FilterState<FilterOperatorText>, FilterEvent<FilterOperatorText>>
  & {
    operatorOverrides?: FilterOperatorText[],
    children?: ReactNode,
  }

export function TextFilterStateManager({
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
}: TextFilterStateManagerProps) {
  const machine = useStateMachineController<FilterState<FilterOperatorText>, FilterEvent<FilterOperatorText>>(state
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
