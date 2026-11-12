import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { useFormFieldContext } from './FormFieldContext'

export type FormFieldDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'>

export const FormFieldDescription = forwardRef<HTMLParagraphElement, FormFieldDescriptionProps>(function FormFieldDescription(
  props,
  forwardedRef
) {
  const { ids, description } = useFormFieldContext()
  if (!description) return null

  return (
    <p
      {...props}
      ref={forwardedRef}
      id={ids.description}
      className={clsx('form-field-description', props.className)}
    >
      {description}
    </p>
  )
})
