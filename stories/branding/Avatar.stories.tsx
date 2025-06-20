import type { Meta, StoryObj } from '@storybook/nextjs'
import { Avatar } from '../../src'

const meta = {
  title: 'Branding/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>;

export const avatar: Story = {
  args: {
    alt: 'altText',
    avatarUrl: 'https://helpwave.de/favicon.ico',
    size: 'small',
    className: ''
  },
}
