import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DateTimePicker } from '@/src/components/user-interaction/date/DateTimePicker'
import { DateUtils } from '@helpwave/hightide-utils'
import { action } from 'storybook/actions'


const meta = {
  component: DateTimePicker,
} satisfies Meta<typeof DateTimePicker>

export default meta
type Story = StoryObj<typeof meta>;

export const dateTimePicker: Story = {
  args: {
    initialValue: new Date(),
    mode: 'dateTime',
    start: DateUtils.subtractDuration(new Date(), { years: 50 }),
    end: DateUtils.addDuration(new Date(), { years: 50 }),
    is24HourFormat: true,
    minuteIncrement: '5min',
    weekStart: 'monday',
    markToday: true,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete')
  },
}
