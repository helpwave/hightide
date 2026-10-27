import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type CalendarDayPickerLayoutProps = HTMLAttributes<HTMLDivElement>

export const CalendarDayPickerLayout = forwardRef<HTMLDivElement, CalendarDayPickerLayoutProps>(function CalendarDayPickerLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('calendar-day-picker-container', props.className)}
    />
  )
})
