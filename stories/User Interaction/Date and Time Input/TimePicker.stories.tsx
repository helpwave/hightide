import type { Meta, StoryObj } from '@storybook/nextjs'
import { TimePickerUncontrolled } from '../../../src/components/user-interaction/date/TimePicker'
import { action } from 'storybook/actions'

const meta = {
  component: TimePickerUncontrolled,
} satisfies Meta<typeof TimePickerUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const timePicker: Story = {
  args: {
    time: new Date(),
    is24HourFormat: true,
    minuteIncrement: '5min',
    maxHeight: 300,
    onValueChange: action('onValueChange')
  },
}
