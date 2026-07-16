import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { action } from 'storybook/actions'
import { YearMonthPicker } from '@/src/components/user-interaction/date/YearMonthPicker'
import { DateUtils } from '@helpwave/hightide-utils/utils'

const meta = {
  component: YearMonthPicker,
} satisfies Meta<typeof YearMonthPicker>

export default meta
type Story = StoryObj<typeof meta>;

export const yearMonthPicker: Story = {
  args: {
    initialValue: new Date(),
    start: DateUtils.subtractDuration(new Date(), { years: 50 }),
    end: DateUtils.addDuration(new Date(), { years: 50 }),
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
