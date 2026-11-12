import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextareaContext } from './TextareaContext'
import { TextareaElement, type TextareaElementProps } from './TextareaElement'
import { TextareaStateManager, type TextareaStateManagerProps } from './TextareaStateManager'

export type TextareaProps = Omit<TextareaStateManagerProps, 'children'>
  & {
    inputRef?: Ref<ComponentRef<typeof TextareaElement>>,
    inputProps?: TextareaElementProps,
  }

const TextareaComponent = ({
  inputRef,
  inputProps,
  ...props
}: TextareaProps) => {
  return (
    <TextareaStateManager {...props}>
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
