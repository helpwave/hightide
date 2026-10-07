import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useContext } from 'react'
import { countFormErrors, createFormStore, FormStoreProvider, isValidationRunnerInvalid, type FormStore, type FormValidationRunnerError, type FormValues, type ValidationRunnerState } from '@helpwave/hightide-utils/form'
import type { FormFieldDataHandling } from './FormField'
import type { FormValue, UseCreateFormResult } from './useCreateForm'

export type FormContextType<T extends FormValue> = UseCreateFormResult<T>
export const FormContext = createContext<FormContextType<FormValues> | null>(null)

export type FormProviderProps<T extends FormValue> = PropsWithChildren & {
  state: FormContextType<T>,
}

export const FormProvider = <T extends FormValue>({ children, state }: FormProviderProps<T>) => {
  return (
    <FormContext.Provider value={state as FormContextType<FormValues>}>
      <FormStoreProvider store={state.store}>
        {children}
      </FormStoreProvider>
    </FormContext.Provider>
  )
}

export function useForm<T extends FormValue>(): FormContextType<T> {
  const context = useContext(FormContext)
  if (!context) throw new Error('useForm must be used inside a FormProvider')
  return context as FormContextType<T>
}

export interface UseFormFieldParameter<T extends FormValue> {
  key: keyof T,
}

export type FormFieldResult<T> = {
  store: FormStore<FormValue>,
  value: T,
  errors: string[],
  validationRunnerError: ValidationRunnerState | undefined,
  touched: boolean,
  dataProps: FormFieldDataHandling<T>,
  registerRef: (el: HTMLElement | null) => void,
  updateValue: (value: T) => void,
}

const fallbackStore = createFormStore<FormValues>({ initialValues: {} })

const emptyFieldErrors: string[] = []

export function useFormField<T extends FormValue, K extends keyof T>(key: K): FormFieldResult<T[K]> | null {
  const context = useContext(FormContext) as FormContextType<T> | null
  const store = (context?.store ?? fallbackStore) as FormStore<T>

  const value = store(state => state.values[key])
  const errors = store(state => state.errors[key]) ?? emptyFieldErrors
  const validationRunnerError = store(state => state.validationRunnerError[key])
  const touched = store(state => state.touchedValues[key] ?? false)

  const visibleErrors = touched
    ? [...errors, ...(validationRunnerError?.errors ?? [])]
    : []

  const onValueUpdate = useCallback((next: T[K]) => {
    store.getState().setValue(key, next)
  }, [key, store])

  const onValueCommit = useCallback((next: T[K]) => {
    store.getState().setTouchedValue(key, true)
    store.getState().setValue(key, next)
    context?.notifyUpdate([key], { [key]: next } as unknown as Partial<T>)
  }, [context, key, store])

  const updateValue = useCallback((next: T[K]) => {
    store.getState().setValue(key, next)
    context?.notifyUpdate([key], { [key]: next } as unknown as Partial<T>)
  }, [context, key, store])

  if (!context) return null

  return {
    store: store as FormStore<FormValue>,
    value,
    errors: visibleErrors,
    validationRunnerError,
    touched,
    dataProps: {
      value,
      onValueUpdate,
      onValueCommit,
    },
    registerRef: context.registerRef(key),
    updateValue,
  }
}

export type UseFormObserverProps<T extends FormValue> = {
  formStore?: FormStore<T>,
}

export interface FormObserverResult<T extends FormValue> {
  store: FormStore<T>,
  values: T,
  touchedValues: Partial<Record<keyof T, boolean>>,
  errors: Partial<Record<keyof T, string[]>>,
  validationRunnerError: FormValidationRunnerError<T>,
  hasErrors: boolean,
}

export function useFormObserver<T extends FormValue>({ formStore }: UseFormObserverProps<T> = {}): FormObserverResult<T> | null {
  const context = useContext(FormContext)
  const store = (formStore ?? context?.store ?? fallbackStore) as FormStore<T>

  const values = store(state => state.values)
  const errors = store(state => state.errors)
  const validationRunnerError = store(state => state.validationRunnerError)
  const touchedValues = store(state => state.touchedValues)

  if (!formStore && !context) return null

  return {
    store,
    values,
    errors,
    validationRunnerError,
    touchedValues,
    hasErrors: countFormErrors(errors, validationRunnerError) > 0,
  }
}

export interface UseFormObserverKeyProps<T extends FormValue, K extends keyof T> {
  formStore?: FormStore<T>,
  formKey: K,
}

export interface FormObserverKeyResult<T extends FormValue, K extends keyof T> {
  store: FormStore<T>,
  value: T[K],
  errors: string[],
  validationRunnerError: ValidationRunnerState | undefined,
  hasError: boolean,
  touched: boolean,
}

export function useFormObserverKey<T extends FormValue, K extends keyof T>({ formStore, formKey }: UseFormObserverKeyProps<T, K>): FormObserverKeyResult<T, K> | null {
  const context = useContext(FormContext)
  const store = (formStore ?? context?.store ?? fallbackStore) as FormStore<T>

  const value = store(state => state.values[formKey])
  const errors = store(state => state.errors[formKey]) ?? emptyFieldErrors
  const validationRunnerError = store(state => state.validationRunnerError[formKey])
  const touched = store(state => state.touchedValues[formKey] ?? false)

  if (!formStore && !context) return null

  return {
    store,
    value,
    errors,
    validationRunnerError,
    touched,
    hasError: errors.length > 0 || isValidationRunnerInvalid(validationRunnerError),
  }
}
