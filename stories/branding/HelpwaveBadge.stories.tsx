import type { Meta, StoryObj } from '@storybook/nextjs'
import { HelpwaveBadge } from '@/src/components/branding/HelpwaveBadge'

const meta = {
  title: 'Branding/Logo',
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
