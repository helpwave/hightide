import type { Meta, StoryObj } from '@storybook/react'
import { InputUncontrolled } from '../../src'
import { action } from '@storybook/addon-actions'

const meta = {
  title: 'User Action',
  component: InputUncontrolled,
} satisfies Meta<typeof InputUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const input: Story = {
  args: {
    onChange: action('onChange'),
    onChangeText: action('onChangeText'),
    onEditCompleted: action('onEditCompleted'),
    type: 'text',
    label: { name: 'Label' },
    className: '',
  },
}
