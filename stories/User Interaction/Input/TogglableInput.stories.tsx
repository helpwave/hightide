import { action } from 'storybook/actions'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { ToggleableInputUncontrolled } from '../../../src/components/user-interaction/input/ToggleableInput'

const meta = {
  component: ToggleableInputUncontrolled,
} satisfies Meta<typeof ToggleableInputUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const togglableInput: Story = {
  args: {
    value: 'Text',
    onChange: action('onChange'),
    onChangeText: action('onChangeText'),
    onEditCompleted: action('onEditCompleted'),
  },
}
