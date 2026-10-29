import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { useTimePickerContext } from './TimePickerContext'
import { TimePickerTrigger } from './TimePickerTrigger'

export type TimePickerPeriodProps = HTMLAttributes<HTMLDivElement>

export const TimePickerPeriod = forwardRef<HTMLDivElement, TimePickerPeriodProps>(function TimePickerPeriod(
  props,
  forwardedRef
) {
  const { state, config } = useTimePickerContext()
  if (config.is24HourFormat) {
    return null
  }
  const isPM = state.value.getHours() > 11

  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('time-picker-value-column', props.className)}
    >
      <TimePickerTrigger event={{ type: 'setPeriod', period: 'am' }} isSelected={!isPM} label="AM" />
      <TimePickerTrigger event={{ type: 'setPeriod', period: 'pm' }} isSelected={isPM} label="PM" />
    </div>
  )
})
