import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { useTimeWheelPickerContext } from './TimeWheelPickerContext'

export type TimeWheelPickerSeparatorProps = HTMLAttributes<HTMLSpanElement> & {
  symbol: ':' | '.',
  unit?: 'second' | 'millisecond',
}

export const TimeWheelPickerSeparator = forwardRef<HTMLSpanElement, TimeWheelPickerSeparatorProps>(function TimeWheelPickerSeparator({
  symbol,
  unit,
  ...props
}, forwardedRef) {
  const { config } = useTimeWheelPickerContext()
  const hasSeconds = config.precision === 'second' || config.precision === 'millisecond'
  const hasMilliseconds = config.precision === 'millisecond'
  if ((unit === 'second' && !hasSeconds) || (unit === 'millisecond' && !hasMilliseconds)) {
    return null
  }

  return (
    <span
      {...props}
      ref={forwardedRef}
      className={clsx('time-wheel-picker-separator', props.className)}
    >
      {symbol}
    </span>
  )
})
