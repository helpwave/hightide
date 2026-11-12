import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { Fragment, forwardRef } from 'react'
import type { FormError } from '@helpwave/hightide-utils/form'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { useFormFieldContext } from './FormFieldContext'

export type FormFieldErrorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children?: (error: FormError) => ReactNode,
}

const translateFormError = (
  translation: ReturnType<typeof useHightideTranslation>,
  error: FormError
) => {
  if (error.information == null) {
    return translation(error.code as 'validationErrorNotEmpty')
  }

  return translation(
    error.code as 'validationErrorOutOfRangeString',
    error.information as { min: number, max: number }
  )
}

export const FormFieldError = forwardRef<HTMLDivElement, FormFieldErrorProps>(function FormFieldError({
  children,
  ...props
}, forwardedRef) {
  const { ids, errors } = useFormFieldContext()
  const translation = useHightideTranslation()
  if (errors.length === 0) return null

  const renderError = children ?? ((error: FormError) => translateFormError(translation, error))

  return (
    <div
      {...props}
      ref={forwardedRef}
      id={ids.error}
      role="alert"
      aria-live="polite"
      className={clsx('form-field-error', props.className)}
    >
      {errors.map((error, index) => (
        <Fragment key={`${error.code}-${index}`}>
          {renderError(error)}
        </Fragment>
      ))}
    </div>
  )
})
