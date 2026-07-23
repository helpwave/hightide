import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'

import {
  AvatarUtil,
  AvatarWithStatus,
  type AvatarWithStatusProps
} from '../../../src/components/visualization-and-display/Avatar'

type StoryArgs = AvatarWithStatusProps & {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
}

const meta: Meta<StoryArgs> = {
  component: AvatarWithStatus,
  argTypes: {
    status: {
      control: 'select',
      options: [...AvatarUtil.statuses],
    },
    size: {
      control: 'select',
      options: [...AvatarUtil.sizes],
    },
    useName: { control: 'boolean' },
    useImage: { control: 'boolean' },
    useErrorImage: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<StoryArgs>

export const avatarWithStatus: Story = {
  args: {
    status: 'online',
    size: 'md',
    name: 'John Doe',
    useImage: true,
    useName: true,
    useErrorImage: false,
  },
  render: ({ name, useImage, useName, useErrorImage, ...args }) => (
    <AvatarWithStatus
      {...args}
      image={useImage ? {
        avatarUrl: useErrorImage ? 'http://localhost:3000/404' : 'https://cdn.helpwave.de/test-avatar.svg',
        alt: 'profile picture',
      } : undefined}
      name={useName ? name : undefined}
    />
  ),
}
