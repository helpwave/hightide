import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { SearchBar } from '@/src/components/user-interaction/input/SearchBar'

const meta = {
  component: SearchBar,
} satisfies Meta<typeof SearchBar>

export default meta
type Story = StoryObj<typeof meta>;

export const searchBar: Story = {
  args: {
    value: '',
    disabled: false,
    invalid: false,
    placeholder: 'Placeholder',
    onSearch: action('onSearch'),
    onValueChange: action('onValueChange'),
  },
}
