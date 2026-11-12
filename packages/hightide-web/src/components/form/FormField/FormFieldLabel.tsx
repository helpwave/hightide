import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useFormFieldContext } from './FormFieldContext'

export type FormFieldLabelProps = Omit<HTMLAttributes<HTMLLabelElement>, 'children'> & {
  requiredIndicator?: ReactNode,
}

export const FormFieldLabel = forwardRef<HTMLLabelElement, FormFieldLabelProps>(function FormFieldLabel({
  requiredIndicator,
  ...props
}, forwardedRef) {
  const { ids, label, isRequired } = useFormFieldContext()
  if (!label) return null
  const indicator = requiredIndicator === undefined
    ? <div role="none" className="bg-primary w-2 h-2 rounded-full" />
    : requiredIndicator

  return (
    <label
      {...props}
      ref={forwardedRef}
      id={ids.label}
      htmlFor={ids.input}
      className={clsx('form-field-label', props.className)}
    >
      {label}
      {isRequired ? indicator : null}
    </label>
  )
})
