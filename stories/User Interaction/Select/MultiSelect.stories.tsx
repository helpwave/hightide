import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { MultiSelect } from '@/src/components/user-interaction/MultiSelect/MultiSelect'
import { MultiSelectOption } from '@/src/components/user-interaction/MultiSelect/MultiSelectOption'

const meta = {
  component: MultiSelect,
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>;

export const multiSelect: Story = {
  args: {
    initialValue: ['Apple', 'Cherry'],
    disabled: false,
    invalid: false,
    showSearch: true,
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
