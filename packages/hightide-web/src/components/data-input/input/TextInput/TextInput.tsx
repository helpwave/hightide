import type { ComponentRef, InputHTMLAttributes, Ref } from 'react'
import { forwardRef } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInputElement, type TextInputEditCompleteOptions, type TextInputElementProps } from './TextInputElement'
import { TextInputStateManager, type TextInputStateManagerProps } from './TextInputStateManager'
import type { TextInputEvent, TextInputState } from './TextInputState'
import type { InputComponentInterface } from './InputTypes'

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'>
  & InputComponentInterface<string>
  & {
    editCompleteOptions?: TextInputEditCompleteOptions,
    state?: TextInputState,
    onStateChange?: (state: TextInputState) => void,
    onStateEvent?: (event: TextInputEvent) => void,
    stateManagerProps?: Omit<TextInputStateManagerProps, 'children'>,
    inputRef?: Ref<ComponentRef<typeof TextInputElement>>,
    inputProps?: TextInputElementProps,
  }

const TextInputComponent = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({
  value,
  initialValue,
  invalid = false,
  onValueUpdate,
  onValueCommit,
  editCompleteOptions,
  state,
  onStateChange,
  onStateEvent,
  stateManagerProps,
  inputRef,
  inputProps,
  ...props
}, forwardedRef) {
  return (
    <TextInputStateManager
      value={value}
      initialValue={initialValue}
      onValueUpdate={onValueUpdate}
      state={state}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      {...stateManagerProps}
    >
      <TextInputElement
        ref={ReactUtils.assingRefsBuilder([forwardedRef, inputRef])}
        invalid={invalid}
        onValueCommit={onValueCommit}
        editCompleteOptions={editCompleteOptions}
        {...props}
        {...inputProps}
      />
    </TextInputStateManager>
  )
})

export const TextInput = Object.assign(TextInputComponent, {
  StateManager: TextInputStateManager,
  Input: TextInputElement,
})
