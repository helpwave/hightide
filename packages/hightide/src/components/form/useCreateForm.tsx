import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import type { FormEvent, FormStoreProps, FormValue } from './FormStore'
import { FormStore } from './FormStore'
import { useEventCallbackStabilizer } from '@/src/hooks/useEventCallbackStabelizer'

export type UseCreateFormProps<T extends FormValue> = Omit<FormStoreProps<T>, 'validationBehaviour'> & {
  onFormSubmit: (values: T) => void,
  onFormError?: (values: T, errors: Partial<Record<keyof T, ReactNode>>) => void,
  /**
   * Called when the form values change.
   *
   * E.g. a key press for an input field.
   *
   * For most purposes use {@link onUpdate} instead.
   * @param values The new values of the form.
   */
  onValueChange?: (values: T) => void,
  /**
   * Called when the form values change and the corresponding inputs determined that the user
   * finished editing these fields and the client should make an update against the server.
   *
   * E.g. a user finished editing an input field by pressing enter or blurring the field.
   *
   * @param updatedKeys The keys that were updated.
   * @param update The update that was made.
   */
  onValidUpdate?: (updatedKeys: (keyof T)[], update: Partial<T>) => void,
  /**
   * Called when the form values change and the corresponding inputs determined that the user
   * finished editing these fields and the client should make an update against the server.
   *
   * E.g. a user finished editing an input field by pressing enter or blurring the field.
   *
   * @param updatedKeys The keys that were updated.
   * @param update The update that was made.
   */
  onUpdate?: (updatedKeys: (keyof T)[], update: Partial<T>) => void,
  /* Whether to scroll and focus the first element when submitting with an error or resetting */
  scrollToElements?: boolean,
  scrollOptions?: ScrollIntoViewOptions,
}

export type UseCreateFormResult<T extends FormValue> = {
  /**
   * The form store.
   * Do not attempt to read the store directly, use useFormObserver or useFormField instead.
   * Otherwise you will not get the latest values and errors.
   */
  store: FormStore<T>,
  reset: () => void,
  submit: () => void,
  update: (updater: Partial<T> | ((current: T) => Partial<T>), triggerUpdate?: boolean) => void,
  validateAll: () => void,
  registerRef: (key: keyof T) => (el: HTMLElement | null) => void,
}

export function useCreateForm<T extends FormValue>({
  onFormSubmit,
  onFormError,
  onValueChange,
  onUpdate,
  onValidUpdate,
  initialValues,
  hasTriedSubmitting,
  validators,
  scrollToElements = true,
  scrollOptions = { behavior: 'smooth', block: 'center' },
}: UseCreateFormProps<T>) : UseCreateFormResult<T> {
  const onFormSubmitStable = useEventCallbackStabilizer(onFormSubmit)
  const onFormErrorStable = useEventCallbackStabilizer(onFormError)
  const onValueChangeStable = useEventCallbackStabilizer(onValueChange)
  const onUpdateStable = useEventCallbackStabilizer(onUpdate)
  const onValidUpdateStable = useEventCallbackStabilizer(onValidUpdate)

  const storeRef = useRef<FormStore<T>>(
    new FormStore<T>({
      initialValues,
      hasTriedSubmitting,
      validators,
    })
  )

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
      if (event.type === 'onSubmit') {
        if(event.hasErrors) {
          onFormErrorStable(event.values, event.errors)

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
        } else {
          onFormSubmitStable(event.values)
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
        onValueChangeStable(storeRef.current.getAllValues())
      } else if (event.type === 'onUpdate') {
        onUpdateStable(event.updatedKeys, event.update)
        if(!event.hasErrors) {
          onValidUpdateStable(event.updatedKeys, event.update)
        }
      }
    }

    const unsubscribe = storeRef.current.subscribe('ALL', handleUpdate)
    return () => {
      unsubscribe()
    }
  }, [onFormErrorStable, onFormSubmitStable, onUpdateStable, onValidUpdateStable, onValueChangeStable, scrollOptions, scrollToElements])


  const callbacks = useMemo(() => ({
    reset: () => storeRef.current.reset(),
    submit: () => storeRef.current.submit(),
    update: (updater: Partial<T> | ((current: T) => Partial<T>), triggerUpdate: boolean = false) => {
      if (typeof updater === 'function') {
        storeRef.current.setValues(updater(storeRef.current.getAllValues()), triggerUpdate)
      } else {
        storeRef.current.setValues(updater, triggerUpdate)
      }
    },
    validateAll: () => storeRef.current.validateAll(),
  }), [])

  return {
    store: storeRef.current,
    ...callbacks,
    registerRef
  }
}