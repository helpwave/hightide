import type { ReactNode } from 'react'
import { createFormState, type FormEvent, type FormFieldStateRule, type FormState, type FormValidator } from '@helpwave/hightide-utils/form'
import { useStateStore, useStateStoreBindings, type StateStoreBindingChange } from '@helpwave/hightide-utils/hooks'
import { FormContext, type FormValue } from './FormContext'
import { FormElement } from './FormForm'
import { FormObserver, FormObserverKey } from './FormObserver'
import { FormStateManager, type ErrorScrollOptions } from './FormStateManager'

export type { ErrorScrollOptions } from './FormStateManager'

export type FormProps<T extends FormValue> = {
  initialValues: T,
  validators: FormValidator<T>[],
  fieldStateRules: FormFieldStateRule<T>[],
  onStateEvent: (event: FormEvent<T>) => void,
  onSubmit: (value: T) => void,
  value?: T,
  onValueChange?: (value: T) => StateStoreBindingChange<T> | void,
  errorScrollOptions?: ErrorScrollOptions,
  children?: ReactNode,
}

function FormComponent<T extends FormValue>({
  initialValues,
  validators,
  fieldStateRules,
  onStateEvent,
  onSubmit,
  value,
  onValueChange,
  errorScrollOptions,
  children,
}: FormProps<T>) {
  const store = useStateStore<FormState<T>>(() => createFormState({
    initialValues: value ?? initialValues,
    validators,
    fieldStateRules,
  }))
  const onStateChange = useStateStoreBindings({
    store,
    bindings: {
      values: { value, onValueChange },
    },
  })

  return (
    <FormStateManager
      state={store}
      onStateEvent={onStateEvent}
      onStateChange={onStateChange}
      errorScrollOptions={errorScrollOptions}
      onSubmit={onSubmit}
    >
      {children}
    </FormStateManager>
  )
}

export const Form = Object.assign(FormComponent, {
  Form: FormElement,
  StateManager: FormStateManager,
  Context: FormContext,
  Provider: FormContext.Provider,
  Consumer: FormContext.Consumer,
  Observer: FormObserver,
  ObserverKey: FormObserverKey,
})
