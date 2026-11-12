import type { RefObject } from 'react'
import { createContext, useCallback, useContext } from 'react'
import { countFormErrors, createFormState, isValidationRunnerInvalid, type FormError, type FormEvent, type FormFieldErrors, type FormStore, type FormValidationRunnerError, type FormValue, type ValidationRunnerState } from '@helpwave/hightide-utils/form'
import { createStateStore, useStateStoreSelector } from '@helpwave/hightide-utils/hooks'

type FormFieldDataHandling<T> = {
  value: T,
  onValueChange: (value: T) => void,
  onInteracted: () => void,
}

export type { FormValue }

export type FormContextType<T extends FormValue> = {
  store: FormStore<T>,
  dispatch: (event: FormEvent<T>) => void,
  reset: () => void,
  submit: () => void,
  updateValues: (updater: Partial<T> | ((current: T) => Partial<T>)) => void,
  markInteracted: (fieldKeys: (keyof T)[]) => void,
  validateAll: () => number,
  elementsRefs: RefObject<Record<keyof T, HTMLElement | undefined>>,
}
export const FormContext = createContext<FormContextType<FormValue> | null>(null)

export function useForm<T extends FormValue>(): FormContextType<T> {
  const context = useContext(FormContext)
  if (!context) throw new Error('useForm must be used inside a FormProvider')
  return context as FormContextType<T>
}

export interface UseFormFieldParameter<T extends FormValue> {
  key: keyof T,
}

export type FromFieldState<T> = {
  store: FormStore<FormValue>,
  value: T,
  errors: FormError[],
  validationRunnerError: ValidationRunnerState | undefined,
  hasInteracted: boolean,
  onInteracted: () => void,
  dataProps: FormFieldDataHandling<T>,
  updateValue: (value: T) => void,
}

const fallbackStore = createStateStore(createFormState<FormValue>({ initialValues: {} }))

const emptyFieldErrors: FormError[] = []

export function useFormField<T extends FormValue, K extends Extract<keyof T, string>>(key: K): FromFieldState<T[K]> | null {
  const context = useContext(FormContext) as FormContextType<T> | null
  const store = (context?.store ?? fallbackStore) as FormStore<T>

  const value = useStateStoreSelector(store, state => state.values[key])
  const errors = useStateStoreSelector(store, state => state.errors[key] ?? emptyFieldErrors)
  const validationRunnerError = useStateStoreSelector(store, state => state.validationRunnerError[key])
  const hasInteracted = useStateStoreSelector(store, state => state.hasInteracted[key] ?? false)

  const visibleErrors = hasInteracted
    ? [...errors, ...(validationRunnerError?.errors ?? [])]
    : []

  const onValueUpdate = useCallback((next: T[K]) => {
    context?.dispatch({ type: 'changed', name: key, value: next })
  }, [context, key])

  const onInteracted = useCallback(() => {
    context?.dispatch({ type: 'interacted', name: key })
  }, [context, key])

  const updateValue = useCallback((next: T[K]) => {
    context?.dispatch({ type: 'changed', name: key, value: next })
  }, [context, key])

  if (!context) return null

  return {
    store: store as FormStore<FormValue>,
    value,
    errors: visibleErrors,
    validationRunnerError,
    hasInteracted,
    onInteracted,
    dataProps: {
      value,
      onValueChange: onValueUpdate,
      onInteracted,
    },
    updateValue,
  }
}

export type UseFormObserverProps<T extends FormValue> = {
  formStore?: FormStore<T>,
}

export interface FormObserverResult<T extends FormValue> {
  store: FormStore<T>,
  values: T,
  hasInteracted: Partial<Record<keyof T, boolean>>,
  errors: FormFieldErrors<T>,
  validationRunnerError: FormValidationRunnerError<T>,
  hasErrors: boolean,
}

export function useFormObserver<T extends FormValue>({ formStore }: UseFormObserverProps<T> = {}): FormObserverResult<T> | null {
  const context = useContext(FormContext)
  const store = (formStore ?? context?.store ?? fallbackStore) as FormStore<T>

  const values = useStateStoreSelector(store, state => state.values)
  const errors = useStateStoreSelector(store, state => state.errors)
  const validationRunnerError = useStateStoreSelector(store, state => state.validationRunnerError)
  const hasInteracted = useStateStoreSelector(store, state => state.hasInteracted)

  if (!formStore && !context) return null

  return {
    store,
    values,
    errors,
    validationRunnerError,
    hasInteracted,
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
  errors: FormError[],
  validationRunnerError: ValidationRunnerState | undefined,
  hasError: boolean,
  hasInteracted: boolean,
}

export function useFormObserverKey<T extends FormValue, K extends keyof T>({ formStore, formKey }: UseFormObserverKeyProps<T, K>): FormObserverKeyResult<T, K> | null {
  const context = useContext(FormContext)
  const store = (formStore ?? context?.store ?? fallbackStore) as FormStore<T>

  const value = useStateStoreSelector(store, state => state.values[formKey])
  const errors = useStateStoreSelector(store, state => state.errors[formKey] ?? emptyFieldErrors)
  const validationRunnerError = useStateStoreSelector(store, state => state.validationRunnerError[formKey])
  const hasInteracted = useStateStoreSelector(store, state => state.hasInteracted[formKey] ?? false)

  if (!formStore && !context) return null

  return {
    store,
    value,
    errors,
    validationRunnerError,
    hasInteracted,
    hasError: errors.length > 0 || isValidationRunnerInvalid(validationRunnerError),
  }
}
