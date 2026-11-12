import { NumberInput, type NumberInputProps } from '../../data-input/number/NumberInput'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, mergeBlur, useFormInputInteraction, type FormInputInteractionConfig, type WiredKeys } from './createFormInputField'

type NumberInputControlProps = { field: FormFieldInputProps<number> } & Omit<NumberInputProps, WiredKeys> & FormInputInteractionConfig

const NumberInputControl = ({
  field,
  debounce,
  throttle,
  delay,
  ...input
}: NumberInputControlProps) => {
  const interaction = useFormInputInteraction({ debounce, throttle, delay }, field.onInteracted)
  return (
    <NumberInput
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

export const NumberInputField = createFormInputField<number, Omit<NumberInputProps, WiredKeys> & FormInputInteractionConfig>((field, extra) => (
  <NumberInputControl field={field} {...extra} />
))
