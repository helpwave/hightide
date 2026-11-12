import type { ReactNode, RefObject } from 'react'
import { useId, useMemo } from 'react'
import { FormFieldWrapper as FormFieldStoreBinder } from '@helpwave/hightide-utils/form'
import { FormFieldContext, type FormFieldContextValue, type FormFieldIds } from './FormFieldContext'
import { useForm } from '../Form/FormContext'
import type { FormError } from '@helpwave/hightide-utils/utils'
import type { FormValue } from '../Form/FormContext'

export type FormFieldStateManagerProps<
  T extends FormValue,
  K extends Extract<keyof T, string>
> = {
  name: K,
  label?: ReactNode,
  description?: ReactNode,
  ids?: Partial<FormFieldIds>,
  children?: ReactNode,
}

export function FormFieldStateManager<
  T extends FormValue,
  K extends Extract<keyof T, string>
>({
  name,
  label,
  description,
  ids: idOverwrites,
  children,
}: FormFieldStateManagerProps<T, K>) {
  const form = useForm<T>()
  const generatedId = useId()
  const ids = useMemo<FormFieldIds>(() => ({
    input: idOverwrites?.input ?? `form-field-input-${generatedId}`,
    error: idOverwrites?.error ?? `form-field-error-${generatedId}`,
    label: idOverwrites?.label ?? `form-field-label-${generatedId}`,
    description: idOverwrites?.description ?? `form-field-description-${generatedId}`,
  }), [generatedId, idOverwrites])
  const ref = useMemo<RefObject<HTMLElement | null>>(() => ({
    get current() {
      return form.elementsRefs.current[name] ?? null
    },
    set current(element: HTMLElement | null) {
      form.elementsRefs.current[name] = element ?? undefined
    },
  }), [form.elementsRefs, name])

  return (
    <FormFieldStoreBinder<T, K> name={name}>
      {(field) => {
        const errors = (field.hasInteracted
          ? [...field.errors, ...(field.validationRunnerError?.errors ?? [])]
          : []) as FormError[]
        const hasError = errors.length > 0
        const describedBy = [
          description ? ids.description : undefined,
          hasError ? ids.error : undefined,
        ].filter(Boolean).join(' ')
        const onValueChange = (next: T[K]) => {
          form.dispatch({ type: 'changed', name, value: next })
        }
        const onInteracted = () => {
          form.dispatch({ type: 'interacted', name })
        }
        const contextValue: FormFieldContextValue<T, K> = {
          name,
          ids,
          label,
          description,
          errors,
          value: field.value,
          hasInteracted: field.hasInteracted,
          isRequired: field.isRequired,
          isDisabled: field.isDisabled,
          isReadOnly: field.isReadOnly,
          isInvalid: hasError,
          aria: {
            'aria-required': field.isRequired,
            'aria-describedby': describedBy || undefined,
            'aria-labelledby': label ? ids.label : undefined,
            'aria-invalid': hasError,
            'aria-errormessage': hasError ? ids.error : undefined,
            'aria-disabled': field.isDisabled,
            'aria-readonly': field.isReadOnly,
          },
          ref,
          onValueChange,
          onInteracted,
        }

        return (
          <FormFieldContext.Provider value={contextValue as unknown as FormFieldContextValue<FormValue, string>}>
            {children}
          </FormFieldContext.Provider>
        )
      }}
    </FormFieldStoreBinder>
  )
}
