import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'
import { Checkbox } from '@/src/components/user-interaction/Checkbox'

const meta = {
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

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
    onEditComplete: action('onEditComplete'),
  },
}
