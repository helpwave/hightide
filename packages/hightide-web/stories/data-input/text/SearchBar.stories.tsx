import type { Meta, StoryObj } from '@storybook/react-vite'
import { action } from 'storybook/actions'
import { SearchBar } from '../../../src/components/data-input/text/SearchBar'

const meta = {
  component: SearchBar,
} satisfies Meta<typeof SearchBar>

export default meta
type Story = StoryObj<typeof meta>;

export const searchBar: Story = {
  args: {
    initialValue: '',
    isDisabled: false,
    isInvalid: false,
    inputProps: { placeholder: 'Placeholder' },
    onSearch: action('onSearch'),
    onValueChange: action('onValueChange'),
  },
}
