import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { DayPickerUncontrolled } from '../../../src/components/date/DayPicker'

const meta = {
  title: 'User Action/Date',
  component: DayPickerUncontrolled,
} satisfies Meta<typeof DayPickerUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const dayPicker: Story = {
  args: {
    displayedMonth: new Date(),
    selected: new Date(),
    onChange: action('onChange'),
    markToday: true,
    weekStart: 'monday',
    className: 'h-max-[300px]'
  },
}
