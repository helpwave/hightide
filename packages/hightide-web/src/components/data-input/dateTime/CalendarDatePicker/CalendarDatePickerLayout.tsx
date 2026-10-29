import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type CalendarDatePickerLayoutProps = HTMLAttributes<HTMLDivElement>

export const CalendarDatePickerLayout = forwardRef<HTMLDivElement, CalendarDatePickerLayoutProps>(function CalendarDatePickerLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('calendar-date-picker', props.className)}
    />
  )
})
