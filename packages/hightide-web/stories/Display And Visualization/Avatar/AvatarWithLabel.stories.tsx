import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AvatarWithLabel } from '../../../src/components/display-and-visualization/Avatar'

type StoryArgs = {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
} & React.ComponentProps<typeof AvatarWithLabel>

const meta: Meta<StoryArgs> = {
  component: AvatarWithLabel,
  argTypes: {
    useName: { control: 'boolean' },
    useImage: { control: 'boolean' },
    useErrorImage: { control: 'boolean' },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

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
  render: ({ name, useImage, useName, useErrorImage, label, ...args }) => {
    return (
      <AvatarWithLabel
        {...args}
        label={label}
        image={useImage ? {
          avatarUrl: useErrorImage ? 'http://localhost:3000/404' : 'https://cdn.helpwave.de/test-avatar.svg',
          alt: 'profile picture',
        } : undefined}
        name={useName ? name : undefined}
      />
    )
  },
}
