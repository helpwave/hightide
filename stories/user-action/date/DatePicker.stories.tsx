import type { Meta, StoryObj } from '@storybook/nextjs'
import { addDuration, DatePickerUncontrolled, subtractDuration } from '../../../src'

const meta = {
  title: 'User Action/Date',
  component: DatePickerUncontrolled,
} satisfies Meta<typeof DatePickerUncontrolled>

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
