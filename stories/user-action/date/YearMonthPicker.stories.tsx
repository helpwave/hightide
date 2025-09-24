import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { YearMonthPickerUncontrolled } from '../../../src/components/date/YearMonthPicker'
import { addDuration, subtractDuration } from '../../../src/utils/date'

const meta = {
  title: 'User Action/Date',
  component: YearMonthPickerUncontrolled,
} satisfies Meta<typeof YearMonthPickerUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const yearMonthPicker: Story = {
  args: {
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    onChange: action('onChange'),
    className: 'max-w-64',
    maxHeight: 300,
    showValueOpen: false
  },
}
