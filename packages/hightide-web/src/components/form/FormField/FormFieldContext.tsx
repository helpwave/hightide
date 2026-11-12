import type { ReactNode, RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { HTMLAttributes } from 'react'
import type { FormError } from '@helpwave/hightide-utils/utils'
import type { FormValue } from '../Form/FormContext'

export type FormFieldAriaAttributes = Pick<HTMLAttributes<HTMLElement>, 'aria-labelledby' | 'aria-describedby' | 'aria-disabled' | 'aria-readonly' | 'aria-invalid' | 'aria-errormessage' | 'aria-required'>

export type FormFieldIds = {
  input: string,
  error: string,
  label: string,
  description: string,
}

export type FormFieldContextValue<
  T extends FormValue = FormValue,
  K extends keyof T = keyof T
> = {
  name: K,
  ids: FormFieldIds,
  label?: ReactNode,
  description?: ReactNode,
  errors: FormError[],
  value: T[K],
  hasInteracted: boolean,
  isRequired: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
  isInvalid: boolean,
  aria: FormFieldAriaAttributes,
  ref: RefObject<HTMLElement | null>,
  onValueChange: (value: T[K]) => void,
  onInteracted: () => void,
}

export const FormFieldContext = createContext<FormFieldContextValue<FormValue, string> | null>(null)

export function useFormFieldContext<
  T extends FormValue = FormValue,
  K extends keyof T = keyof T
>(): FormFieldContextValue<T, K> {
  const context = useContext(FormFieldContext)
  if (!context) throw new Error('useFormFieldContext must be used inside a FormField.StateManager')
  return context as unknown as FormFieldContextValue<T, K>
}
