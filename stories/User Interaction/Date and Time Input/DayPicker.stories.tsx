import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { DayPickerUncontrolled } from '../../../src/components/user-interaction/date/DayPicker'

const meta = {
  component: DayPickerUncontrolled,
} satisfies Meta<typeof DayPickerUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const dayPicker: Story = {
  args: {
    displayedMonth: new Date(),
    selected: new Date(),
    markToday: true,
    weekStart: 'monday',
    className: 'h-max-71',
    onValueChange: action('onValueChange'),
  },
}
