import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type DateWheelPickerLayoutProps = HTMLAttributes<HTMLDivElement>

export const DateWheelPickerLayout = forwardRef<HTMLDivElement, DateWheelPickerLayoutProps>(function DateWheelPickerLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('date-wheel-picker', props.className)}
    />
  )
})
