import type { Meta, StoryObj } from '@storybook/react-vite'
import { HelpwaveBadge } from '../../../src/components/branding/visualization/HelpwaveBadge'

const meta = {
  component: HelpwaveBadge,
} satisfies Meta<typeof HelpwaveBadge>

export default meta
type Story = StoryObj<typeof meta>;

export const helpwaveBadge: Story = {
  args: {
    size: 'sm',
    title: 'helpwave',
    className: ''
  },
}
