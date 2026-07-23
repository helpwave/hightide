import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'

import {
  Avatar,
  AvatarUtil,
  type AvatarProps
} from '../../../src/components/visualization-and-display/Avatar'

type StoryArgs = AvatarProps & {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
}

const meta: Meta<StoryArgs> = {
  component: Avatar,
  argTypes: {
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

export const avatar: Story = {
  args: {
    useImage: true,
    useName: true,
    useErrorImage: false,
    size: 'md',
    name: 'John Doe',
  },
  render: ({ name, useImage, useName, useErrorImage, ...args }) => (
    <Avatar
      {...args}
      image={useImage ? {
        avatarUrl: useErrorImage ? 'http://localhost:3000/404' : 'https://cdn.helpwave.de/test-avatar.svg',
        alt: 'profile picture',
      } : undefined}
      name={useName ? name : undefined}
    />
  ),
}
