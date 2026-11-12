import type { ReactNode } from 'react'
import { useStateStoreSelector } from '../hooks/state-machine/useStateStore'
import type { FormError, FormValue, ValidationRunner } from './FormStore'
import { useFormStore } from './FormStoreContext'

const emptyFieldErrors: FormError[] = []

const defaultFlags = {
  isRequired: false,
  isDisabled: false,
  isReadOnly: false,
}

export type FormFieldWrapperBag<T extends FormValue, K extends keyof T> = {
  name: K,
  value: T[K],
  errors: FormError[],
  validationRunnerError: ValidationRunner | undefined,
  hasInteracted: boolean,
  isRequired: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
}

type FormFieldWrapperProps<T extends FormValue, K extends keyof T> = {
  name: K,
  children: (field: FormFieldWrapperBag<T, K>) => ReactNode,
}

export function FormFieldWrapper<T extends FormValue, K extends keyof T>({
  name,
  children,
}: FormFieldWrapperProps<T, K>) {
  const store = useFormStore<T>()
  const value = useStateStoreSelector(store, state => state.values[name])
  const errors = useStateStoreSelector(store, state => state.errors[name] ?? emptyFieldErrors)
  const validationRunnerError = useStateStoreSelector(store, state => state.validationRunnerError[name])
  const hasInteracted = useStateStoreSelector(store, state => state.hasInteracted[name] ?? false)
  const flags = useStateStoreSelector(store, state => state.fieldFlags[name] ?? defaultFlags)

  return children({
    name,
    value,
    errors,
    validationRunnerError,
    hasInteracted,
    isRequired: flags.isRequired,
    isDisabled: flags.isDisabled,
    isReadOnly: flags.isReadOnly,
  })
}
