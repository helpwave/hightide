import { action } from 'storybook/actions'
import { MultiSelectUncontrolled } from '../../../src/components/user-action/select/MultiSelect'
import type { Meta, StoryObj } from '@storybook/nextjs'

const meta = {
  title: 'User Action/Select',
  component: MultiSelectUncontrolled,
} satisfies Meta<typeof MultiSelectUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelect: Story = {
  args: {
    disabled: false,
    useChipDisplay: true,
    onChange: action('onChange'),
    value: ['Apple', 'Cherry'],
    options: [
      { value: 'Apple' },
      { value: 'Banana', disabled: true },
      { value: 'Cherry' },
      { value: 'Dragonfruit', className: '!text-red-400' },
      { value: 'Elderberry' },
      { value: 'Fig' },
      { value: 'Grapefruit' },
      { value: 'Honeydew' },
      { value: 'Indianfig' },
      { value: 'Jackfruit' },
      { value: 'Kiwifruit' },
      { value: 'Lemon', disabled: true }
    ],
  },
}
