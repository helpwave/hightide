import type { FormEvent, FormHTMLAttributes } from 'react'
import { useForm } from './FormContext'

export type FormElementProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>

export function FormElement({ children, ...props }: FormElementProps) {
  const form = useForm()
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.submit()
  }

  return (
    <form {...props} noValidate onSubmit={handleSubmit}>
      {children}
    </form>
  )
}
