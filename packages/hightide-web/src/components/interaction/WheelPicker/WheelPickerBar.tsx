import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type WheelPickerBarProps = HTMLAttributes<HTMLDivElement>

export function WheelPickerBar({ className, ...props }: WheelPickerBarProps) {
  return (
    <div
      {...props}
      aria-hidden
      className={clsx('wheel-picker-bar', className)}
    >
      <div className="wheel-picker-bar-line" />
      <div className="wheel-picker-bar-line" />
    </div>
  )
}
