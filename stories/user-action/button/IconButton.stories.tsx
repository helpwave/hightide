import type { Meta, StoryObj } from '@storybook/nextjs'
import { ButtonColorUtil, IconButton } from '../../../src'
import { action } from 'storybook/actions'
import { Plus } from 'lucide-react'

const meta = {
  title: 'User Action/Button',
  component: IconButton,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonColorUtil.solid,
    }
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>;


export const iconButton: Story = {
  args: {
    children: (<Plus className="w-full h-full"/>),
    color: 'negative',
    size: 'medium',
    disabled: false,
    onClick: action('Clicked'),
  },
}
