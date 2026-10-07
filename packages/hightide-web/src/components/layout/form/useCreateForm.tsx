import { useCallback, useEffect, useMemo, useRef } from 'react'
import { countFormErrors, createFormStore, isValidationRunnerInvalid, type CreateFormStoreOptions, type FormFieldErrors, type FormStore, type FormValues } from '@helpwave/hightide-utils/form'
import { useStableEvent } from '@helpwave/hightide-utils/hooks'

export type FormValue = FormValues

export type UseCreateFormProps<T extends FormValue> = Pick<CreateFormStoreOptions<T>, 'initialValues' | 'initialTouchedValues' | 'validation'> & {
  onFormSubmit: (values: T) => void,
  onFormError?: (values: T, errors: FormFieldErrors<T>) => void,
  onValueChange?: (values: T) => void,
  onValidUpdate?: (updatedKeys: (keyof T)[], update: Partial<T>) => void,
  onUpdate?: (updatedKeys: (keyof T)[], update: Partial<T>) => void,
  scrollToElements?: boolean,
  scrollOptions?: ScrollIntoViewOptions,
}

export type UseCreateFormResult<T extends FormValue> = {
  store: FormStore<T>,
  reset: () => void,
  submit: () => void,
  update: (updater: Partial<T> | ((current: T) => Partial<T>), triggerUpdate?: boolean) => void,
  validateAll: () => number,
  registerRef: (key: keyof T) => (el: HTMLElement | null) => void,
  notifyUpdate: (updatedKeys: (keyof T)[], update: Partial<T>) => void,
}

const sortByDocumentOrder = (elements: HTMLElement[]) => {
  return elements.sort((left, right) => {
    const position = left.compareDocumentPosition(right)
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

const focusFirst = (elements: HTMLElement[], scrollOptions: ScrollIntoViewOptions) => {
  const [first] = sortByDocumentOrder(elements)
  if (!first) return
  first.scrollIntoView(scrollOptions)
  first.focus()
}

const defaultScrolloptions: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }

export function useCreateForm<T extends FormValue>({
  onFormSubmit,
  onFormError,
  onValueChange,
  onUpdate,
  onValidUpdate,
  initialValues,
  initialTouchedValues,
  validation,
  scrollToElements = true,
  scrollOptions = defaultScrolloptions,
}: UseCreateFormProps<T>): UseCreateFormResult<T> {
  const onFormSubmitStable = useStableEvent(onFormSubmit)
  const onFormErrorStable = useStableEvent(onFormError)
  const onValueChangeStable = useStableEvent(onValueChange)
  const onUpdateStable = useStableEvent(onUpdate)
  const onValidUpdateStable = useStableEvent(onValidUpdate)

  const storeRef = useRef<FormStore<T>>(
    createFormStore({
      initialValues,
      initialTouchedValues,
      validation,
    })
  )
  const fieldRefs = useRef<Partial<Record<keyof T, HTMLElement | null>>>({})
  const registerRef = useCallback((key: keyof T) => {
    return (element: HTMLElement | null) => {
      fieldRefs.current[key] = element
    }
  }, [])

  const notifyUpdate = useCallback((updatedKeys: (keyof T)[], update: Partial<T>) => {
    const state = storeRef.current.getState()
    onUpdateStable(updatedKeys, update)
    if (countFormErrors(state.errors, state.validationRunnerError) === 0) {
      onValidUpdateStable(updatedKeys, update)
    }
  }, [onUpdateStable, onValidUpdateStable])

  useEffect(() => {
    return storeRef.current.subscribe((state, previous) => {
      if (state.values !== previous.values) {
        onValueChangeStable(state.values)
      }
    })
  }, [onValueChangeStable, storeRef])

  const reset = useCallback(() => {
    storeRef.current.getState().reset()
    if (!scrollToElements) return

    const inputs = Object.values(fieldRefs.current).filter(
      (element): element is HTMLElement => element !== null && element !== undefined
    )
    focusFirst(inputs, scrollOptions)
  }, [scrollOptions, scrollToElements])

  const submit = useCallback(() => {
    const errorCount = storeRef.current.getState().validate()
    const { values, errors, validationRunnerError } = storeRef.current.getState()

    if (errorCount > 0) {
      onFormErrorStable(values, errors)

      if (scrollToElements) {
        const errorInputs = (Object.keys(values) as (keyof T)[])
          .filter((key) => (errors[key]?.length ?? 0) > 0 || isValidationRunnerInvalid(validationRunnerError[key]))
          .map((key) => fieldRefs.current[key])
          .filter((element): element is HTMLElement => element !== null && element !== undefined)
        focusFirst(errorInputs, scrollOptions)
      }
      return
    }

    onFormSubmitStable(values)
  }, [onFormErrorStable, onFormSubmitStable, scrollOptions, scrollToElements])

  const update = useCallback((updater: Partial<T> | ((current: T) => Partial<T>), triggerUpdate: boolean = false) => {
    const current = storeRef.current.getState().values
    const nextUpdate = typeof updater === 'function' ? updater(current) : updater
    storeRef.current.getState().setValues(nextUpdate)
    if (triggerUpdate) {
      notifyUpdate(Object.keys(nextUpdate) as (keyof T)[], nextUpdate)
    }
  }, [notifyUpdate])

  const validateAll = useCallback(() => {
    return storeRef.current.getState().validate()
  }, [])

  return useMemo(() => ({
    store: storeRef.current,
    reset,
    submit,
    update,
    validateAll,
    registerRef,
    notifyUpdate,
  }), [notifyUpdate, registerRef, reset, submit, update, validateAll])
}
