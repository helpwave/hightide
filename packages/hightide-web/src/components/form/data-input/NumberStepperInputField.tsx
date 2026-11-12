import { NumberStepperInput, type NumberStepperInputProps } from '../../data-input/number/NumberStepperInput'
import type { FormFieldInputProps } from '../FormField'
import { ariaProps, bindState, createFormInputField, elementRef, mergeBlur, useFormInputInteraction, type FormInputInteractionConfig, type WiredKeys } from './createFormInputField'

type NumberStepperInputControlProps = { field: FormFieldInputProps<number> } & Omit<NumberStepperInputProps, WiredKeys> & FormInputInteractionConfig

const NumberStepperInputControl = ({
  field,
  debounce,
  throttle,
  delay,
  ...input
}: NumberStepperInputControlProps) => {
  const interaction = useFormInputInteraction({ debounce, throttle, delay }, field.onInteracted)
  return (
    <NumberStepperInput
      {...input}
      {...bindState(field)}
      onValueChange={(value) => {
        field.onValueChange(value)
        interaction.schedule()
      }}
      fieldRef={elementRef(field.ref)}
      fieldProps={{
        ...input.fieldProps,
        inputProps: mergeBlur({ ...ariaProps(field as FormFieldInputProps<unknown>), ...input.fieldProps?.inputProps }, interaction.interactNow),
      }}
    />
  )
}

export const NumberStepperInputField = createFormInputField<number, Omit<NumberStepperInputProps, WiredKeys> & FormInputInteractionConfig>((field, extra) => (
  <NumberStepperInputControl field={field} {...extra} />
))
