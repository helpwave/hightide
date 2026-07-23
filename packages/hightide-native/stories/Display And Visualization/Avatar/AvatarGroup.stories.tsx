import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'

import {
  AvatarGroup,
  AvatarUtil,
  type AvatarGroupProps,
  type AvatarProps
} from '../../../src/components/visualization-and-display/Avatar'

const avatars: AvatarProps[] = [
  {
    name: 'Anna Wellermann',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Jonas Parker',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Miriam Otte',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Bernd Hagen',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Max Mustermann',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Maxine Mustermann',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Clara Schmidt',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Leon Fischer',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Sophie Weber',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
  {
    name: 'Paul Keller',
    image: {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture',
    },
  },
]

type StoryArgs = AvatarGroupProps & {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
}

const meta: Meta<StoryArgs> = {
  component: AvatarGroup,
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

export const avatarGroup: Story = {
  args: {
    useImage: true,
    useName: false,
    useErrorImage: false,
    size: 'md',
    showTotalNumber: false,
    avatars,
  },
  render: ({ avatars: storyAvatars, useErrorImage, useImage, useName, ...props }) => (
    <AvatarGroup
      {...props}
      avatars={storyAvatars.map(avatar => ({
        ...avatar,
        name: useName ? avatar.name : undefined,
        image: useImage && avatar.image ? {
          ...avatar.image,
          avatarUrl: useErrorImage ? 'http://localhost:3000' : avatar.image.avatarUrl,
        } : undefined,
      }))}
    />
  ),
}
