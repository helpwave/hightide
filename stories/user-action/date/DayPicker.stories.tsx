import type { Meta, StoryObj } from '@storybook/react'
import { DayPickerUncontrolled } from '../../../src'

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
    markToday: true,
    weekStart: 'monday',
    className: 'h-max-[300px]'
  },
}
