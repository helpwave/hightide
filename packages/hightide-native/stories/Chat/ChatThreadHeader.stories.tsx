import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'

import { ChatThreadHeader } from '../../src/components/chat/ChatThreadHeader'
import { AvatarWithStatus } from '../../src/components/visualization-and-display/Avatar'

const meta = {
  component: ChatThreadHeader,
} satisfies Meta<typeof ChatThreadHeader>

export default meta
type Story = StoryObj<typeof meta>

export const chatThreadHeader: Story = {
  args: {
    avatar: (
      <AvatarWithStatus
        name="Anna Wellermann"
        status="online"
        size="md"
      />
    ),
    title: 'Dr. Anna Wellermann',
    subtitle: 'Online',
  },
  render: (args) => (
    <View style={{ maxWidth: 420 }}>
      <ChatThreadHeader {...args} />
    </View>
  ),
}
