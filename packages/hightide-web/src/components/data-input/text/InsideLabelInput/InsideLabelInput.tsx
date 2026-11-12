import type { ComponentRef, ReactNode, Ref } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import type { TextInput, TextInputElementProps } from '../TextInput'
import { InsideLabelInputContext } from './InsideLabelInputContext'
import { InsideLabelInputField } from './InsideLabelInputField'
import { InsideLabelInputLabel, type InsideLabelInputLabelProps } from './InsideLabelInputLabel'
import { InsideLabelInputLayout, type InsideLabelInputLayoutProps } from './InsideLabelInputLayout'
import { InsideLabelInputStateManager, type InsideLabelInputStateManagerProps } from './InsideLabelInputStateManager'

export type InsideLabelInputProps = Omit<InsideLabelInputStateManagerProps, 'children'> & {
  label: ReactNode,
  layoutRef?: Ref<ComponentRef<typeof InsideLabelInputLayout>>,
  layoutProps?: InsideLabelInputLayoutProps,
  inputRef?: Ref<ComponentRef<typeof TextInput.Input>>,
  inputProps?: TextInputElementProps,
  labelRef?: Ref<ComponentRef<typeof InsideLabelInputLabel>>,
  labelProps?: Omit<InsideLabelInputLabelProps, 'children'>,
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
  id,
  label,
  layoutRef,
  layoutProps,
  inputRef,
  inputProps,
  labelRef,
  labelProps,
}: InsideLabelInputProps) => {
  return (
    <InsideLabelInputStateManager
      value={value}
      initialValue={initialValue}
      onValueChange={onValueChange}
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
          inputRef={inputRef}
          inputProps={inputProps}
        />
        <InsideLabelInputLabel
          {...labelProps}
          ref={ReactUtils.assingRefsBuilder([labelRef])}
        >
          {label}
        </InsideLabelInputLabel>
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
