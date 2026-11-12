import { FlexibleDateTimeInput, type FlexibleDateTimeInputProps } from '../../data-input/dateTime/FlexibleDateTimeInput'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, mergeBlur, type WiredKeys } from './createFormInputField'

export const FlexibleDateTimeInputField = createFormInputField<Date | null, Omit<FlexibleDateTimeInputProps, WiredKeys>>((field, extra) => (
  <FlexibleDateTimeInput
    {...extra}
    {...bindState(field)}
    onValueChange={field.onValueChange}
    controlRef={elementRef(field.ref)}
    controlProps={mergeBlur({ ...ariaProps(field as FormFieldInputProps<unknown>), ...extra.controlProps }, field.onInteracted)}
  />
))
