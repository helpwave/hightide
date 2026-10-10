import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'

import { CalendarDayPicker } from '../../../src/components/data-input/date/CalendarDayPicker'

const meta = {
  component: CalendarDayPicker,
} satisfies Meta<typeof CalendarDayPicker>

export default meta
type Story = StoryObj<typeof meta>

export const calendarDayPicker: Story = {
  args: {
    displayedMonth: new Date(),
    initialValue: new Date(),
    markToday: true,
    weekStart: 'monday',
    className: 'h-max-71',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
