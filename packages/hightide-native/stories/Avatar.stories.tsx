import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { Avatar, AvatarGroup, AvatarWithStatus } from '../src'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Initials: Story = {
  args: { name: 'Felix Evers', size: 'md' },
}

export const Image: Story = {
  args: {
    name: 'Ada Lovelace',
    size: 'md',
    image: { source: { uri: 'https://i.pravatar.cc/100?img=5' }, alt: 'Ada Lovelace' },
  },
}

export const Group: StoryObj<typeof AvatarGroup> = {
  render: () => (
    <AvatarGroup
      size="md"
      avatars={[
        { name: 'Felix Evers' },
        { name: 'Ada Lovelace' },
        { name: 'Grace Hopper' },
        { name: 'Alan Turing' },
        { name: 'Katherine Johnson' },
        { name: 'Edsger Dijkstra' },
      ]}
    />
  ),
}

export const WithStatus: StoryObj<typeof AvatarWithStatus> = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <AvatarWithStatus name="On" status="online" />
      <AvatarWithStatus name="Aw" status="away" />
      <AvatarWithStatus name="Bs" status="busy" />
      <AvatarWithStatus name="Of" status="offline" />
    </View>
  ),
}
