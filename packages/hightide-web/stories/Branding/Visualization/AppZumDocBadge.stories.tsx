import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppZumDocBadge } from '../../../src/components/branding/visualization/AppZumDocBadge'

const meta = {
  component: AppZumDocBadge,
} satisfies Meta<typeof AppZumDocBadge>

export default meta
type Story = StoryObj<typeof meta>;

export const appZumDocBadge: Story = {
  args: {
    size: 'sm',
    title: 'App zum Doc',
    className: ''
  },
}
