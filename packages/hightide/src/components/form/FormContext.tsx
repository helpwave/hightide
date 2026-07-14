import type { PropsWithChildren, ReactNode } from 'react'
import { createContext, useCallback, useContext, useSyncExternalStore } from 'react'
import type { FormStore, FormValue, FormValidationBehaviour } from './FormStore'
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

export interface UseFormFieldParameter<T extends FormValue> {
  key: keyof T,
}

export interface UseFormFieldOptions {
  triggerUpdate?: boolean,
  validationBehaviour?: FormValidationBehaviour,
}

export interface UserFormFieldProps<T extends FormValue> extends UseFormFieldParameter<T>, UseFormFieldOptions {}

export type FormFieldResult<T> = {
  store: FormStore<T>,
  value: T,
  error: ReactNode,
  touched: boolean,
  hasTriedSubmitting: boolean,
  dataProps: FormFieldDataHandling<T>,
  registerRef: (el: HTMLElement | null) => void,
}

export function useFormField<T extends FormValue, K extends keyof T>(key: K, { triggerUpdate = true, validationBehaviour = 'touched' }: UseFormFieldOptions): FormFieldResult<T[K]> | null {
  const context = useContext(FormContext)

  const subscribe = useCallback((cb: () => void) => {
    if (!context) return () => { }
    return context.store.subscribe(key, cb)
  }, [context, key])

  const subscribeAll = useCallback((cb: () => void) => {
    if (!context) return () => { }
    return context.store.subscribe('ALL', cb)
  }, [context])

  const value = useSyncExternalStore(
    subscribe,
    () => context ? context.store.getValue(key) : undefined
  )

  const error = useSyncExternalStore(
    subscribe,
    () => context ? context.store.getError(key) : undefined
  )

  const touched = useSyncExternalStore(
    subscribe,
    () => context ? context.store.getTouched(key) : undefined
  )

  const hasTriedSubmitting = useSyncExternalStore(
    subscribeAll,
    () => context ? context.store.getHasTriedSubmitting() : undefined
  )
  const isShowingErrors =
    validationBehaviour === 'always' ||
    (validationBehaviour === 'touched' && (touched ?? false)) ||
    (validationBehaviour === 'submit' && (hasTriedSubmitting ?? false))


  const getDataProps = useCallback(() => {
    return {
      value,
      onValueChange: (val: T[K]) => context?.store.setValue(key, val),
      onEditComplete: (val: T[K]) => {
        context?.store.setTouched(key)
        context?.store.setValue(key, val, triggerUpdate)
      }
    }
  }, [context?.store, key, triggerUpdate, value])


  if (!context) return null

  const { registerRef } = context

  return {
    store: context.store,
    value,
    error: isShowingErrors ? error : undefined,
    touched: touched ?? false,
    hasTriedSubmitting: hasTriedSubmitting ?? false,
    dataProps: getDataProps(),
    registerRef: registerRef(key),
  }
}

export type UseFormObserverProps<T extends FormValue> = {
  formStore?: FormStore<T>,
}

export interface FormObserverResult<T extends FormValue> {
  store: FormStore<T>,
  values: T,
  touched: Partial<Record<keyof T, boolean>>,
  errors: Partial<Record<keyof T, ReactNode>>,
  hasErrors: boolean,
  hasTriedSubmitting: boolean,
}

export function useFormObserver<T extends FormValue>({ formStore }: UseFormObserverProps<T> = {}) : FormObserverResult<T> | null {
  const context = useContext(FormContext)
  const store = formStore ?? context?.store as FormStore<T>

  const subscribe = useCallback((cb: () => void) => {
    if (!store) return () => { }
    return store.subscribe('ALL', cb)
  }, [store])


  const values = useSyncExternalStore(subscribe, () => store ? store.getAllValues() : undefined)
  const errors = useSyncExternalStore(subscribe, () => store ? store.getErrors() : undefined)
  const touched = useSyncExternalStore(subscribe, () => store ? store.getAllTouched() : undefined)
  const hasErrors = useSyncExternalStore(subscribe, () => store ? store.getHasError() : undefined)
  const hasTriedSubmitting = useSyncExternalStore(subscribe, () => store ? store.getHasTriedSubmitting() : undefined)

  if (!store) return null

  return {
    store,
    values,
    errors,
    touched,
    hasErrors,
    hasTriedSubmitting,
  }
}

export interface UseFormObserverKeyProps<T extends FormValue, K extends keyof T> {
  formStore?: FormStore<T>,
  formKey: K,
}

export interface FormObserverKeyResult<T extends FormValue, K extends keyof T> {
  store: FormStore<T>,
  value: T[K],
  error: ReactNode,
  hasError: boolean,
  touched: boolean,
}

export function useFormObserverKey<T extends FormValue, K extends keyof T>({ formStore, formKey }: UseFormObserverKeyProps<T, K>): FormObserverKeyResult<T, K> | null {
  const context = useContext(FormContext)
  const store = formStore ?? context?.store as FormStore<T>

  const subscribe = useCallback((cb: () => void) => {
    if (!store) return () => { }
    return store.subscribe(formKey, cb)
  }, [store, formKey])

  const value = useSyncExternalStore(subscribe, () => store ? store.getValue(formKey) : undefined)
  const error = useSyncExternalStore(subscribe, () => store ? store.getError(formKey) : undefined)
  const touched = useSyncExternalStore(subscribe, () => store ? store.getTouched(formKey) : undefined)

  if (!store) return null

  return {
    store,
    value,
    error,
    touched,
    hasError: !!error,
  }
}