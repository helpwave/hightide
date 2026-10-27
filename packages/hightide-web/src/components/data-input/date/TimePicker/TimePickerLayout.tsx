import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type TimePickerLayoutProps = HTMLAttributes<HTMLDivElement>

export const TimePickerLayout = forwardRef<HTMLDivElement, TimePickerLayoutProps>(function TimePickerLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('time-picker-container', props.className)}
    />
  )
})
