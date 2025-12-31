import type { PropsWithChildren, ReactNode } from 'react'
import { createContext, useCallback, useContext, useSyncExternalStore } from 'react'
import type { FormValue } from './FormStore'
import type { UseCreateFormResult } from './useCreateForm'
import type { FormFieldDataHandling } from './FormField'

export type FormContextType<T extends FormValue> = UseCreateFormResult<T>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = createContext<FormContextType<any> | null>(null)

export type FormProviderProps<T extends FormValue> = PropsWithChildren & {
  state: FormContextType<T>,
}

export const FormProvider = <T extends FormValue>({ children, state }: FormProviderProps<T>) => {
  return (
    <FormContext.Provider value={state}>
      {children}
    </FormContext.Provider>
  )
}

export function useForm<T extends FormValue>() {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('FormContext is only available inside a <Form>')
  return ctx as FormContextType<T>
}

export type FormFieldResult<T> = {
  value: T,
  error: ReactNode,
  dataProps: FormFieldDataHandling<T>,
  registerRef: (el: HTMLElement | null) => void,
}

export function useFormField<T extends FormValue, K extends keyof T>(key: K): FormFieldResult<T[K]> | null {
  const context = useContext(FormContext)

  const subscribe = useCallback((cb: () => void) => {
    if (!context) return () => { }
    return context.store.subscribe(key, cb)
  }, [context, key])

  const value = useSyncExternalStore(
    subscribe,
    () => context ? context.store.getValue(key) : undefined
  )

  const error = useSyncExternalStore(
    subscribe,
    () => context ? context.store.getError(key) : undefined
  )

  if (!context) return null

  const { registerRef, getDataProps } = context

  return {
    value,
    error,
    dataProps: getDataProps(key),
    registerRef: registerRef(key),
  }
}