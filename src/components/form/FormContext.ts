import React, { useSyncExternalStore } from 'react'
import type { FormStore, FormValue } from './FormStore'

export type FormContextType<T extends FormValue> = {
  store: FormStore<T>,
  submit: (value: T) => void,
  reset: () => void,
  update: (value: Partial<T>) => void,
  validateAll: () => void,
  registerRef: (key: keyof T) => (el: HTMLElement | null) => void,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = React.createContext<FormContextType<any> | null>(null)

export function useFormContext<T extends FormValue>() {
  const ctx = React.useContext(FormContext)
  if (!ctx) throw new Error('FormContext is only available inside a <Form>')
  return ctx as FormContextType<T>
}

export function useFormField<T extends FormValue, K extends keyof T>(key: K) {
  const { store } = useFormContext<T>()

  const value = useSyncExternalStore(
    cb => store.subscribe(key, cb),
    () => store.getValue(key)
  )

  const error = useSyncExternalStore(
    cb => store.subscribe(key, cb),
    () => store.getError(key)
  )

  return {
    value,
    invalidDescription: error,
    disabled: false,
    readOnly: false,
    onValueChange: (value: T[K]) => store.setValue(key, value),
    onEditComplete: (value: T[K]) => store.setValue(key, value),
  }
}