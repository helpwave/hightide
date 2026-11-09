import type { ComponentRef, Ref } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type { TextInputElementProps } from '../TextInput'
import { ToggleableInputContext } from './ToggleableInputContext'
import { ToggleableInputDisplay } from './ToggleableInputDisplay'
import { ToggleableInputField, type ToggleableInputEditOptions, type ToggleableInputFieldProps } from './ToggleableInputField'
import { ToggleableInputLayout, type ToggleableInputLayoutProps } from './ToggleableInputLayout'
import { ToggleableInputStateManager } from './ToggleableInputStateManager'
import { type ToggleableInputEvent, type ToggleableInputState } from './ToggleableInputState'

export type ToggleableInputProps = ControllableDOMInputProps<string, ToggleableInputEvent> & {
  initialEditingState?: 'editing' | 'display',
  editCompleteOptions?: ToggleableInputEditOptions,
  layoutRef?: Ref<ComponentRef<typeof ToggleableInputLayout>>,
  layoutProps?: ToggleableInputLayoutProps,
  inputRef?: ToggleableInputFieldProps['inputRef'],
  inputProps?: TextInputElementProps,
}

const ToggleableInputComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  initialEditingState = 'display',
  editCompleteOptions,
  layoutRef,
  layoutProps,
  inputRef,
  inputProps,
}: ToggleableInputProps) => {
  const store = useStateStore<ToggleableInputState>({
    value: value ?? initialValue ?? '',
    isEditing: initialEditingState !== 'display',
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })

  return (
    <ToggleableInputStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
    >
      <ToggleableInputLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <ToggleableInputField
          inputRef={inputRef}
          inputProps={inputProps}
          editOptions={editCompleteOptions}
        />
        <ToggleableInputDisplay />
      </ToggleableInputLayout>
    </ToggleableInputStateManager>
  )
}

export const ToggleableInput = Object.assign(ToggleableInputComponent, {
  StateManager: ToggleableInputStateManager,
  Layout: ToggleableInputLayout,
  Field: ToggleableInputField,
  Display: ToggleableInputDisplay,
  Context: ToggleableInputContext,
  Provider: ToggleableInputContext.Provider,
  Consumer: ToggleableInputContext.Consumer,
})
