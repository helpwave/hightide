import { MultiSelect, type MultiSelectProps } from '../../data-input/selection/MultiSelect'
import type { FormValue } from '../Form/FormContext'
import type { FormFieldInputProps } from '../FormField'
import { FormField } from '../FormField/FormField'
import { ariaProps, bindState, elementRef, type FormInputFieldOwnProps, type StringKey } from './createFormInputField'

type ArrayItem<T> = T extends readonly (infer Item)[] ? Item : never

export function MultiSelectField<T extends FormValue, K extends StringKey<T>>(
  props: FormInputFieldOwnProps<T, K> & MultiSelectProps<ArrayItem<NonNullable<T[K]>>>
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
        <MultiSelect<ArrayItem<NonNullable<T[K]>>>
          {...extra}
          {...bindState(field)}
          value={field.value as ArrayItem<NonNullable<T[K]>>[] | undefined}
          onValueChange={(value) => {
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
