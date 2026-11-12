import { createContext, useContext } from 'react'
import type { FormStore, FormValue } from './FormStore'

export const FormStoreContext = createContext<FormStore<FormValue> | null>(null)

export function FormStoreProvider<T extends FormValue>({
  store,
  children,
}: {
  store: FormStore<T>,
  children: React.ReactNode,
}) {
  return (
    <FormStoreContext.Provider value={store as FormStore<FormValue>}>
      {children}
    </FormStoreContext.Provider>
  )
}

export function useFormStore<
  T extends FormValue
>(): FormStore<T> {
  const store = useContext(FormStoreContext)

  if (!store) {
    throw new Error(
      'FormField must be used inside a Form'
    )
  }

  return store as FormStore<T>
}