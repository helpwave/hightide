import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export type YearMonthPickerLayoutProps = HTMLAttributes<HTMLDivElement>

export const YearMonthPickerLayout = forwardRef<HTMLDivElement, YearMonthPickerLayoutProps>(function YearMonthPickerLayout(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('year-month-picker', props.className)}
    />
  )
})
