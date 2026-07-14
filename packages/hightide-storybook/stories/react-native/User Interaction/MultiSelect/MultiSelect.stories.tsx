import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MultiSelect } from '@helpwave/hightide-native'
import { action } from 'storybook/actions'

const meta: Meta<typeof MultiSelect> = {
  component: MultiSelect,
}

export default meta
type Story = StoryObj<typeof meta>

const fruitOptions = [
  { id: 'Apple', label: 'Apple' },
  { id: 'Banana', label: 'Banana', disabled: true },
  { id: 'Cherry', label: 'Cherry' },
  { id: 'Dragonfruit', label: 'Dragonfruit' },
  { id: 'Elderberry', label: 'Elderberry' },
  { id: 'Fig', label: 'Fig' },
  { id: 'Grapefruit', label: 'Grapefruit' },
  { id: 'Honeydew', label: 'Honeydew' },
  { id: 'Indianfig', label: 'Indianfig' },
  { id: 'Jackfruit', label: 'Jackfruit' },
  { id: 'Kiwifruit', label: 'Kiwifruit' },
  { id: 'Lemon', label: 'Lemon', disabled: true },
].sort((a, b) => a.label.localeCompare(b.label))

export const multiSelect: Story = {
  args: {
    options: fruitOptions,
    initialValue: ['Apple', 'Cherry'],
    disabled: false,
    invalid: false,
    showSearch: true,
    readOnly: false,
    placeholder: 'Select fruits',
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
