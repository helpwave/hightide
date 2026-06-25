import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from '@/src/components/display-and-visualization/Card'

const meta: Meta<typeof Card> = {
  component: Card,
}

export default meta
type Story = StoryObj<typeof meta>;

export const card: Story = {
  args: {
    title: 'Card title',
    description: 'Optional description for the card.',
    size: 'md',
  },
}
