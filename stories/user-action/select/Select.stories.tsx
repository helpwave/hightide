import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { SelectUncontrolled } from '../../../src'

const meta = {
  title: 'User Action/Select',
  component: SelectUncontrolled<string>,
} satisfies Meta<typeof SelectUncontrolled<string>>

export default meta
type Story = StoryObj<typeof meta>;

export const select: Story = {
  decorators: [
    (Story) => (
      <div className="flex-row-0 rounded-lg h-32 w-64 bg-warning/20 overflow-auto">
        <div className="min-w-96 h-full">
          <Story/>
        </div>
      </div>
    )
  ],
  args: {
    disabled: false,
    hintText: 'Select something',
    alignmentVertical: 'bottomOutside',
    alignmentHorizontal: 'leftInside',
    onChange: action('updated'),
    options: [
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Pear', disabled: true },
      { value: '3', label: 'Strawberry' },
      { value: '4', label: 'Pineapple-styled' },
      { value: '5', label: 'Blackberry' },
      { value: '6', label: 'Blueberry', disabled: true }
    ],
  },
}
