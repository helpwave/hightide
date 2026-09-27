import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import clsx from 'clsx'
import { Avatar } from '../../../src/components/display-and-visualization/Avatar/Avatar'

type LabelPosition = 'left' | 'right'

type StoryArgs = {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
  label: ReactNode,
  labelPosition: LabelPosition,
} & React.ComponentProps<typeof Avatar>

const meta: Meta<StoryArgs> = {
  component: Avatar,
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
    hasStatusIndicator: true,
    name: 'John Doe',
    useImage: true,
    useName: true,
    useErrorImage: false,
  },
  render: ({ name, useImage, useName, useErrorImage, label, labelPosition, className, size = 'md', ...args }) => {
    const avatar = (
      <Avatar
        {...args}
        size={size}
        image={useImage ? {
          avatarUrl: useErrorImage ? 'http://localhost:3000/404' : 'https://cdn.helpwave.de/test-avatar.svg',
          alt: 'profile picture',
        } : undefined}
        name={useName ? name : undefined}
      />
    )
    const labelElement = (
      <span className="avatar-with-label-text">
        {label}
      </span>
    )

    return (
      <div
        className={clsx('avatar-with-label', className)}
        data-label-position={labelPosition}
        data-size={size ?? undefined}
      >
        {labelPosition === 'left' ? labelElement : avatar}
        {labelPosition === 'left' ? avatar : labelElement}
      </div>
    )
  },
}
