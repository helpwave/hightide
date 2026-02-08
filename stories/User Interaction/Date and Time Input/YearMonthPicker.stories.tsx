import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { YearMonthPicker } from '@/src/components/user-interaction/date/YearMonthPicker'
import { addDuration, subtractDuration } from '@/src/utils/date'

const meta = {
  component: YearMonthPicker,
} satisfies Meta<typeof YearMonthPicker>

export default meta
type Story = StoryObj<typeof meta>;

export const yearMonthPicker: Story = {
  args: {
    initialValue: new Date(),
    start: subtractDuration(new Date(), { years: 50 }),
    end: addDuration(new Date(), { years: 50 }),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  decorators: (Story) => {
    return (
      <div className="h-128 overflow-hidden max-w-64">
        <Story />
      </div>
    )
  }
}
