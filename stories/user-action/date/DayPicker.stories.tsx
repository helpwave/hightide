import type { Meta, StoryObj } from '@storybook/react'
import { DayPickerControlled } from '../../../src'

const meta = {
  title: 'User Action/Date',
  component: DayPickerControlled,
} satisfies Meta<typeof DayPickerControlled>

export default meta
type Story = StoryObj<typeof meta>;

export const dayPicker: Story = {
  args: {
    displayedMonth: new Date(),
    selected: new Date(),
    markToday: true,
    weekStart: 'monday',
    className: 'h-max-[300px]'
  },
}
