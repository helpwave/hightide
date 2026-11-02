import { createContext, useContext } from 'react'
import type { FormStore, FormValues } from './FormStore'

export const FormStoreContext = createContext<FormStore<FormValues> | null>(null)

export function FormStoreProvider<T extends FormValues>({
  store,
  children,
}: {
  store: FormStore<T>,
  children: React.ReactNode,
}) {
  return (
    <FormStoreContext.Provider value={store as FormStore<FormValues>}>
      {children}
    </FormStoreContext.Provider>
  )
}

export function useFormStore<
  T extends FormValues
>(): FormStore<T> {
  const store = useContext(FormStoreContext)

  if (!store) {
    throw new Error(
      'FormField must be used inside a Form'
    )
  }

  return store as FormStore<T>
}