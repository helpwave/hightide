import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type FormFieldLayoutProps = HTMLAttributes<HTMLDivElement>

export const FormFieldLayout = forwardRef<HTMLDivElement, FormFieldLayoutProps>(function FormFieldLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('form-field-container', props.className)}
    />
  )
})
