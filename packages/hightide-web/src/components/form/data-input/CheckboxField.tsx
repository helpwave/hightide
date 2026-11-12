import { Checkbox, type CheckboxProps } from '../../data-input/boolean/Checkbox'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, type WiredKeys } from './createFormInputField'

export const CheckboxField = createFormInputField<boolean, Omit<CheckboxProps, WiredKeys>>((field, extra) => (
  <Checkbox
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
