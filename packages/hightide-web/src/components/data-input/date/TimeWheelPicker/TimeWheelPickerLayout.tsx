import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type TimeWheelPickerLayoutProps = HTMLAttributes<HTMLDivElement>

export const TimeWheelPickerLayout = forwardRef<HTMLDivElement, TimeWheelPickerLayoutProps>(function TimeWheelPickerLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('time-wheel-picker', props.className)}
    />
  )
})
