import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { useDateTimePickerContext } from './DateTimePickerContext'

export type DateTimePickerLayoutProps = HTMLAttributes<HTMLDivElement>

export const DateTimePickerLayout = forwardRef<HTMLDivElement, DateTimePickerLayoutProps>(function DateTimePickerLayout(
  props,
  forwardedRef
) {
  const { config } = useDateTimePickerContext()

  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('date-time-picker', props.className)}
      data-mode={config.mode}
    />
  )
})
