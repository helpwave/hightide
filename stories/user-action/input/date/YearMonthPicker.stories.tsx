import type { Meta, StoryObj } from '@storybook/react'
import { addDuration, subtractDuration } from '../../../../src/util/date'
import { ControlledYearMonthPicker } from '../../../../src/components/date/YearMonthPicker'

const meta = {
  title: 'User-Action/Input/Date',
  component: ControlledYearMonthPicker,
} satisfies Meta<typeof ControlledYearMonthPicker>

export default meta
type Story = StoryObj<typeof meta>;

export const YearMonthPickerVariation: Story = {
  args: {
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    className: 'max-w-[200px]',
    maxHeight: 300,
    showValueOpen: false
  },
}
