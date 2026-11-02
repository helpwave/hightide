import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type DateTimeInputLayoutProps = HTMLAttributes<HTMLDivElement>

export const DateTimeInputLayout = forwardRef<HTMLDivElement, DateTimeInputLayoutProps>(function DateTimeInputLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('date-time-input-container', props.className)}
    />
  )
})
