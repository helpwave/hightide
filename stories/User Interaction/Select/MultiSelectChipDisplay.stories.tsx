import { action } from 'storybook/actions'
import {
  MultiSelectChipDisplay
} from '@/src/components/user-interaction/select/MultiSelectChipDisplay'
import { MultiSelectOption } from '@/src/components/user-interaction/select/SelectComponents'
import type { Meta, StoryObj } from '@storybook/nextjs'

const meta = {
  component: MultiSelectChipDisplay,
} satisfies Meta<typeof MultiSelectChipDisplay>

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelectChipDisplay: Story = {
  args: {
    initialValue: ['Apple', 'Cherry'],
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
