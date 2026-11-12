import { Combobox, type ComboboxProps } from '../../data-input/selection/Combobox'
import type { FormValue } from '../Form/FormContext'
import type { FormFieldInputProps } from '../FormField'
import { FormField } from '../FormField/FormField'
import { ariaProps, bindState, elementRef, type FormInputFieldOwnProps, type StringKey, type WiredKeys } from './createFormInputField'

export function ComboboxField<T extends FormValue, K extends StringKey<T>>(
  props: FormInputFieldOwnProps<T, K> & Omit<ComboboxProps<NonNullable<T[K]>>, WiredKeys>
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
        <Combobox<NonNullable<T[K]>>
          {...extra}
          {...bindState(field)}
          value={field.value as NonNullable<T[K]> | undefined}
          onValueChange={(value) => {
            field.onValueChange(value as T[K])
            field.onInteracted()
          }}
          searchbarRef={elementRef(field.ref)}
          searchbarProps={{ ...ariaProps(field as FormFieldInputProps<unknown>), ...extra.searchbarProps }}
        />
      )}
    </FormField>
  )
}
