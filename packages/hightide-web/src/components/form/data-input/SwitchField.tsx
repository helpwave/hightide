import { Switch, type SwitchProps } from '../../data-input/boolean/Switch'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, type WiredKeys } from './createFormInputField'

export const SwitchField = createFormInputField<boolean, Omit<SwitchProps, WiredKeys>>((field, extra) => (
  <Switch
    {...extra}
    {...bindState(field)}
    onValueChange={(value) => {
      field.onValueChange(value)
      field.onInteracted()
    }}
    triggerRef={elementRef(field.ref)}
    triggerProps={{ ...ariaProps(field as FormFieldInputProps<unknown>), ...extra.triggerProps }}
  />
))
