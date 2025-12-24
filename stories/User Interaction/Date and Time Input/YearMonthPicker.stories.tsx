import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { YearMonthPickerUncontrolled } from '../../../src/components/user-interaction/date/YearMonthPicker'
import { addDuration, subtractDuration } from '../../../src/utils/date'

const meta = {
  component: YearMonthPickerUncontrolled,
} satisfies Meta<typeof YearMonthPickerUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const yearMonthPicker: Story = {
  args: {
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    className: 'max-w-64',
    maxHeight: 300,
    showValueOpen: false,
    onValueChange: action('onValueChange'),
  },
}
