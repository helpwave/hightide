import type { Meta, StoryObj } from '@storybook/react'
import { TimePickerControlled } from '../../../src/components/date/TimePicker'

const meta = {
  title: 'User Action/Date',
  component: TimePickerControlled,
} satisfies Meta<typeof TimePickerControlled>

export default meta
type Story = StoryObj<typeof meta>;

export const timePicker: Story = {
  args: {
    time: new Date(),
    is24HourFormat: true,
    minuteIncrement: '5min',
    maxHeight: 300,
    className: ''
  },
}
