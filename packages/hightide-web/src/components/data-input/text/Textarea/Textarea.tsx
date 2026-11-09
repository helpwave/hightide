import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextareaContext } from './TextareaContext'
import { TextareaElement, type TextareaElementProps } from './TextareaElement'
import { TextareaStateManager } from './TextareaStateManager'
import { type TextareaEvent, type TextareaState } from './TextareaState'

export type TextareaProps = ControllableDOMInputProps<string, TextareaEvent>
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
  id,
  inputRef,
  inputProps,
}: TextareaProps) => {
  const store = useStateStore<TextareaState>({
    value: value ?? initialValue ?? '',
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })

  return (
    <TextareaStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
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
