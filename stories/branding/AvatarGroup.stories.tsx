import type { Meta, StoryObj } from '@storybook/react'
import { AvatarGroup } from '../../src/components/icons-and-geometry/Avatar'

const meta = {
  title: 'Branding/Avatar',
  component: AvatarGroup,
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>;

export const avatarGroup: Story = {
  args: {
    avatars: [
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
      { alt: 'altText', avatarUrl: 'https://helpwave.de/favicon.ico' },
    ],
    maxShownProfiles: 5,
    size: 'tiny'
  },
}
