import type { ComponentRef, Ref } from 'react'
import { forwardRef } from 'react'
import type { ControllableStateInputProps } from '@helpwave/hightide-utils/interfaces'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInputElement, type TextInputElementProps } from './TextInputElement'
import { TextInputStateManager } from './TextInputStateManager'
import type { TextInputEvent, TextInputState } from './TextInputState'

export type TextInputProps = ControllableStateInputProps<TextInputState, TextInputEvent>
  & {
    inputRef?: Ref<ComponentRef<typeof TextInputElement>>,
    inputProps?: TextInputElementProps,
  }

const TextInputComponent = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({
  inputRef,
  inputProps,
  ...stateManagerProps
}, forwardedRef) {
  return (
    <TextInputStateManager {...stateManagerProps}>
      <TextInputElement
        ref={ReactUtils.assingRefsBuilder([forwardedRef, inputRef])}
        {...inputProps}
      />
    </TextInputStateManager>
  )
})

export const TextInput = Object.assign(TextInputComponent, {
  StateManager: TextInputStateManager,
  Input: TextInputElement,
})
