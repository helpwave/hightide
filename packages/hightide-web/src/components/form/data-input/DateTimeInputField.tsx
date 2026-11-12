import { DateTimeInput, type DateTimeInputProps } from '../../data-input/dateTime/DateTimeInput'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, mergeBlur, type WiredKeys } from './createFormInputField'

export const DateTimeInputField = createFormInputField<Date | null, Omit<DateTimeInputProps, WiredKeys>>((field, extra) => (
  <DateTimeInput
    {...extra}
    {...bindState(field)}
    onValueChange={field.onValueChange}
    controlRef={elementRef(field.ref)}
    controlProps={mergeBlur({ ...ariaProps(field as FormFieldInputProps<unknown>), ...extra.controlProps }, field.onInteracted)}
  />
))
