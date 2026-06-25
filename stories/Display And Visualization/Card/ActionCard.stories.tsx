import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChevronRight } from 'lucide-react'
import { ActionCard } from '@/src/components/display-and-visualization/Card'
import { action } from 'storybook/actions'

const meta: Meta<typeof ActionCard> = {
  component: ActionCard,
}

export default meta
type Story = StoryObj<typeof meta>;

export const actionCard: Story = {
  args: {
    title: 'Action card title',
    description: 'Click to trigger an action.',
    size: 'md',
    disabled: false,
    action: <ChevronRight className="size-force-5" />,
    onClick: action('onClick'),
  },
}
