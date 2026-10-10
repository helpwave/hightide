import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { DateUtils } from '@helpwave/hightide-utils/utils'

import { CalendarDatePicker } from '../../../src/components/data-input/date/CalendarDatePicker'

const meta = {
  component: CalendarDatePicker,
} satisfies Meta<typeof CalendarDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const calendarDatePicker: Story = {
  args: {
    initialValue: new Date(),
    start: DateUtils.subtractDuration(new Date(), { years: 50 }),
    end: DateUtils.addDuration(new Date(), { years: 50 }),
    initialDisplay: 'day',
    yearMonthPickerProps: {},
    calendarDayPickerProps: {},
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete')
  },
}
