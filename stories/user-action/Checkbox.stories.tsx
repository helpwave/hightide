import type { Meta, StoryObj } from '@storybook/nextjs'
import { CheckboxUncontrolled } from '../../src'

const meta = {
  title: 'User Action/Checkbox',
  component: CheckboxUncontrolled,
} satisfies Meta<typeof CheckboxUncontrolled>

export default meta
type Story = StoryObj<typeof meta>;

export const checkbox: Story = {
  args: {
    defaultValue: true,
    disabled: false,
    id: 'checkbox1',
    size: 'medium',
    label: { name: 'Click me ^^', labelType: 'labelMedium', className: '' },
  },
}
