import { useMemo } from 'react'
import type { DOMInputStateMangerProps } from '../../domInput'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { FlexibleDateTimeInputContext, type FlexibleDateTimeInputContextValue } from './FlexibleDateTimeInputContext'
import {
  flexibleDateTimeInputStateTransition,
  type FlexibleDateTimeInputEvent,
  type FlexibleDateTimeInputState
} from './FlexibleDateTimeInputState'

export type FlexibleDateTimeInputStateManagerProps = DOMInputStateMangerProps<FlexibleDateTimeInputState, FlexibleDateTimeInputEvent>

export function FlexibleDateTimeInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
  children,
}: FlexibleDateTimeInputStateManagerProps) {
  const machine = useStateMachine({
    state,
    transition: flexibleDateTimeInputStateTransition,
    onStateChange,
    onStateEvent,
  })
  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }), [isDisabled, isInvalid, isReadOnly, isRequired, id])
  const contextValue = useMemo<FlexibleDateTimeInputContextValue>(() => ({
    state: machine.state,
    dispatch: machine.dispatch,
    config,
  }), [config, machine.dispatch, machine.state])

  return (
    <FlexibleDateTimeInputContext.Provider value={contextValue}>
      {children}
    </FlexibleDateTimeInputContext.Provider>
  )
}
