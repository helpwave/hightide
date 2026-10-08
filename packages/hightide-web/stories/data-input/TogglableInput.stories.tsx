import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleableInput } from '../../src/components/data-input/input/ToggleableInput'

const meta = {
  component: ToggleableInput,
} satisfies Meta<typeof ToggleableInput>

export default meta
type Story = StoryObj<typeof meta>;

export const togglableInput: Story = {
  args: {
    initialValue: 'Text',
    onChange: action('onChange'),
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
