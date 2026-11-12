import type { ReactNode } from 'react'
import { FormFieldContext } from './FormFieldContext'
import { FormFieldDescription } from './FormFieldDescription'
import { FormFieldError } from './FormFieldError'
import { FormFieldInputWrapper, type FormFieldInputProps } from './FormFieldInput'
import { FormFieldLabel } from './FormFieldLabel'
import { FormFieldLayout } from './FormFieldLayout'
import { FormFieldStateManager, type FormFieldStateManagerProps } from './FormFieldStateManager'
import type { FormValue } from '../Form/FormContext'

export type FormFieldProps<
  T extends FormValue,
  K extends Extract<keyof T, string>
> = Pick<FormFieldStateManagerProps<T, K>, 'name' | 'label' | 'description' | 'ids'> & {
  requiredIndicator?: ReactNode,
  children: (props: FormFieldInputProps<T[K]>) => ReactNode,
}

function FormFieldComponent<
  T extends FormValue,
  K extends Extract<keyof T, string>
>({
  name,
  label,
  description,
  ids,
  requiredIndicator,
  children,
}: FormFieldProps<T, K>) {
  return (
    <FormFieldStateManager
      name={name}
      label={label}
      description={description}
      ids={ids}
    >
      <FormFieldLayout>
        <FormFieldLabel requiredIndicator={requiredIndicator} />
        <FormFieldDescription />
        <FormFieldInputWrapper<T, K>>
          {children}
        </FormFieldInputWrapper>
        <FormFieldError />
      </FormFieldLayout>
    </FormFieldStateManager>
  )
}

export const FormField = Object.assign(FormFieldComponent, {
  StateManager: FormFieldStateManager,
  Layout: FormFieldLayout,
  Label: FormFieldLabel,
  Description: FormFieldDescription,
  Error: FormFieldError,
  Wrapper: FormFieldInputWrapper,
  Context: FormFieldContext,
  Provider: FormFieldContext.Provider,
  Consumer: FormFieldContext.Consumer,
})
