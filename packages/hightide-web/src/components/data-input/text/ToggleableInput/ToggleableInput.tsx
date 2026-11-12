import type { ComponentRef, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type { TextInputElementProps } from '../TextInput'
import { ToggleableInputContext } from './ToggleableInputContext'
import { ToggleableInputDisplay } from './ToggleableInputDisplay'
import { ToggleableInputField, type ToggleableInputEditOptions, type ToggleableInputFieldProps } from './ToggleableInputField'
import { ToggleableInputLayout, type ToggleableInputLayoutProps } from './ToggleableInputLayout'
import { ToggleableInputStateManager, type ToggleableInputStateManagerProps } from './ToggleableInputStateManager'

export type ToggleableInputProps = Omit<ToggleableInputStateManagerProps, 'children'> & {
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

  return (
    <ToggleableInputStateManager
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
      initialEditingState={initialEditingState}
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
