import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../../../src/components/visualization/Avatar/Avatar'
import type { AvatarStatus } from '../../../src/components/visualization/Avatar/AvatarTypes'

type StoryArgs = {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
} & React.ComponentProps<typeof Avatar>

const meta: Meta<StoryArgs> = {
  component: Avatar,
  argTypes: {
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy', 'unknown'] satisfies AvatarStatus[],
    },
    useName: { control: 'boolean' },
    useImage: { control: 'boolean' },
    useErrorImage: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>;

export const avatar: Story = {
  args: {
    status: 'online',
    hasStatusIndicator: true,
    useImage: true,
    useName: true,
    useErrorImage: false,
    size: 'md',
    name: 'John Doe',
  },
  render: ({ name, useImage, useName, useErrorImage, ...args }) => {
    return (
      <Avatar
        {...args}
        image={useImage ? {
          avatarUrl: useErrorImage ? 'http://localhost:3000/404':'https://cdn.helpwave.de/test-avatar.svg',
          alt: 'profile picture'
        }: undefined}
        name={useName ? name : undefined}
      />
    )
  }
}
