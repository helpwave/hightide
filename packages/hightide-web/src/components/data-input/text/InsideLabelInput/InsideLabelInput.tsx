import type { ComponentRef, ReactNode, Ref } from 'react'
import { useId } from 'react'
import type { ControllableDOMInputProps } from '../../domInput'
import { useStateStore, useStateStoreBindings } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type { TextInput, TextInputElementProps } from '../TextInput'
import { InsideLabelInputContext } from './InsideLabelInputContext'
import { InsideLabelInputField } from './InsideLabelInputField'
import { InsideLabelInputLabel, type InsideLabelInputLabelProps } from './InsideLabelInputLabel'
import { InsideLabelInputLayout, type InsideLabelInputLayoutProps } from './InsideLabelInputLayout'
import { InsideLabelInputStateManager } from './InsideLabelInputStateManager'
import { type InsideLabelInputEvent, type InsideLabelInputState } from './InsideLabelInputState'

export type InsideLabelInputProps = ControllableDOMInputProps<string, InsideLabelInputEvent> & {
  id?: string,
  label: ReactNode,
  layoutRef?: Ref<ComponentRef<typeof InsideLabelInputLayout>>,
  layoutProps?: InsideLabelInputLayoutProps,
  inputRef?: Ref<ComponentRef<typeof TextInput.Input>>,
  inputProps?: TextInputElementProps,
  labelRef?: Ref<ComponentRef<typeof InsideLabelInputLabel>>,
  labelProps?: Omit<InsideLabelInputLabelProps, 'label'>,
}

const InsideLabelInputComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id: customId,
  label,
  layoutRef,
  layoutProps,
  inputRef,
  inputProps,
  labelRef,
  labelProps,
}: InsideLabelInputProps) => {
  const generatedId = useId()
  const id = customId ?? generatedId
  const labelId = id + '-label'
  const store = useStateStore<InsideLabelInputState>({
    value: value ?? initialValue ?? '',
    isFocused: false,
  })
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      value: { value, onValueChange },
    },
  })

  return (
    <InsideLabelInputStateManager
      state={store}
      onStateChange={onStateChange}
      onStateEvent={onStateEvent}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
    >
      <InsideLabelInputLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <InsideLabelInputField
          id={id}
          labelId={labelId}
          inputRef={inputRef}
          inputProps={inputProps}
        />
        <InsideLabelInputLabel
          {...labelProps}
          ref={ReactUtils.assingRefsBuilder([labelRef])}
          id={labelId}
          label={label}
        />
      </InsideLabelInputLayout>
    </InsideLabelInputStateManager>
  )
}

export const InsideLabelInput = Object.assign(InsideLabelInputComponent, {
  StateManager: InsideLabelInputStateManager,
  Layout: InsideLabelInputLayout,
  Field: InsideLabelInputField,
  Label: InsideLabelInputLabel,
  Context: InsideLabelInputContext,
  Provider: InsideLabelInputContext.Provider,
  Consumer: InsideLabelInputContext.Consumer,
})
