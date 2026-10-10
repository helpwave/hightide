import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import type { InputStateMangerProps } from '@helpwave/hightide-utils/interfaces'
import { useStableEvent, useStateMachine } from '@helpwave/hightide-utils/hooks'
import { TextInputContext, type TextInputContextValue } from './TextInputContext'
import { textInputStateTransition, type TextInputEvent, type TextInputState } from './TextInputState'

export type TextInputStateManagerProps = InputStateMangerProps<TextInputState, TextInputEvent>
  & {
    children?: ReactNode,
  }

export function TextInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  children,
}: TextInputStateManagerProps) {
  const machine = useStateMachine<TextInputState, TextInputEvent>({
    state,
    transition: textInputStateTransition,
    onStateChange,
  })

  const onStateEventStable = useStableEvent(onStateEvent)
  const dispatch = useCallback((event: TextInputEvent) => {
    machine.dispatch(event)
    onStateEventStable(event)
  }, [machine, onStateEventStable])

  const config = useMemo(() => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
  }), [isDisabled, isInvalid, isReadOnly, isRequired])

  const contextValue = useMemo<TextInputContextValue>(() => ({
    state: machine.state,
    dispatch,
    config,
  }), [config, dispatch, machine.state])

  return (
    <TextInputContext.Provider value={contextValue}>
      {children}
    </TextInputContext.Provider>
  )
}
