import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useStateMachine, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { TextInputContext, type TextInputContextValue } from './TextInputContext'
import { textInputStateDefinition, textInputValueBinding, type TextInputEvent, type TextInputState } from './TextInputState'

export type TextInputStateManagerProps = {
  state?: TextInputState,
  onStateChange?: (state: TextInputState) => void,
  onStateEvent?: (event: TextInputEvent) => void,
  value?: string,
  initialValue?: string,
  onValueUpdate?: (value: string) => void,
  children?: ReactNode,
}

export function TextInputStateManager({
  state,
  onStateChange,
  onStateEvent,
  value: controlledValue,
  initialValue = '',
  onValueUpdate,
  children,
}: TextInputStateManagerProps) {
  const machine = useStateMachine(textInputStateDefinition, {
    state,
    onStateEvent,
    onStateChange,
  })

  const boundValue = useStateMachineBinding({
    state: machine.state,
    dispatch: machine.dispatch,
    binding: textInputValueBinding,
    value: controlledValue,
    defaultValue: initialValue,
    onChange: onValueUpdate,
  })

  const contextValue = useMemo<TextInputContextValue>(() => ({
    state: machine.state,
    value: boundValue.value,
    setValue: boundValue.setValue,
    dispatch: machine.dispatch,
  }), [boundValue.setValue, boundValue.value, machine.dispatch, machine.state])

  return (
    <TextInputContext.Provider value={contextValue}>
      {children}
    </TextInputContext.Provider>
  )
}
