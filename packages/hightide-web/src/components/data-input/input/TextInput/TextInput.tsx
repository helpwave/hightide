import type { ComponentRef, Ref } from 'react'
import type { ControllableStateInputProps } from '@helpwave/hightide-utils/interfaces'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInputElement, type TextInputElementProps } from './TextInputElement'
import { TextInputStateManager } from './TextInputStateManager'
import type { TextInputEvent, TextInputState } from './TextInputState'
import { TextInputContext } from './TextInputContext'

export type TextInputProps = ControllableStateInputProps<TextInputState, TextInputEvent>
  & {
    inputRef?: Ref<ComponentRef<typeof TextInputElement>>,
    inputProps?: TextInputElementProps,
  }

const TextInputComponent = ({
  inputRef,
  inputProps,
  ...stateManagerProps
}: TextInputProps) => {
  return (
    <TextInputStateManager {...stateManagerProps}>
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
