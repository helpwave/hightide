import type { Meta, StoryObj } from '@storybook/react'
import { addDuration, subtractDuration, YearMonthPickerControlled } from '../../../src'

const meta = {
  title: 'User Action/Date',
  component: YearMonthPickerControlled,
} satisfies Meta<typeof YearMonthPickerControlled>

export default meta
type Story = StoryObj<typeof meta>;

export const yearMonthPicker: Story = {
  args: {
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    className: 'max-w-[200px]',
    maxHeight: 300,
    showValueOpen: false
  },
}
