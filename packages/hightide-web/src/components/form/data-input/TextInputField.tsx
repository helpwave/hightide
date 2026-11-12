import { TextInput, type TextInputProps } from '../../data-input/text/TextInput'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, mergeBlur, useFormInputInteraction, type FormInputInteractionConfig, type WiredKeys } from './createFormInputField'

type TextInputControlProps = { field: FormFieldInputProps<string> } & Omit<TextInputProps, WiredKeys> & FormInputInteractionConfig

const TextInputControl = ({
  field,
  debounce,
  throttle,
  delay,
  ...input
}: TextInputControlProps) => {
  const interaction = useFormInputInteraction({ debounce, throttle, delay }, field.onInteracted)
  return (
    <TextInput
      {...input}
      {...bindState(field)}
      onValueChange={(value) => {
        field.onValueChange(value)
        interaction.schedule()
      }}
      inputRef={elementRef(field.ref)}
      inputProps={mergeBlur({ ...ariaProps(field as FormFieldInputProps<unknown>), ...input.inputProps }, interaction.interactNow)}
    />
  )
}

export const TextInputField = createFormInputField<string, Omit<TextInputProps, WiredKeys> & FormInputInteractionConfig>((field, extra) => (
  <TextInputControl field={field} {...extra} />
))
