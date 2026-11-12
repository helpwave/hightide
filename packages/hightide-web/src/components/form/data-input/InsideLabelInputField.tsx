import type { ReactNode } from 'react'
import { InsideLabelInput, type InsideLabelInputProps } from '../../data-input/text/InsideLabelInput'
import type { FormValue } from '../Form/FormContext'
import type { FormFieldInputProps } from '../FormField'
import { FormField } from '../FormField/FormField'
import { ariaProps, bindState, elementRef, mergeBlur, useFormInputInteraction, type FieldKey, type FormInputFieldOwnProps, type FormInputInteractionConfig, type WiredKeys } from './createFormInputField'

type InsideLabelControlProps<T extends FormValue, K extends FieldKey<T, string>> = {
  field: FormFieldInputProps<T[K]>,
  label?: ReactNode,
} & Omit<InsideLabelInputProps, WiredKeys | 'label'> & FormInputInteractionConfig

const InsideLabelControl = <T extends FormValue, K extends FieldKey<T, string>>({
  field,
  label,
  debounce,
  throttle,
  delay,
  ...input
}: InsideLabelControlProps<T, K>) => {
  const interaction = useFormInputInteraction({ debounce, throttle, delay }, field.onInteracted)
  return (
    <InsideLabelInput
      {...input}
      {...bindState(field)}
      value={field.value as string}
      label={label ?? ''}
      onValueChange={(value) => {
        field.onValueChange(value as T[K])
        interaction.schedule()
      }}
      inputRef={elementRef(field.ref)}
      inputProps={mergeBlur({ ...ariaProps(field as FormFieldInputProps<unknown>), ...input.inputProps }, interaction.interactNow)}
    />
  )
}

export const InsideLabelInputField = <T extends FormValue, K extends FieldKey<T, string>>(
  props: FormInputFieldOwnProps<T, K> & Omit<InsideLabelInputProps, WiredKeys | 'label'> & FormInputInteractionConfig
) => {
  const { name, label, description, requiredIndicator, ids, ...extra } = props
  return (
    <FormField<T, K>
      name={name}
      description={description}
      requiredIndicator={requiredIndicator}
      ids={ids}
    >
      {(field) => (
        <InsideLabelControl<T, K>
          field={field}
          label={label}
          {...extra}
        />
      )}
    </FormField>
  )
}
