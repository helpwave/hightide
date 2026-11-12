import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

export type WheelPickerBarLineProps = HTMLAttributes<HTMLDivElement>

export const WheelPickerBarLine = forwardRef<HTMLDivElement, WheelPickerBarLineProps>(function WheelPickerBarLine({
  className,
  ...props
}, forwardedRef) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('wheel-picker-bar-line', className)}
    />
  )
})
