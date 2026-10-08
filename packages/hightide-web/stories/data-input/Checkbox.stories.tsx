import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '../../src/components/data-input/Checkbox'
import { action } from 'storybook/actions'

const meta = {
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>;

export const checkbox: Story = {
  args: {
    initialValue: true,
    indeterminate: false,
    disabled: false,
    invalid: false,
    isRounded: false,
    size: 'md',
    alwaysShowCheckIcon: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete')
  },
}
