import type { Meta, StoryObj } from '@storybook/nextjs'
import { TextButton } from '../../../src'
import { action } from 'storybook/actions'

const meta = {
  title: 'User Action/Button',
  component: TextButton,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'negative', 'neutral']
    }
  },
} satisfies Meta<typeof TextButton>

export default meta
type Story = StoryObj<typeof meta>;

export const textButton: Story = {
  args: {
    children: 'Test',
    color: 'negative',
    size: 'medium',
    disabled: false,
    className: 'rounded',
    onClick: action('Clicked'),
  },
}
