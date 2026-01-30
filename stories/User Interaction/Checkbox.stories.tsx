import type { Meta, StoryObj } from '@storybook/nextjs'
import { Checkbox } from '@/src/components/user-interaction/Checkbox'
import { action } from 'storybook/actions'

const meta = {
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>;

export const checkbox: Story = {
  args: {
    value: true,
    indeterminate: false,
    disabled: false,
    invalid: false,
    size: 'md',
    alwaysShowCheckIcon: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete')
  },
}
