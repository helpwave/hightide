import { useEffect, useRef } from 'react'
import { closestMatch, range } from '@/src/utils/array'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { Button } from '@/src/components/user-interaction/Button'
import type { FormFieldDataHandling } from '../../form/FormField'

export type TimePickerMinuteIncrement = '1min' | '5min' | '10min' | '15min' | '30min'

// TODO add start, and end constraints
export type TimePickerProps = Partial<FormFieldDataHandling<Date>> & {
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  className?: string,
}

export const TimePicker = ({
  value = new Date(),
  onValueChange,
  onEditComplete,
  is24HourFormat = true,
  minuteIncrement = '5min',
  className,
}: TimePickerProps) => {
  const minuteRef = useRef<HTMLButtonElement>(null)
  const hourRef = useRef<HTMLButtonElement>(null)

  const isPM = value.getHours() > 11
  const hours = is24HourFormat ? range(24) : range(12)
  let minutes = range(60)

  switch (minuteIncrement) {
  case '5min':
    minutes = minutes.filter(value => value % 5 === 0)
    break
  case '10min':
    minutes = minutes.filter(value => value % 10 === 0)
    break
  case '15min':
    minutes = minutes.filter(value => value % 15 === 0)
    break
  case '30min':
    minutes = minutes.filter(value => value % 30 === 0)
    break
  }

  const closestMinute = closestMatch(minutes, (item1, item2) => Math.abs(item1 - value.getMinutes()) < Math.abs(item2 - value.getMinutes()))
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
    onValueChange?.(newDate)
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
            >
              {minute.toString().padStart(2, '0')}
            </Button>
          )
        })}
      </div>
      {!is24HourFormat && (
        <div data-name="time-picker-value-column">
          <Button
            size="sm"
            color={!isPM ? 'primary' : 'neutral'}
            onClick={() => onChangeWrapper(newDate => isPM && newDate.setHours(newDate.getHours() - 12))}
          >
            AM
          </Button>
          <Button
            size="sm"
            color={isPM ? 'primary' : 'neutral'}
            onClick={() => onChangeWrapper(newDate => !isPM && newDate.setHours(newDate.getHours() + 12))}
          >
            PM
          </Button>
        </div>
      )}
    </div>
  )
}

export const TimePickerUncontrolled = ({
  value: initialValue,
  onValueChange,
  ...props
}: TimePickerProps) => {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <TimePicker
      {...props}
      value={value}
      onValueChange={setValue}
    />
  )
}
