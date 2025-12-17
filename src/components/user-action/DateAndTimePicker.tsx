import type { ReactNode } from 'react'
import clsx from 'clsx'
import { addDuration, subtractDuration } from '@/src/utils/date'
import type { TimePickerProps } from '../date/TimePicker'
import { TimePicker } from '../date/TimePicker'
import type { DatePickerProps } from '../date/DatePicker'
import { DatePicker } from '../date/DatePicker'

export type DateTimePickerMode = 'date' | 'time' | 'dateTime'

export type DateTimePickerProps = {
  mode?: DateTimePickerMode,
  value?: Date,
  start?: Date,
  end?: Date,
  onChange?: (date: Date) => void,
  datePickerProps?: Omit<DatePickerProps, 'onChange' | 'value' | 'start' | 'end'>,
  timePickerProps?: Omit<TimePickerProps, 'onChange' | 'time' | 'maxHeight'>,
}

/**
 * A Component for picking a Date and Time
 */
export const DateTimePicker = ({
                                 value = new Date(),
                                 start = subtractDuration(new Date(), { years: 50 }),
                                 end = addDuration(new Date(), { years: 50 }),
                                 mode = 'dateTime',
                                 onChange,
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
        onChange={onChange}
      />
    )
  }
  if (useTime) {
    timeDisplay = (
      <TimePicker
        {...timePickerProps}
        className={clsx({ 'justify-between': mode === 'time' })}
        time={value}
        onChange={onChange}
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
