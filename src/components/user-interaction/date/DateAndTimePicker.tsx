import { type ReactNode } from 'react'
import clsx from 'clsx'
import type { WeekDay } from '@/src/utils/date'
import { addDuration, subtractDuration } from '@/src/utils/date'
import type { TimePickerProps, TimePickerMinuteIncrement } from '../date/TimePicker'
import { TimePicker } from '../date/TimePicker'
import type { DatePickerProps } from '../date/DatePicker'
import { DatePicker } from '../date/DatePicker'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'

export type DateTimePickerMode = 'date' | 'time' | 'dateTime'

export type DateTimePickerProps = {
  mode?: DateTimePickerMode,
  value?: Date,
  start?: Date,
  end?: Date,
  is24HourFormat?: boolean,
  minuteIncrement?: TimePickerMinuteIncrement,
  markToday?: boolean,
  weekStart?: WeekDay,
  onValueChange?: (date: Date) => void,
  datePickerProps?: Omit<DatePickerProps, 'onChange' | 'value' | 'start' | 'end'>,
  timePickerProps?: Omit<TimePickerProps, 'onChange' | 'time' | 'is24HourFormat' | 'minuteIncrement'>,
}

/**
 * A Component for picking a Date and Time
 */
export const DateTimePicker = ({
  value = new Date(),
  start = subtractDuration(new Date(), { years: 50 }),
  end = addDuration(new Date(), { years: 50 }),
  mode = 'dateTime',
  is24HourFormat,
  minuteIncrement,
  weekStart,
  onValueChange: onChange,
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
        value={value}
        start={start}
        end={end}
        weekStart={weekStart}
        onValueChange={onChange}
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
        time={value}
        onValueChange={onChange}
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

export const DateTimePickerUncontrolled = ({ value: overwriteValue, onValueChange, ...props }: DateTimePickerProps) => {
  const [value, setValue] = useOverwritableState(overwriteValue, onValueChange)

  return (
    <DateTimePicker
      {...props}
      value={value}
      onValueChange={setValue}
    />
  )
}