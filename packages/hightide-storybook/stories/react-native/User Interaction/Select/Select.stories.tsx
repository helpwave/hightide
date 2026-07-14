import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select } from '@helpwave/hightide-native'
import { action } from 'storybook/actions'

const meta: Meta<typeof Select> = {
  component: Select,
}

export default meta
type Story = StoryObj<typeof meta>

const fruitOptions = [
  { id: 'Apple', label: 'Apple' },
  { id: 'Pear', label: 'Pear', disabled: true },
  { id: 'Strawberry', label: 'Strawberry' },
  { id: 'Pineapple', label: 'Pineapple' },
  { id: 'Blackberry', label: 'Blackberry' },
  { id: 'Blueberry', label: 'Blueberry', disabled: true },
  { id: 'Banana', label: 'Banana' },
  { id: 'Kiwi', label: 'Kiwi', disabled: true },
  { id: 'Maracuja', label: 'Maracuja', disabled: true },
  { id: 'Wildberry', label: 'Wildberry', disabled: true },
  { id: 'Watermelon', label: 'Watermelon' },
  { id: 'Honeymelon', label: 'Honeymelon' },
  { id: 'Papja', label: 'Papja' },
].sort((a, b) => a.label.localeCompare(b.label))

export const select: Story = {
  args: {
    options: fruitOptions,
    initialValue: null,
    disabled: false,
    invalid: false,
    showSearch: true,
    readOnly: false,
    placeholder: 'Select a fruit',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
