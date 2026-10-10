import type { ReactNode } from 'react'
import type { InputStateEvent } from '@helpwave/hightide-utils/interfaces'
import { useFieldTouchedTrigger, type TouchedTrigger } from '@helpwave/hightide-utils/form'
import type { InputComponentInterface } from '../../data-input/input/TextInput'
import type { FormFieldAriaAttributes, FormFieldInteractionStates } from './FieldLayout'
import { FormFieldLayout, type FormFieldLayoutProps } from './FieldLayout'
import { useFormField } from './FormContext'
import type { FormValue } from './useCreateForm'

export type FormFieldFocusableElementProps = FormFieldAriaAttributes & {
  id: string,
  ref: (element: HTMLElement | null) => void,
}

export type FormFieldBag<T extends FormValue, K extends keyof T, E extends InputStateEvent = InputStateEvent> = {
  dataProps: FormFieldDataHandling<T[K]>,
  focusableElementProps: FormFieldFocusableElementProps,
  interactionStates: FormFieldInteractionStates,
  touched: boolean,
  onStateEvent: (event: E) => void,
  other: {
    updateValue: (value: T[K]) => void,
  },
}

export interface FormFieldProps<T extends FormValue, K extends keyof T, E extends InputStateEvent = InputStateEvent> extends Omit<FormFieldLayoutProps, 'invalidDescription' | 'children'> {
  children: (bag: FormFieldBag<T, K, E>) => ReactNode,
  name: K,
  touchedTrigger?: TouchedTrigger<E>,
}

export type FormFieldDataHandling<T> = Required<Pick<InputComponentInterface<T>, 'value' | 'onValueUpdate' | 'onValueCommit'>>

export const FormField = <T extends FormValue, K extends keyof T, E extends InputStateEvent = InputStateEvent>({
  children,
  name,
  touchedTrigger,
  ...props
}: FormFieldProps<T, K, E>) => {
  const formField = useFormField<T, K>(name)
  const onStateEvent = useFieldTouchedTrigger<E>(touchedTrigger, formField?.value, () => {
    formField?.setTouched()
  })

  if (!formField) {
    throw new Error('<FormField> can only be used inside a FormContext try wrapping your app in a <FormProvider>')
  }

  return (
    <FormFieldLayout {...props} invalidDescription={formField.errors.length > 0 ? formField.errors.join('\n') : undefined}>
      {(formFieldLayoutBag) => children({
        dataProps: formField.dataProps,
        focusableElementProps: {
          id: formFieldLayoutBag.id,
          ...formFieldLayoutBag.ariaAttributes,
          ref: formField.registerRef,
        },
        interactionStates: formFieldLayoutBag.interactionStates,
        touched: formField.touched,
        onStateEvent,
        other: {
          updateValue: formField.updateValue,
        },
      })}
    </FormFieldLayout>
  )
}