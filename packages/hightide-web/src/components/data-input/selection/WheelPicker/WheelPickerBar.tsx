import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'

export type WheelPickerBarProps = HTMLAttributes<HTMLDivElement>

export const WheelPickerBar = forwardRef<HTMLDivElement, WheelPickerBarProps>(function WheelPickerBar({
  className,
  ...props
}, forwardedRef) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      aria-hidden
      className={clsx('wheel-picker-bar', className)}
    >
      <div className="wheel-picker-bar-line" />
      <div className="wheel-picker-bar-line" />
    </div>
  )
})
