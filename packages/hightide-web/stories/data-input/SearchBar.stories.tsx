import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { SearchBar } from '../../src/components/data-input/input/SearchBar'

const meta = {
  component: SearchBar,
} satisfies Meta<typeof SearchBar>

export default meta
type Story = StoryObj<typeof meta>;

export const searchBar: Story = {
  args: {
    initialValue: '',
    disabled: false,
    invalid: false,
    placeholder: 'Placeholder',
    onSearch: action('onSearch'),
    onValueChange: action('onValueChange'),
  },
}
