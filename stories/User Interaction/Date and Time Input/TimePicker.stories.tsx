import type { Meta, StoryObj } from '@storybook/nextjs'
import { TimePicker } from '@/src/components/user-interaction/date/TimePicker'
import { action } from 'storybook/actions'

const meta = {
  component: TimePicker,
} satisfies Meta<typeof TimePicker>

export default meta
type Story = StoryObj<typeof meta>;

export const timePicker: Story = {
  args: {
    initialValue: new Date(),
    is24HourFormat: true,
    minuteIncrement: '5min',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete')
  },
  decorators: (Story) => {
    return (
      <div className="flex flex-col overflow-hidden h-64">
        <Story />
      </div>
    )
  }
}
