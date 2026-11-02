import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { useState } from 'react'
import { Combobox } from '../../../../src/components/data-input/selection/Combobox/Combobox'

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
    options,
    onItemClick: action('onItemClick'),
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
  render: (args) => (
    <div className="w-80 flex flex-col gap-2">
      <Combobox {...args} />
    </div>
  ),
}

export const allowNewValue: Story = {
  args: {
    isAllowingNewValue: true,
    onNewValueAdded: action('onNewValueAdded'),
    onItemClick: action('onItemClick'),
    onValueChange: action('onValueChange'),
    onStateEvent: action('onStateEvent'),
  },
  render: function AllowNewValue(args) {
    const [added, setAdded] = useState<string[]>([])
    const values = [
      ...options,
      ...added.map((value) => ({ value, label: value })),
    ]

    return (
      <div className="w-80 flex flex-col gap-2">
        <Combobox
          {...args}
          options={values}
          onNewValueAdded={(value) => {
            args.onNewValueAdded?.(value)
            setAdded((current) => current.includes(value) ? current : [...current, value])
          }}
        />
      </div>
    )
  },
}
