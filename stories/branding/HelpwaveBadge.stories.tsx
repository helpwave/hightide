import type { Meta, StoryObj } from '@storybook/react'
import { HelpwaveBadge } from '../../src'

const meta = {
  title: 'Branding/Logo',
  component: HelpwaveBadge,
} satisfies Meta<typeof HelpwaveBadge>

export default meta
type Story = StoryObj<typeof meta>;

export const helpwaveBadge: Story = {
  args: {
    size: 'small',
    title: 'helpwave',
    className: ''
  },
}
