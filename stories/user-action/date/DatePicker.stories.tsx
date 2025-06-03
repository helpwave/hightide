import type { Meta, StoryObj } from '@storybook/react'
import { addDuration, ControlledDatePicker, subtractDuration } from '../../../src'

const meta = {
  title: 'User Action/Date',
  component: ControlledDatePicker,
} satisfies Meta<typeof ControlledDatePicker>

export default meta
type Story = StoryObj<typeof meta>;

export const datePicker: Story = {
  args: {
    value: new Date(),
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    initialDisplay: 'day',
    className: '',
    yearMonthPickerProps: {},
    dayPickerProps: {},
  },
}
