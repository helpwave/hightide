import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { TextInputElement, type TextInputElementProps } from './TextInputElement'
import { TextInputStateManager } from './TextInputStateManager'
import { type TextInputEvent, type TextInputState } from './TextInputState'
import { TextInputContext } from './TextInputContext'

export type TextInputProps = ControllableDOMInputProps<string, TextInputEvent>
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
  id,
  inputRef,
  inputProps,
}: TextInputProps) => {
  const store = useStateStore<TextInputState>({
    value: value ?? initialValue ?? '',
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })

  return (
    <TextInputStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
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
