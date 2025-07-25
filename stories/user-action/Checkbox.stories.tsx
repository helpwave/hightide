import type { Meta, StoryObj } from '@storybook/nextjs'
import { CheckboxUncontrolled } from '../../src'
import { action } from 'storybook/actions'

const meta = {
  title: 'User Action/Checkbox',
  component: CheckboxUncontrolled,
} satisfies Meta<typeof CheckboxUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const checkbox: Story = {
  args: {
    checked: true,
    indeterminate: false,
    disabled: false,
    size: 'md',
    onChange: action('onChange')
  },
}
