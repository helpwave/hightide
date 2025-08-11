import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { ListBoxUncontrolled } from '../../src/components/layout-and-navigation/ListBox'


const meta = {
  title: 'User Action',
  component: ListBoxUncontrolled,
} satisfies Meta<typeof ListBoxUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const listBox: Story = {
  args: {
    isSelection: true,
    onItemClicked: action('onItemClick'),
    onSelectionChanged: action('onSelectionChanged'),
    options: [
      { value: 'Apple' },
      { value: 'Banana', disabled: true },
      { value: 'Kiwi' },
      { value: 'Blueberry' },
      { value: 'Strawberry' },
      { value: 'Melon' },
      { value: 'Orange' },
      { value: 'Mango' },
      { value: 'Pineapple', disabled: true },
      { value: 'Papaya' },
      { value: 'Grapes' },
      { value: 'Cherry' },
      { value: 'Peach' },
      { value: 'Plum' },
      { value: 'Pear' },
      { value: 'Fig' },
      { value: 'Lemon' },
      { value: 'Lime' },
      { value: 'Coconut' },
      { value: 'Guava' },
      { value: 'Apricot' },
      { value: 'Pomegranate' },
      { value: 'Raspberry', disabled: true },
      { value: 'Blackberry' },
      { value: 'Tangerine' },
      { value: 'Dragonfruit' }
    ].sort((a, b) => a.value.localeCompare(b.value)),
  },
}
