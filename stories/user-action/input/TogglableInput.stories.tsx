import { action } from 'storybook/actions'
import { ToggleableInputUncontrolled } from '../../../src'
import type { Meta, StoryObj } from '@storybook/nextjs'

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
