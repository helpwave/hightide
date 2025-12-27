import type { Meta, StoryObj } from '@storybook/nextjs'
import { DatePickerUncontrolled } from '../../../src/components/user-interaction/date/DatePicker'
import { addDuration, subtractDuration } from '../../../src/utils/date'
import { action } from 'storybook/actions'

const meta = {
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
    onValueChange: action('onValueChange'),
  },
}
