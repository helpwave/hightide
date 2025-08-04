import type { Meta, StoryObj } from '@storybook/nextjs'
import { Avatar } from '@/src/components/icons-and-geometry/Avatar'
import type { AvatarProps } from '@/src/components/icons-and-geometry/Avatar'

type AvatarExampleProps = Omit<AvatarProps, 'image'> & {
  useImage?: boolean,
  useName?: boolean,
}

const AvatarExample = ({
                         useImage,
                         useName,
                         name,
                         ...props
                       }: AvatarExampleProps) => {
  return (
    <Avatar {...props} name={useName ? name : undefined} image={useImage ? {
      avatarUrl: 'https://cdn.helpwave.de/test-avatar.svg',
      alt: 'profile picture'
    } : undefined} {...props} />
  )
}

const meta = {
  title: 'Branding/Avatar',
  component: AvatarExample,
} satisfies Meta<typeof AvatarExample>

export default meta
type Story = StoryObj<typeof meta>;

export const avatar: Story = {
  args: {
    useName: false,
    useImage: true,
    name: 'John Doe',
    fullyRounded: false,
    size: 'md',
    className: ''
  },
}
