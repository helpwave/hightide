import type { Meta, StoryObj } from '@storybook/nextjs'
import type { AvatarGroupProps, AvatarProps } from '@/src/components/icons-and-geometry/Avatar'
import { range } from '@/src/utils/array'
import { faker } from '@faker-js/faker'
import { AvatarGroup } from '../../src/components/icons-and-geometry/Avatar'

type AvatarGroupExampleProps = Omit<AvatarGroupProps, 'avatars'> & {
  useImage?: boolean,
  useName?: boolean,
}

const avatars: AvatarProps[] = range(10).map(() => ({
  name: faker.person.fullName(),
  image: {
    avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
    alt: 'profile picture'
  },
}))

const AvatarGroupExample = ({
                              useImage,
                              useName,
                              ...props
                            }: AvatarGroupExampleProps) => {
  return (
    <AvatarGroup
      {...props}
      avatars={avatars.map(value => {
        return {
          image: useImage ? value.image : undefined,
          name: useName ? value.name : undefined
        }
      })}
    />
  )
}

const meta = {
  title: 'Branding/Avatar',
  component: AvatarGroupExample,
} satisfies Meta<typeof AvatarGroupExample>

export default meta
type Story = StoryObj<typeof meta>;

export const avatarGroup: Story = {
  args: {
    useImage: true,
    useName: false,
    size: 'md',
    fullyRounded: true,
    maxShownProfiles: 5,
    showTotalNumber: false,
  },
}
