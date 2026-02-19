import { action } from 'storybook/actions'
import {
  MultiSelectChipDisplay
} from '@/src/components/user-interaction/select/MultiSelectChipDisplay'
import { MultiSelectOption } from '@/src/components/user-interaction/select/SelectOption'
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
    showSearch: false,
    readOnly: false,
    required: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
    children: [
      { value: 'Apple', label: 'Apple' },
      { value: 'Banana', label: 'Banana', disabled: true },
      { value: 'Cherry', label: 'Cherry' },
      { value: 'Dragonfruit', label: 'Dragonfruit', className: '!text-red-400' },
      { value: 'Elderberry', label: 'Elderberry' },
      { value: 'Fig', label: 'Fig' },
      { value: 'Grapefruit', label: 'Grapefruit' },
      { value: 'Honeydew', label: 'Honeydew' },
      { value: 'Indianfig', label: 'Indianfig' },
      { value: 'Jackfruit', label: 'Jackfruit' },
      { value: 'Kiwifruit', label: 'Kiwifruit' },
      { value: 'Lemon', label: 'Lemon', disabled: true }
    ].sort((a, b) => a.value.localeCompare(b.value))
      .map((item, index) => (<MultiSelectOption key={index} {...item} />)),
  },
}
