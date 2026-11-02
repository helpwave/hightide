import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type DateTimeWheelPickerLayoutProps = HTMLAttributes<HTMLDivElement>

export const DateTimeWheelPickerLayout = forwardRef<HTMLDivElement, DateTimeWheelPickerLayoutProps>(function DateTimeWheelPickerLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('date-time-wheel-picker', props.className)}
    />
  )
})
