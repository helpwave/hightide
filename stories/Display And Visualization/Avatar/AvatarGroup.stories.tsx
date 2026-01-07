import type { Meta, StoryObj } from '@storybook/nextjs'
import type { AvatarProps } from '@/src/components/display-and-visualization/Avatar'
import  { AvatarGroup } from '@/src/components/display-and-visualization/Avatar'
import { range } from '@/src/utils/array'
import { faker } from '@faker-js/faker'

const avatars: AvatarProps[] = range(10).map(() => ({
  name: faker.person.fullName(),
  image: {
    avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
    alt: 'profile picture'
  },
}))

type StoryArgs = {
  useName: boolean,
  useImage: boolean,
  useErrorImage: boolean,
} & React.ComponentProps<typeof AvatarGroup>

const meta: Meta<StoryArgs> = {
  component: AvatarGroup,
}

export default meta
type Story = StoryObj<typeof meta>;

export const avatarGroup: Story = {
  args: {
    useImage: true,
    useName: false,
    useErrorImage: false,
    size: 'md',
    showTotalNumber: false,
    avatars
  },
  render: ({ avatars, useErrorImage, useImage, useName, ...props }) => {
    return (
      <AvatarGroup
        {...props}
        avatars={avatars.map(avatar => ({
          ...avatar,
          name: useName ? avatar.name : undefined,
          image: useImage && avatar?.image ? {
            ...avatar?.image,
            avatarUrl: useErrorImage ? 'http://localhost:3000': avatar.image?.avatarUrl
          }: undefined
        }))}
      />
    )
  }
}
