import { useCallback, useMemo, useRef, type ReactNode } from 'react'
import { collectFormErrors, countFormErrors, FormStoreProvider, formStateTransition, isValidationRunnerInvalid, type FormEvent, type FormState, type FormStore } from '@helpwave/hightide-utils/form'
import { useStateMachine } from '@helpwave/hightide-utils/hooks'
import { DOMUtils } from '../../../utils/dom'
import { FormContext, type FormContextType, type FormValue } from './FormContext'

export const defaultScrollOptions: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }

export type ErrorScrollOptions = {
  scrollToElements?: boolean,
  scrollOptions?: ScrollIntoViewOptions,
}

export const defaultErrorScrollOptions: Required<ErrorScrollOptions> = {
  scrollToElements: true,
  scrollOptions: defaultScrollOptions,
}

export type FormStateManagerProps<T extends FormValue> = {
  state: FormStore<T>,
  onStateEvent: (event: FormEvent<T>) => void,
  onStateChange: (state: FormState<T>) => void,
  errorScrollOptions?: ErrorScrollOptions,
  onSubmit: (value: T) => void,
  children?: ReactNode,
}

export function FormStateManager<T extends FormValue>({
  state: store,
  onStateEvent,
  onStateChange,
  errorScrollOptions = defaultErrorScrollOptions,
  onSubmit,
  children,
}: FormStateManagerProps<T>) {
  const scrollToElements = errorScrollOptions.scrollToElements ?? defaultErrorScrollOptions.scrollToElements
  const scrollOptions = errorScrollOptions.scrollOptions ?? defaultErrorScrollOptions.scrollOptions
  const elementsRefs = useRef<Record<keyof T, HTMLElement | undefined>>({} as Record<keyof T, HTMLElement | undefined>)
  const machine = useStateMachine({
    state: store,
    transition: (state: FormState<T>, event: FormEvent<T>) => formStateTransition(state, event),
    onStateChange,
    onStateEvent,
  })
  const { dispatch } = machine
  const markInteracted = useCallback((fieldKeys: (keyof T)[]) => {
    for (const key of fieldKeys) {
      if (typeof key !== 'string') continue
      dispatch({ type: 'interacted', name: key as Extract<keyof T, string> })
    }
  }, [dispatch])
  const validateAll = useCallback(() => {
    const state = store.getSnapshot()
    const errors = collectFormErrors(state.validators, state.values)
    const fieldKeys = Object.keys(state.values) as Extract<keyof T, string>[]
    markInteracted(fieldKeys)
    for (const key of fieldKeys) {
      dispatch({
        type: 'validated',
        name: key,
        errors: errors[key] ?? [],
      })
    }
    const next = store.getSnapshot()
    return countFormErrors(next.errors, next.validationRunnerError)
  }, [dispatch, markInteracted, store])
  const submit = useCallback(() => {
    const errorCount = validateAll()
    const { values, errors, validationRunnerError } = store.getSnapshot()
    if (errorCount === 0) {
      onSubmit(values)
      return
    }
    if (!scrollToElements) return
    const errorInputs = (Object.keys(values) as (keyof T)[])
      .filter((key) => (errors[key]?.length ?? 0) > 0 || isValidationRunnerInvalid(validationRunnerError[key]))
      .map((key) => elementsRefs.current[key])
      .filter((element): element is HTMLElement => element !== null && element !== undefined)
    DOMUtils.focusFirst(errorInputs, scrollOptions)
  }, [elementsRefs, onSubmit, scrollOptions, scrollToElements, store, validateAll])
  const reset = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [dispatch])
  const updateValues = useCallback((updater: Partial<T> | ((current: T) => Partial<T>)) => {
    const current = store.getSnapshot().values
    const nextUpdate = typeof updater === 'function' ? updater(current) : updater
    dispatch({ type: 'changeValues', values: nextUpdate })
  }, [dispatch, store])
  const form = useMemo<FormContextType<T>>(() => ({
    store,
    dispatch,
    reset,
    submit,
    updateValues,
    markInteracted,
    validateAll,
    elementsRefs,
  }), [dispatch, elementsRefs, markInteracted, reset, store, submit, updateValues, validateAll])

  return (
    <FormContext.Provider value={form as FormContextType<FormValue>}>
      <FormStoreProvider store={store}>
        {children}
      </FormStoreProvider>
    </FormContext.Provider>
  )
}
