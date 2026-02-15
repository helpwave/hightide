import { type ReactNode } from 'react'
import type { DateTimeFormat } from '@/src/utils/date'
import type { TimePickerProps } from './TimePicker'
import { TimePicker } from './TimePicker'
import type { DatePickerProps } from './DatePicker'
import { DatePicker } from './DatePicker'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@/src/hooks/useControlledState'

export interface DateTimePickerProps extends
Partial<FormFieldDataHandling<Date>>,
Pick<DatePickerProps, 'start' | 'end' | 'weekStart' | 'markToday'>,
Pick<TimePickerProps, 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>
{
  initialValue?: Date,
  mode?: DateTimeFormat,
  datePickerProps?: Omit<DatePickerProps, 'onChange' | 'value' | 'start' | 'end' | 'markToday'>,
  timePickerProps?: Omit<TimePickerProps, 'onChange' | 'time' | 'is24HourFormat' | 'minuteIncrement' | 'secondIncrement' | 'millisecondIncrement' | 'precision'>,
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
  timePickerProps,
  datePickerProps,
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
        className="min-w-80"
        yearMonthPickerProps={{ className: 'h-full grow' }}
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
      <TimePicker
        {...timePickerProps}
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
    <div className="flex-row-2 min-h-71 max-h-71">
      {dateDisplay}
      {timeDisplay}
    </div>
  )
}