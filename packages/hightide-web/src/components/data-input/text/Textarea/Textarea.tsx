import type { ComponentRef, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextareaContext } from './TextareaContext'
import { TextareaElement, type TextareaElementProps } from './TextareaElement'
import { TextareaStateManager } from './TextareaStateManager'
import type { TextareaEvent, TextareaState } from './TextareaState'

export type TextareaProps = ControllableInputProps<string, TextareaEvent>
  & {
    inputRef?: Ref<ComponentRef<typeof TextareaElement>>,
    inputProps?: TextareaElementProps,
  }

const TextareaComponent = ({
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
}: TextareaProps) => {
  const [state, setState] = useControlledState<TextareaState>({
    defaultValue: { value: initialValue ?? '' },
  })
  const valueBinding = useStateMachineBinding<TextareaState, string>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: string) => ({ value: next }), []),
    get: useCallback((current: TextareaState) => current.value, []),
  })

  return (
    <TextareaStateManager
      state={valueBinding.state}
      onStateChange={valueBinding.onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
    >
      <TextareaElement
        ref={ReactUtils.assingRefsBuilder([inputRef])}
        {...inputProps}
      />
    </TextareaStateManager>
  )
}

export const Textarea = Object.assign(TextareaComponent, {
  StateManager: TextareaStateManager,
  Input: TextareaElement,
  Context: TextareaContext,
  Provider: TextareaContext.Provider,
  Consumer: TextareaContext.Consumer,
})
