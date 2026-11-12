import { Select, type SelectProps } from '../../data-input/selection/Select'
import type { FormValue } from '../Form/FormContext'
import type { FormFieldInputProps } from '../FormField'
import { FormField } from '../FormField/FormField'
import { ariaProps, bindState, elementRef, type FormInputFieldOwnProps, type StringKey, type WiredKeys } from './createFormInputField'

export function SelectField<T extends FormValue, K extends StringKey<T>>(
  props: FormInputFieldOwnProps<T, K> & Omit<SelectProps<NonNullable<T[K]>>, WiredKeys>
) {
  const { name, label, description, requiredIndicator, ids, ...extra } = props
  return (
    <FormField<T, K>
      name={name}
      label={label}
      description={description}
      requiredIndicator={requiredIndicator}
      ids={ids}
    >
      {(field) => (
        <Select<NonNullable<T[K]>>
          {...extra}
          {...bindState(field)}
          value={field.value as NonNullable<T[K]> | undefined}
          onValueChange={(value) => {
            if (value == null) return
            field.onValueChange(value as T[K])
          }}
          onClose={() => {
            extra.onClose?.()
            field.onInteracted()
          }}
          triggerRef={elementRef(field.ref)}
          triggerProps={{
            ...ariaProps(field as FormFieldInputProps<unknown>),
            ...extra.triggerProps,
            onBlur: (event) => {
              extra.triggerProps?.onBlur?.(event)
              field.onInteracted()
            },
          }}
        />
      )}
    </FormField>
  )
}
