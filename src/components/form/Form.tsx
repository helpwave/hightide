import type { FormHTMLAttributes } from 'react'
import React, { useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { FormEvent, FormStoreProps, FormValue } from './FormStore'
import { FormStore } from './FormStore'
import { FormContext } from './FormContext'

export type FormProps<T extends FormValue> = FormHTMLAttributes<HTMLFormElement> & FormStoreProps<T> & {
  onFormSubmit: (values: T) => void,
  onFormError?: (values: T, errors: Partial<Record<keyof T, ReactNode>>) => void,
  onValueChange?: (values: T) => void,
  isPreventingSubmitDefault?: boolean,
  /* Whether to scroll and focus the first element when submitting with an error or resetting */
  scrollToElements?: boolean,
  scrollOptions?: ScrollIntoViewOptions,
}

export function Form<T extends FormValue>({
  onFormSubmit,
  onFormError,
  onValueChange,
  isPreventingSubmitDefault = true,
  initialValues,
  hasTriedSubmitting,
  validators,
  validationBehaviour,
  scrollToElements = true,
  scrollOptions = { behavior: 'smooth', block: 'center' },
  ...props
}: FormProps<T>) {
  const storeRef = useRef<FormStore<T>>(new FormStore<T>({
    initialValues,
    hasTriedSubmitting,
    validators,
    validationBehaviour
  }))

  useEffect(() => {
    storeRef.current.changeValidationBehavoir(validationBehaviour)
  }, [validationBehaviour])

  useEffect(() => {
    storeRef.current.changeValidators(validators)
  }, [validators])

  const fieldRefs = useRef<Partial<Record<keyof T, HTMLElement | null>>>({})

  const registerRef = useCallback((key: keyof T) => {
    return (el: HTMLElement | null) => {
      fieldRefs.current[key] = el
    }
  },[])

  useEffect(() => {
    const handleUpdate = (event: FormEvent<T>) => {
      if(event.type === 'submit') {
        onFormSubmit(event.values)
      } else if(event.type === 'submitError') {
        onFormError?.(event.values, event.errors)
        if(scrollToElements) {
          const errorInputs = (Object.keys(event.errors) as (keyof T)[])
            .filter((key) => event.errors[key])
            .map((key) => fieldRefs.current[key])
            .filter((el): el is HTMLElement => el !== null && el !== undefined)

          if (errorInputs.length > 0) {
            errorInputs.sort((a, b) => {
              const position = a.compareDocumentPosition(b)
              if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
              if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
              return 0
            })


            errorInputs[0].scrollIntoView(scrollOptions)
            errorInputs[0].focus()
          }
        }
      } else if (event.type === 'reset') {
        if(scrollToElements) {
          const inputs = Object.values(fieldRefs.current)
            .filter((el): el is HTMLElement => el !== null && el !== undefined)
          if (inputs.length > 0) {
            inputs.sort((a, b) => {
              const position = a.compareDocumentPosition(b)
              if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
              if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
              return 0
            })

            inputs[0].scrollIntoView(scrollOptions)
            inputs[0].focus()
          }
        }
      } else if(event.type === 'onChange') {
        onValueChange?.(storeRef.current.getAllValues())
      }
    }

    const unsubscribe = storeRef.current.subscribe('ALL', handleUpdate)
    return () => {
      unsubscribe()
    }
  }, [onFormError, onFormSubmit, onValueChange, scrollOptions, scrollToElements])

  return (
    <FormContext.Provider
      value={{
        store: storeRef.current,
        registerRef,
        reset: () => storeRef.current.reset(),
        submit: () => storeRef.current.submit(),
        update: value => storeRef.current.setValues(value),
        validateAll: () => storeRef.current.validateAll(),
      }}
    >
      <form
        {...props}
        onSubmit={event => {
          if(isPreventingSubmitDefault) {
            event.preventDefault()
          }
          storeRef.current.submit()
        }}
      />
    </FormContext.Provider>
  )
}
