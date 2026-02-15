import { useEffect, useMemo, useRef } from 'react'
import { closestMatch, range } from '@/src/utils/array'
import { Button } from '@/src/components/user-interaction/Button'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@/src/hooks/useControlledState'
import type { DateTimePrecision } from '@/src/utils'
import { Visibility } from '../../layout'

export type TimePickerMinuteIncrement = '1min' | '5min' | '10min' | '15min' | '30min'

export type TimePickerSecondIncrement = '1s' | '5s' | '10s' | '15s' | '30s'

export type TimePickerMillisecondIncrement = '1ms' | '5ms' | '10ms' | '25ms' | '50ms' | '100ms' | '250ms' | '500ms'

// TODO add start, and end constraints
export interface TimePickerProps extends Partial<FormFieldDataHandling<Date>> {
  initialValue?: Date,
  is24HourFormat?: boolean,
  precision?: DateTimePrecision,
  minuteIncrement?: TimePickerMinuteIncrement,
  secondIncrement?: TimePickerSecondIncrement,
  millisecondIncrement?: TimePickerMillisecondIncrement,
  className?: string,
}

export const TimePicker = ({
  value: controlledValue,
  initialValue = new Date(),
  onValueChange,
  onEditComplete,
  is24HourFormat = true,
  minuteIncrement = '5min',
  secondIncrement = '5s',
  millisecondIncrement = '100ms',
  precision = 'minute',
  className,
}: TimePickerProps) => {
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  const minuteRef = useRef<HTMLButtonElement>(null)
  const hourRef = useRef<HTMLButtonElement>(null)

  const isPM = value.getHours() > 11
  const hours = is24HourFormat ? range(24) : range(12)
  const minutes = useMemo(() => {
    const full = range(60)
    switch (minuteIncrement) {
    case '5min':
      return full.filter(value => value % 5 === 0)
    case '10min':
      return full.filter(value => value % 10 === 0)
    case '15min':
      return full.filter(value => value % 15 === 0)
    case '30min':
      return full.filter(value => value % 30 === 0)
    }
  }, [minuteIncrement])

  const seconds = useMemo(() => {
    const full = range(60)
    switch (secondIncrement) {
    case '1s':
      return full.filter(value => value % 1 === 0)
    case '5s':
      return full.filter(value => value % 5 === 0)
    case '10s':
      return full.filter(value => value % 10 === 0)
    case '15s':
      return full.filter(value => value % 15 === 0)
    case '30s':
      return full.filter(value => value % 30 === 0)
    }
  }, [secondIncrement])

  const milliseconds = useMemo(() => {
    const full = range(1000)
    switch (millisecondIncrement) {
    case '1ms':
      return full.filter(value => value % 1 === 0)
    case '5ms':
      return full.filter(value => value % 5 === 0)
    case '10ms':
      return full.filter(value => value % 10 === 0)
    case '25ms':
      return full.filter(value => value % 25 === 0)
    case '50ms':
      return full.filter(value => value % 50 === 0)
    case '100ms':
      return full.filter(value => value % 100 === 0)
    case '250ms':
      return full.filter(value => value % 250 === 0)
    case '500ms':
      return full.filter(value => value % 500 === 0)
    }
  }, [millisecondIncrement])

  const closestMinute = useMemo(() => closestMatch(minutes, (item1, item2) => Math.abs(item1 - value.getMinutes()) < Math.abs(item2 - value.getMinutes())), [minutes, value])
  const closestSecond = useMemo(() => closestMatch(seconds, (item1, item2) => Math.abs(item1 - value.getSeconds()) < Math.abs(item2 - value.getSeconds())), [seconds, value])
  const closestMillisecond = useMemo(() => closestMatch(milliseconds, (item1, item2) => Math.abs(item1 - value.getMilliseconds()) < Math.abs(item2 - value.getMilliseconds())), [milliseconds, value])
  const hour = value.getHours()

  useEffect(() => {
    minuteRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [closestMinute])

  useEffect(() => {
    hourRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [hour])

  const onChangeWrapper = (transformer: (newDate: Date) => void) => {
    const newDate = new Date(value)
    transformer(newDate)
    setValue(newDate)
    onEditComplete?.(newDate)
  }

  return (
    <div data-name="time-picker-container" className={className}>
      <div data-name="time-picker-value-column">
        {hours.map(hour => {
          const isSelected = hour === value.getHours() - (!is24HourFormat && isPM ? 12 : 0)
          return (
            <Button
              size="sm"
              color={isSelected ? 'primary' : 'neutral'}
              key={hour}
              ref={isSelected ? hourRef : undefined}
              onClick={() => onChangeWrapper(newDate => newDate.setHours(hour + (!is24HourFormat && isPM ? 12 : 0)))}
              className="min-w-16"
            >
              {hour.toString().padStart(2, '0')}
            </Button>
          )
        })}
      </div>
      <div data-name="time-picker-value-column">
        {minutes.map(minute => {
          const isSelected = minute === closestMinute
          return (
            <Button
              size="sm"
              color={isSelected ? 'primary' : 'neutral'}
              key={minute + minuteIncrement} // minute increment so that scroll works
              ref={isSelected ? minuteRef : undefined}
              onClick={() => onChangeWrapper(newDate => newDate.setMinutes(minute))}
              className="min-w-16"
            >
              {minute.toString().padStart(2, '0')}
            </Button>
          )
        })}
      </div>
      <Visibility isVisible={precision === 'second' || precision === 'millisecond'}>
        <div data-name="time-picker-value-column">
          {seconds.map(second => {
            const isSelected = second === closestSecond
            return (
              <Button
                size="sm"
                color={isSelected ? 'primary' : 'neutral'}
                key={second + secondIncrement} // second increment so that scroll works
                ref={isSelected ? minuteRef : undefined}
                onClick={() => onChangeWrapper(newDate => newDate.setSeconds(second))}
                className="min-w-16"
              >
                {second.toString().padStart(2, '0')}
              </Button>
            )
          })}
        </div>
      </Visibility>
      <Visibility isVisible={precision === 'millisecond'}>
        <div data-name="time-picker-value-column">
          {milliseconds.map(millisecond => {
            const isSelected = millisecond === closestMillisecond
            return (
              <Button
                size="sm"
                color={isSelected ? 'primary' : 'neutral'}
                key={millisecond + millisecondIncrement} // millisecond increment so that scroll works
                ref={isSelected ? minuteRef : undefined}
                onClick={() => onChangeWrapper(newDate => newDate.setMilliseconds(millisecond))}
                className="min-w-16"
              >
                {millisecond.toString().padStart(2, '0')}
              </Button>
            )
          })}
        </div>
      </Visibility>
      {!is24HourFormat && (
        <div data-name="time-picker-value-column">
          <Button
            size="sm"
            color={!isPM ? 'primary' : 'neutral'}
            onClick={() => onChangeWrapper(newDate => isPM && newDate.setHours(newDate.getHours() - 12))}
            className="min-w-16"
          >
            AM
          </Button>
          <Button
            size="sm"
            color={isPM ? 'primary' : 'neutral'}
            onClick={() => onChangeWrapper(newDate => !isPM && newDate.setHours(newDate.getHours() + 12))}
            className="min-w-16"
          >
            PM
          </Button>
        </div>
      )}
    </div>
  )
}
