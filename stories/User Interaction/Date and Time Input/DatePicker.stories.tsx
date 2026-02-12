import type { Meta, StoryObj } from '@storybook/nextjs'
import {  DatePicker } from '@/src/components/user-interaction/date/DatePicker'
import { DateUtils } from '@/src/utils/date'
import { action } from 'storybook/actions'

const meta = {
  component: DatePicker,
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>;

export const datePicker: Story = {
  args: {
    initialValue: new Date(),
    start: DateUtils.subtractDuration(new Date(), { years: 50 }),
    end: DateUtils.addDuration(new Date(), { years: 50 }),
    initialDisplay: 'day',
    yearMonthPickerProps: {},
    dayPickerProps: {},
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete')
  },
}
