import { action } from 'storybook/actions'
import {
  MultiSelectChipDisplayUncontrolled
} from '@/src/components/user-interaction/select/MultiSelectChipDisplay'
import { MultiSelectOption } from '@/src/components/user-interaction/select/SelectComponents'
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
    onEditComplete: action('onEditComplete'),
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
      .map((value, index) => (<MultiSelectOption key={index} {...value} />)),
  },
}
