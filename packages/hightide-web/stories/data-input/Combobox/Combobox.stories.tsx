import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { Combobox } from '../../../src/components/data-input/Combobox/Combobox'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'watermelon', label: 'Watermelon' },
]

const meta: Meta<typeof Combobox> = {
  component: Combobox,
}

export default meta
type Story = StoryObj<typeof meta>;

export const combobox: Story = {
  args: {
    id: undefined,
    children: options.map(({ value, label }) => (
      <Combobox.Option key={value} value={value} label={label}>
        {label}
      </Combobox.Option>
    )),
    onItemClick: action('onItemClick'),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
  render: (args) => (
    <div className="w-80 flex flex-col gap-2">
      <Combobox {...args} />
    </div>
  ),
}
