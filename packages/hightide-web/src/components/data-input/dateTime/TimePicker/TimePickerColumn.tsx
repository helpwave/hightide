import clsx from 'clsx'
import type { HTMLAttributes } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { closestMatch } from '@helpwave/hightide-utils/utils'
import { useTimePickerContext } from './TimePickerContext'
import type { TimePickerColumnUnit } from './TimePickerState'
import { TimePickerTrigger } from './TimePickerTrigger'

const pad = (value: number) => value.toString().padStart(2, '0')

export type TimePickerColumnProps = HTMLAttributes<HTMLDivElement> & {
  unit: TimePickerColumnUnit,
}

export const TimePickerColumn = forwardRef<HTMLDivElement, TimePickerColumnProps>(function TimePickerColumn({
  unit,
  ...props
}, forwardedRef) {
  const { state, config } = useTimePickerContext()
  const selectedRef = useRef<HTMLButtonElement>(null)
  const hasSeconds = config.precision === 'second' || config.precision === 'millisecond'
  const hasMilliseconds = config.precision === 'millisecond'
  const isPM = state.value.getHours() > 11
  const options = unit === 'hour'
    ? config.hours
    : unit === 'minute'
      ? config.minutes
      : unit === 'second'
        ? config.seconds
        : config.milliseconds
  const selected = unit === 'hour'
    ? state.value.getHours() - (!config.is24HourFormat && isPM ? 12 : 0)
    : unit === 'minute'
      ? closestMatch(options, (left, right) => Math.abs(left - state.value.getMinutes()) < Math.abs(right - state.value.getMinutes()))
      : unit === 'second'
        ? closestMatch(options, (left, right) => Math.abs(left - state.value.getSeconds()) < Math.abs(right - state.value.getSeconds()))
        : closestMatch(options, (left, right) => Math.abs(left - state.value.getMilliseconds()) < Math.abs(right - state.value.getMilliseconds()))

  useEffect(() => {
    if (unit === 'hour' || unit === 'minute') {
      selectedRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selected, unit])

  if ((unit === 'second' && !hasSeconds) || (unit === 'millisecond' && !hasMilliseconds)) {
    return null
  }

  return (
    <div
      {...props}
      ref={forwardedRef}
      className={clsx('time-picker-value-column', props.className)}
    >
      {options.map((option) => (
        <TimePickerTrigger
          key={option}
          event={unit === 'hour'
            ? { type: 'setHours', hour: option }
            : unit === 'minute'
              ? { type: 'setMinutes', minute: option }
              : unit === 'second'
                ? { type: 'setSeconds', second: option }
                : { type: 'setMilliseconds', millisecond: option }}
          isSelected={option === selected}
          label={pad(option)}
          selectedRef={selectedRef}
        />
      ))}
    </div>
  )
})
