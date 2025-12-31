import { type ReactNode } from 'react'
import clsx from 'clsx'
import type { WeekDay } from '@/src/utils/date'
import type { TimePickerProps, TimePickerMinuteIncrement } from './TimePicker'
import { TimePicker } from './TimePicker'
import type { DatePickerProps } from './DatePicker'
import { DatePicker } from './DatePicker'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import type { FormFieldDataHandling } from '../../form/FormField'

export type DateTimePickerMode = 'date' | 'time' | 'dateTime'

export type DateTimePickerProps = Partial<FormFieldDataHandling<Date>> & {
  mode?: DateTimePickerMode,
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
  value = new Date(),
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
        onValueChange={onValueChange}
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
        className={clsx({ 'justify-between': mode === 'time' })}
        value={value}
        onValueChange={onValueChange}
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

export const DateTimePickerUncontrolled = ({ value: initialValue, onValueChange, ...props }: DateTimePickerProps) => {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <DateTimePicker
      {...props}
      value={value}
      onValueChange={setValue}
    />
  )
}