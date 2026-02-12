import { type ReactNode } from 'react'
import type { DateTimeFormat, WeekDay } from '@/src/utils/date'
import type { TimePickerProps, TimePickerMinuteIncrement } from './TimePicker'
import { TimePicker } from './TimePicker'
import type { DatePickerProps } from './DatePicker'
import { DatePicker } from './DatePicker'
import type { FormFieldDataHandling } from '../../form/FormField'
import { useControlledState } from '@/src/hooks/useControlledState'

export type DateTimePickerProps = Partial<FormFieldDataHandling<Date>> & {
  initialValue?: Date,
  mode?: DateTimeFormat,
  start?: Date,
  end?: Date,
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  markToday?: boolean,
  weekStart?: WeekDay,
  datePickerProps?: Omit<DatePickerProps, 'onChange' | 'value' | 'start' | 'end'>,
  timePickerProps?: Omit<TimePickerProps, 'onChange' | 'time' | 'is24HourFormat' | 'minuteIncrement'>,
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