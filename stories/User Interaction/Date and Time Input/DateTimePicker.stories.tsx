import type { Meta, StoryObj } from '@storybook/nextjs'
import { DateTimePickerUncontrolled } from '../../../src/components/user-interaction/date/DateTimePicker'
import { addDuration, subtractDuration } from '../../../src/utils/date'
import { action } from 'storybook/actions'


const meta = {
  component: DateTimePickerUncontrolled,
} satisfies Meta<typeof DateTimePickerUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const dateTimePicker: Story = {
  args: {
    value: new Date(),
    mode: 'dateTime',
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    is24HourFormat: true,
    minuteIncrement: '5min',
    weekStart: 'monday',
    markToday: true,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete')
  },
}
