import type { ReactNode, RefObject } from 'react'
import type { FormFieldAriaAttributes } from './FormFieldContext'
import { useFormFieldContext } from './FormFieldContext'
import type { FormValue } from '../Form/FormContext'

export type FormFieldInputProps<T> = FormFieldAriaAttributes & {
  id: string,
  ref: RefObject<HTMLElement | null>,
  value: T,
  onValueChange: (value: T) => void,
  onInteracted: () => void,
  isInvalid: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
  isRequired: boolean,
}

export type FormFieldInputWrapperProps<
  T extends FormValue,
  K extends Extract<keyof T, string>
> = {
  children: (props: FormFieldInputProps<T[K]>) => ReactNode,
}

export function FormFieldInputWrapper<
  T extends FormValue,
  K extends Extract<keyof T, string>
>({ children }: FormFieldInputWrapperProps<T, K>) {
  const field = useFormFieldContext<T, K>()

  return children({
    id: field.ids.input,
    ref: field.ref,
    value: field.value,
    onValueChange: field.onValueChange,
    onInteracted: field.onInteracted,
    isInvalid: field.isInvalid,
    isDisabled: field.isDisabled,
    isReadOnly: field.isReadOnly,
    isRequired: field.isRequired,
    ...field.aria,
  })
}
