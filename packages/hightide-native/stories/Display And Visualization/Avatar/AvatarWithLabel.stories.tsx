import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'

import {
  AvatarUtil,
  AvatarWithLabel,
  type AvatarWithLabelProps
} from '../../../src/components/visualization-and-display/Avatar'

type StoryArgs = AvatarWithLabelProps & {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
}

const meta: Meta<StoryArgs> = {
  component: AvatarWithLabel,
  argTypes: {
    size: {
      control: 'select',
      options: [...AvatarUtil.sizes],
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    useName: { control: 'boolean' },
    useImage: { control: 'boolean' },
    useErrorImage: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<StoryArgs>

export const avatarWithLabel: Story = {
  args: {
    label: 'John Doe',
    labelPosition: 'left',
    size: 'md',
    name: 'John Doe',
    useImage: true,
    useName: true,
    useErrorImage: false,
  },
  render: ({ name, useImage, useName, useErrorImage, label, ...args }) => (
    <AvatarWithLabel
      {...args}
      label={label}
      image={useImage ? {
        avatarUrl: useErrorImage ? 'http://localhost:3000/404' : 'https://cdn.helpwave.de/test-avatar.svg',
        alt: 'profile picture',
      } : undefined}
      name={useName ? name : undefined}
    />
  ),
}
