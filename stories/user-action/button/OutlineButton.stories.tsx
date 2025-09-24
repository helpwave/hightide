import type { Meta, StoryObj } from '@storybook/nextjs'
import { ButtonColorUtil, OutlineButton } from '../../../src/components/user-action/Button'
import { action } from 'storybook/actions'

const meta = {
  title: 'User Action/Button',
  component: OutlineButton,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonColorUtil.outline,
    }
  },
} satisfies Meta<typeof OutlineButton>

export default meta
type Story = StoryObj<typeof meta>;

export const outlineButton: Story = {
  args: {
    children: 'Test',
    color: 'primary',
    size: 'medium',
    disabled: false,
    onClick: action('Clicked'),
  },
}
