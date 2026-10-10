import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { YearMonthPicker } from '../../../src/components/data-input/date/YearMonthPicker'
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
      <div className="max-w-64">
        <Story />
      </div>
    )
  }
}
