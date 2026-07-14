import type { HTMLAttributes } from 'react'
import { type ReactNode } from 'react'
import type { DateTimeFormat } from '@helpwave/hightide-utils'
import type { TimeInputProps } from './TimeInput'
import { TimeInput } from './TimeInput'
import type { DatePickerProps } from './DatePicker'
import { DatePicker } from './DatePicker'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@helpwave/hightide-utils'
import clsx from 'clsx'

export interface DateTimePickerProps extends
HTMLAttributes<HTMLDivElement>,
Partial<FormFieldDataHandling<Date>>,
Pick<DatePickerProps, 'start' | 'end' | 'weekStart' | 'markToday'>,
Pick<TimeInputProps, 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  initialValue?: Date,
  mode?: DateTimeFormat,
  datePickerProps?: Omit<DatePickerProps, 'onChange' | 'value' | 'start' | 'end' | 'markToday'>,
  timeInputProps?: Omit<TimeInputProps, 'value' | 'onValueChange' | 'onEditComplete' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
}

/**
 * A Component for picking a Date and Time
 */
export const DateTimePicker = ({
  value: controlledValue,
  initialValue = new Date(),
  start,
  end,
  mode = 'dateTime',
  is24HourFormat,
  minuteIncrement,
  weekStart,
  secondIncrement,
  millisecondIncrement,
  precision,
  onValueChange,
  onEditComplete,
  timeInputProps,
  datePickerProps,
  ...props
}: DateTimePickerProps) => {
  const useDate = mode === 'dateTime' || mode === 'date'
  const useTime = mode === 'dateTime' || mode === 'time'
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange: onValueChange,
    defaultValue: initialValue,
  })
  let dateDisplay: ReactNode
  let timeDisplay: ReactNode

  if (useDate) {
    dateDisplay = (
      <DatePicker
        {...datePickerProps}
        start={start}
        end={end}
        weekStart={weekStart}
        value={value}
        onValueChange={setValue}
        onEditComplete={onEditComplete}
      />
    )
  }
  if (useTime) {
    timeDisplay = (
      <TimeInput
        {...timeInputProps}
        is24HourFormat={is24HourFormat}
        minuteIncrement={minuteIncrement}
        secondIncrement={secondIncrement}
        millisecondIncrement={millisecondIncrement}
        precision={precision}
        value={value}
        onValueChange={setValue}
        onEditComplete={onEditComplete}
      />
    )
  }

  return (
    <div {...props} className={clsx('date-time-picker', props.className)} data-mode={mode}>
      {dateDisplay}
      {timeDisplay}
    </div>
  )
}
