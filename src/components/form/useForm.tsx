import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type ValidationBehaviour = 'always' | 'touched' | 'submit'

export interface FormInputProps<T> {
  value: T,
  onValueChange: (value: T) => void,
  onEditComplete: (value: T) => void,
  invalidDescription: ReactNode,
  disabled: boolean,
  readOnly: boolean,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T,
  validators?: Partial<{ [K in keyof T]: (value: T[K], values: T) => ReactNode }>,
  onSubmit: (values: T) => void,
  validationBehaviour?: ValidationBehaviour,
  scrollToError?: boolean,
  scrollOptions?: ScrollIntoViewOptions,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useForm = <T extends Record<string, any>>({
  initialValues,
  validators = {},
  onSubmit,
  validationBehaviour = 'touched',
  scrollToError = true,
  scrollOptions = { behavior: 'smooth', block: 'center' }
}: UseFormOptions<T>) => {
  type Key = keyof T

  const [values, setValues] = useState<T>(initialValues)
  const [invalidDescriptions, setInvalidDescriptions] = useState<Partial<Record<Key, ReactNode>>>({})
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [submitAttemptCount, setSubmitAttemptCount] = useState(0)
  const hasTriedSubmitting = submitAttemptCount > 0

  const fieldRefs = useRef<Partial<Record<Key, HTMLElement | null>>>({})

  const handlersRef = useRef<Partial<Record<Key, { onValueChange: (v: T[Key]) => void, onEditComplete: (v: T[Key]) => void }>>>({})
  const itemPropsCache = useRef<Partial<Record<Key, FormInputProps<T[Key]>>>>({})

  const registerRef = useCallback((key: Key) => (el: HTMLElement | null) => {
    fieldRefs.current[key] = el
  }, [])

  const update = useCallback((newValue: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValue }))
  }, [])

  const validateValue = useCallback((
    key: Key,
    currentValues: T,
    currentTouched: Partial<Record<Key, boolean>>,
    isSubmitting: boolean
  ): ReactNode => {
    const isTouched = currentTouched[key]
    const value = currentValues[key]
    const validator = validators[key]

    const isValidating =
        validationBehaviour === 'always' ||
        (validationBehaviour === 'touched' && isTouched) ||
        (validationBehaviour === 'submit' && isSubmitting)

    if (!validator || !isValidating) {
      return undefined
    }
    return validator(value, currentValues)
  }, [validationBehaviour, validators])

  const calculateErrors = useCallback((
    currentValues: T,
    currentTouched: Partial<Record<Key, boolean>>,
    isSubmitting: boolean
  ) => {
    return Object.keys(currentValues).reduce((acc, key) => {
      const typedKey = key as Key
      const error = validateValue(typedKey, currentValues, currentTouched, isSubmitting)
      if (error) {
        acc[typedKey] = error
      }
      return acc
    }, {} as Partial<Record<Key, ReactNode>>)
  }, [validateValue])

  const validateAll = useCallback(() => {
    const errors = calculateErrors(values, touched, hasTriedSubmitting)
    setInvalidDescriptions(errors)
    return Object.keys(errors).length === 0
  }, [calculateErrors, values, touched, hasTriedSubmitting])

  useEffect(() => {
    validateAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(submitAttemptCount > 0) {
      validateAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitAttemptCount, values, touched])

  const submit = () => {
    setSubmitAttemptCount(prev => prev + 1)

    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as Key] = true
      return acc
    }, {} as Record<Key, boolean>)

    setTouched(allTouched)

    const currentErrors = calculateErrors(values, allTouched, true)
    setInvalidDescriptions(currentErrors)

    const isValid = Object.keys(currentErrors).length === 0

    if (isValid) {
      onSubmit(values)
      setSubmitAttemptCount(0)
    }
  }

  useEffect(() => {
    if (scrollToError && submitAttemptCount > 0) {
      const errorInputs = (Object.keys(invalidDescriptions) as Key[])
        .filter(key => invalidDescriptions[key])
        .map(key => fieldRefs.current[key])
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitAttemptCount])

  const reset = useCallback(() => {
    setValues(initialValues)
    setSubmitAttemptCount(0)
    setTouched({})
    setInvalidDescriptions({})
  }, [initialValues])

  const isInvalid = useMemo(() => Object.values(invalidDescriptions).filter(Boolean).length > 0, [invalidDescriptions])

  const itemProps = useMemo(() => {
    const result = {} as Record<Key, FormInputProps<T[Key]>>

    (Object.keys(initialValues) as Key[]).forEach((key) => {
      const currentValue = values[key]
      const currentError = invalidDescriptions[key]

      if (!handlersRef.current[key]) {
        handlersRef.current[key] = {
          onValueChange: (val: T[Key]) => {
            update({ [key]: val } as unknown as Partial<T>)
          },
          onEditComplete: (val: T[Key]) => {
            setTouched(prev => ({ ...prev, [key]: true }))
            update({ [key]: val } as unknown as Partial<T>)
          }
        }
      }

      const handlers = handlersRef.current[key]!
      const prevProp = itemPropsCache.current[key]

      if (
        prevProp &&
        prevProp.value === currentValue &&
        prevProp.invalidDescription === currentError &&
        prevProp.disabled === false &&
        prevProp.readOnly === false
      ) {
        result[key] = prevProp as FormInputProps<T[Key]>
      } else {
        const newProp: FormInputProps<T[Key]> = {
          readOnly: false,
          disabled: false,
          invalidDescription: currentError,
          value: currentValue,
          onValueChange: handlers.onValueChange,
          onEditComplete: handlers.onEditComplete,
        }
        itemPropsCache.current[key] = newProp
        result[key] = newProp
      }
    })

    return result
  }, [values, invalidDescriptions, initialValues, update])

  return {
    values,
    touched,
    errors: invalidDescriptions,
    hasTriedSubmitting,
    isInvalid,
    itemProps,
    submit,
    reset,
    registerRef,
    update: (values: Partial<T>, isSettingTouched: boolean = false) => {
      if(isSettingTouched) {
        setTouched(prevState => {
          const newState = { ...prevState }
          const keys = Object.keys(values) as Key[]
          keys.forEach(k => { newState[k] = true })
          return newState
        })
      }
      update(values)
    },
  }
}