import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { ToggleableInputUncontrolled } from '../../../src/components/user-action/input/ToggleableInput'

const meta = {
  title: 'User-Action/Input',
  component: ToggleableInputUncontrolled,
} satisfies Meta<typeof ToggleableInputUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const ToggleableInput: Story = {
  args: {
    value: 'Text',
    onChange: action('onChange'),
    onChangeText: action('onChangeText'),
    onEditCompleted: action('onEditCompleted'),
  },
}
