import type { Meta, StoryObj } from '@storybook/react'
import type {
  DatePickerProps,
  DateTimePickerProps,
  DayPickerProps,
  TimePickerProps,
  YearMonthPickerProps
} from '../../../src'
import { addDuration, DateTimePicker, noop, subtractDuration } from '../../../src'
import { useEffect, useState } from 'react'

type DateTimePickerExampleProps = Omit<DateTimePickerProps, 'datePickerProps' | 'timePickerProps'> &
  Pick<DatePickerProps, 'initialDisplay'> & Pick<TimePickerProps, 'is24HourFormat' | 'minuteIncrement'> &
  Pick<YearMonthPickerProps, 'showValueOpen'> & Pick<DayPickerProps, 'markToday' | 'weekStart'>

/**
 * Example for the DateTimePicker
 */
const DateTimePickerExample = ({
                                 value,
                                 onChange = noop,
                                 onRemove = noop,
                                 onFinish = noop,
                                 initialDisplay,
                                 is24HourFormat,
                                 minuteIncrement,
                                 showValueOpen,
                                 markToday,
                                 weekStart,
                                 ...props
                               }: DateTimePickerExampleProps) => {
  const [time, setTime] = useState(value)

  useEffect(() => setTime(value), [value])
  return (
    <DateTimePicker
      {...props}
      value={time}
      onChange={date => {
        onChange(date)
        setTime(date)
      }}
      onRemove={() => {
        onRemove()
        setTime(new Date())
      }}
      onFinish={date => {
        onFinish(date)
        setTime(date)
      }}
      timePickerProps={{ is24HourFormat, minuteIncrement }}
      datePickerProps={{ initialDisplay, dayPickerProps: { markToday, weekStart }, yearMonthPickerProps: { showValueOpen } }}
    />
  )
}


const meta = {
  title: 'User Action/Date',
  component: DateTimePickerExample,
} satisfies Meta<typeof DateTimePickerExample>

export default meta
type Story = StoryObj<typeof meta>;

export const dateTimePicker: Story = {
  args: {
    mode: 'dateTime',
    value: new Date(),
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    is24HourFormat: true,
    minuteIncrement: '5min',
    weekStart: 'monday',
    initialDisplay: 'day',
    markToday: true,
    showValueOpen: false,
  },
}
