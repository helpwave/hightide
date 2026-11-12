import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInputElement, type TextInputElementProps } from './TextInputElement'
import { TextInputStateManager, type TextInputStateManagerProps } from './TextInputStateManager'
import { TextInputContext } from './TextInputContext'

export type TextInputProps = Omit<TextInputStateManagerProps, 'children'>
  & {
    inputRef?: Ref<ComponentRef<typeof TextInputElement>>,
    inputProps?: TextInputElementProps,
  }

const TextInputComponent = ({
  inputRef,
  inputProps,
  ...props
}: TextInputProps) => {
  return (
    <TextInputStateManager {...props}>
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
