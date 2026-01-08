import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import type { FormEvent, FormStoreProps, FormValue } from './FormStore'
import { FormStore } from './FormStore'
import type { FormFieldDataHandling } from './FormField'

export type UseCreateFormProps<T extends FormValue> = FormStoreProps<T> & {
  onFormSubmit: (values: T) => void,
  onFormError?: (values: T, errors: Partial<Record<keyof T, ReactNode>>) => void,
  onValueChange?: (values: T) => void,
  /* Whether to scroll and focus the first element when submitting with an error or resetting */
  scrollToElements?: boolean,
  scrollOptions?: ScrollIntoViewOptions,
}

export type UseCreateFormResult<T extends FormValue> = {
  store: FormStore<T>,
  reset: () => void,
  submit: () => void,
  update: (updater: Partial<T> | ((current: T) => Partial<T>)) => void,
  validateAll: () => void,
  getDataProps: <K extends keyof T>(key: K) => FormFieldDataHandling<T[K]>,
  getError: (key: keyof T) => ReactNode,
  getValues: () => T,
  getValue: <K extends keyof T>(key: K) => T[K],
  registerRef: (key: keyof T) => (el: HTMLElement | null) => void,
}

export function useCreateForm<T extends FormValue>({
  onFormSubmit,
  onFormError,
  onValueChange,
  initialValues,
  hasTriedSubmitting,
  validators,
  validationBehaviour,
  scrollToElements = true,
  scrollOptions = { behavior: 'smooth', block: 'center' },
}: UseCreateFormProps<T>) : UseCreateFormResult<T> {
  const storeRef = useRef<FormStore<T>>(
    new FormStore<T>({
      initialValues,
      hasTriedSubmitting,
      validators,
      validationBehaviour,
    })
  )

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
  }, [])

  useEffect(() => {
    const handleUpdate = (event: FormEvent<T>) => {
      if (event.type === 'submit') {
        onFormSubmit(event.values)
      } else if (event.type === 'submitError') {
        onFormError?.(event.values, event.errors)

        if (scrollToElements) {
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
        if (scrollToElements) {
          const inputs = Object.values(fieldRefs.current).filter(
            (el): el is HTMLElement => el !== null && el !== undefined
          )
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
      } else if (event.type === 'onChange') {
        onValueChange?.(storeRef.current.getAllValues())
      }
    }

    const unsubscribe = storeRef.current.subscribe('ALL', handleUpdate)
    return () => {
      unsubscribe()
    }
  }, [onFormError, onFormSubmit, onValueChange, scrollOptions, scrollToElements])

  const getDataProps = useCallback(<K extends keyof T>(key: K): FormFieldDataHandling<T[K]> => {
    return {
      value: storeRef.current.getValue(key),
      onValueChange: (val: T[K]) => storeRef.current.setValue(key, val),
      onEditComplete: (val: T[K]) => {
        storeRef.current.setValue(key, val)
        storeRef.current.setTouched(key)
      },
    }
  },[])

  const callbacks = useMemo(() => ({
    reset: () => storeRef.current.reset(),
    submit: () => storeRef.current.submit(),
    update: (updater: Partial<T> | ((current: T) => Partial<T>)) => {
      if (typeof updater === 'function') {
        storeRef.current.setValues(updater(storeRef.current.getAllValues()))
      } else {
        storeRef.current.setValues(updater)
      }
    },
    validateAll: () => storeRef.current.validateAll(),
    getError: (key: keyof T) => storeRef.current.getError(key),
    getValues: () => storeRef.current.getAllValues(),
    getValue: <K extends keyof T>(key: K) => storeRef.current.getValue(key),
  }), [])

  return {
    store: storeRef.current,
    ...callbacks,
    getDataProps,
    registerRef
  }
}