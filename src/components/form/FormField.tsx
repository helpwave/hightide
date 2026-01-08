import type { FormFieldAriaAttributes, FormFieldInteractionStates } from './FieldLayout'
import { FormFieldLayout, type FormFieldLayoutProps } from './FieldLayout'
import { useFormField } from './FormContext'
import type { ReactNode } from 'react'
import type { FormValue } from './FormStore'

export type FormFieldFocusableElementProps = FormFieldAriaAttributes & {
  id: string,
  ref: (element: HTMLElement | null) => void,
}

export type FormFieldBag<T extends FormValue, K extends keyof T> = {
  dataProps: FormFieldDataHandling<T[K]>,
  focusableElementProps: FormFieldFocusableElementProps,
  interactionStates: FormFieldInteractionStates,
  other: {
    updateValue: (value: T[K]) => void,
  },
}

export interface FormFieldProps<T extends FormValue, K extends keyof T> extends Omit<FormFieldLayoutProps, 'invalidDescription' | 'children'> {
  children: (bag: FormFieldBag<T, K>) => ReactNode,
  name: K,
  triggerUpdateOnEditComplete?: boolean,
}

export type FormFieldDataHandling<T> = {
  value: T,
  onValueChange: (value: T) => void,
  onEditComplete: (value: T) => void,
}

export const FormField = <T extends FormValue, K extends keyof T>({ children, name, triggerUpdateOnEditComplete, ...props }: FormFieldProps<T, K>) => {
  const formField = useFormField<T, K>(name, { triggerUpdate: triggerUpdateOnEditComplete })

  if (!formField) {
    throw new Error('<FormField> can only be used inside a FormContext try wrapping your app in a <FormProvider>')
  }

  return (
    <FormFieldLayout {...props} invalidDescription={formField.error}>
      {(formFieldLayoutBag) => children({
        dataProps: formField.dataProps,
        focusableElementProps: {
          id: formFieldLayoutBag.id,
          ...formFieldLayoutBag.ariaAttributes,
          ref: formField.registerRef,
        },
        interactionStates: formFieldLayoutBag.interactionStates,
        other: {
          updateValue: (value: T[K]) => formField.store.setValue(name, value, true),
        },
      })}
    </FormFieldLayout>
  )
}