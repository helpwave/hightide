import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInputElement, type TextInputElementProps } from './TextInputElement'
import { TextInputStateManager } from './TextInputStateManager'
import type { TextInputEvent, TextInputState } from './TextInputState'
import { TextInputContext } from './TextInputContext'

export type TextInputProps = ControllableInputProps<string, TextInputEvent>
  & {
    inputRef?: Ref<ComponentRef<typeof TextInputElement>>,
    inputProps?: TextInputElementProps,
  }

const TextInputComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  inputRef,
  inputProps,
}: TextInputProps) => {
  const [state, setState] = useControlledState<TextInputState>({
    defaultValue: { value: initialValue ?? '' },
  })
  const valueBinding = useStateMachineBinding<TextInputState, string>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: string) => ({ value: next }), []),
    get: useCallback((current: TextInputState) => current.value, []),
  })

  return (
    <TextInputStateManager
      state={valueBinding.state}
      onStateChange={valueBinding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      <TextInputElement
        ref={ReactUtils.assingRefsBuilder([inputRef])}
        {...inputProps}
      />
    </TextInputStateManager>
  )
}

export const TextInput = Object.assign(TextInputComponent, {
  StateManager: TextInputStateManager,
  Input: TextInputElement,
  Context: TextInputContext,
  Provider: TextInputContext.Provider,
  Consumer: TextInputContext.Consumer,
})
