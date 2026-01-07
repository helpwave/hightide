import { action } from 'storybook/actions'
import {
  MultiSelectChipDisplayUncontrolled,
  SelectOption
} from '@/src/components/user-interaction/Select'
import type { Meta, StoryObj } from '@storybook/nextjs'

const meta = {
  component: MultiSelectChipDisplayUncontrolled,
} satisfies Meta<typeof MultiSelectChipDisplayUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelectChipDisplay: Story = {
  args: {
    value: ['Apple', 'Cherry'],
    disabled: false,
    invalid: false,
    onValueChange: action('onValueChange'),
    children: [
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
    ].sort((a,b) => a.value.localeCompare(b.value))
      .map((value, index) => (<SelectOption key={index} {...value} />)),
  },
}
