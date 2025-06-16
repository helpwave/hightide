import type { Meta, StoryObj } from '@storybook/nextjs'
import { AvatarGroup } from '../../src'

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
