import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AvatarWithStatus } from '@/src/components/display-and-visualization/Avatar'

type StoryArgs = {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
} & React.ComponentProps<typeof AvatarWithStatus>

const meta: Meta<StoryArgs> = {
  component: AvatarWithStatus,
  argTypes: {
    useName: { control: 'boolean' },
    useImage: { control: 'boolean' },
    useErrorImage: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const avatarWithStatus: Story = {
  args: {
    isOnline: true,
    useImage: true,
    useName: true,
    useErrorImage: false,
    size: 'md',
    name: 'John Doe',
  },
  render: ({ name, useImage, useName, useErrorImage, ...args }) => {
    return (
      <AvatarWithStatus
        {...args}
        image={useImage ? {
          avatarUrl: useErrorImage ? 'http://localhost:3000/404' : 'https://cdn.helpwave.de/test-avatar.svg',
          alt: 'profile picture',
        } : undefined}
        name={useName ? name : undefined}
      />
    )
  },
}
