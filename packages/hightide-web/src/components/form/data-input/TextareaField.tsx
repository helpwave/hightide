import { Textarea, type TextareaProps } from '../../data-input/text/Textarea'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, mergeBlur, useFormInputInteraction, type FormInputInteractionConfig, type WiredKeys } from './createFormInputField'

type TextareaControlProps = { field: FormFieldInputProps<string> } & Omit<TextareaProps, WiredKeys> & FormInputInteractionConfig

const TextareaControl = ({
  field,
  debounce,
  throttle,
  delay,
  ...input
}: TextareaControlProps) => {
  const interaction = useFormInputInteraction({ debounce, throttle, delay }, field.onInteracted)
  return (
    <Textarea
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

export const TextareaField = createFormInputField<string, Omit<TextareaProps, WiredKeys> & FormInputInteractionConfig>((field, extra) => (
  <TextareaControl field={field} {...extra} />
))
