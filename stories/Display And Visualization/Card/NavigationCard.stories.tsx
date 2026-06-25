import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NavigationCard } from '@/src/components/display-and-visualization/Card'

const meta: Meta<typeof NavigationCard> = {
  component: NavigationCard,
}

export default meta
type Story = StoryObj<typeof meta>;

export const navigationCard: Story = {
  args: {
    title: 'Navigation card title',
    description: 'Navigate to another page.',
    href: '#',
    size: 'md',
    isExternal: false,
  },
}
