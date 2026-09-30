import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Plus } from 'lucide-react'
import { iconSizes } from '../../src/components/visualization/Icon'
import { Icon } from '../../src/components/visualization/Icon'

const meta = {
  component: Icon,
  argTypes: {
    size: {
      control: 'select',
      options: iconSizes,
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>;

export const icon: Story = {
  args: {
    size: 'md',
  },
  render: ({ size }) => {
    return (
      <div className="flex-row-4 items-end">
        <Icon size={size} className="bg-primary" />
        <Icon size={size} icon={Plus} />
      </div>
    )
  },
}
