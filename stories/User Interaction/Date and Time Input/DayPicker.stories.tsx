import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { DayPicker } from '@/src/components/user-interaction/date/DayPicker'

const meta = {
  component: DayPicker,
} satisfies Meta<typeof DayPicker>

export default meta
type Story = StoryObj<typeof meta>;

export const dayPicker: Story = {
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
