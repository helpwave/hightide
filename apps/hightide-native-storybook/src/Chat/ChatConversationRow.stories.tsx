import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { ChatConversationRow, Avatar } from '@helpwave/hightide-native/components'

const meta = {
  component: ChatConversationRow,
} satisfies Meta<typeof ChatConversationRow>

export default meta
type Story = StoryObj<typeof meta>

export const chatConversationRow: Story = {
  args: {
    avatarProps: {
      name: 'Anna Wellermann',
      status: 'online',
    },
    title: 'Dr. Anna Wellermann',
    timestamp: '09:24',
    preview: 'Perfekt, ich habe den Befund erhalten.',
    unreadCount: 2,
    messageStatus: 'received',
    onPress: action('press'),
  },
  render: (args) => (
    <View style={{ maxWidth: 420 }}>
      <ChatConversationRow {...args} />
      <ChatConversationRow
        avatarProps={{
          name: 'Jonas Parker',
          status: 'offline',
        }}
        title="Praxis am Park"
        timestamp="Gestern"
        preview="Ihr Termin wurde bestätigt."
        messageStatus="sent"
        onPress={action('press-read')}
      />
      <ChatConversationRow
        avatarOverride={(
          <Avatar name="Jonas Parker" />
        )}
        title="Praxis am Park"
        timestamp="Gestern"
        preview="Ihr Termin wurde bestätigt."
        onPress={action('press-read')}
        unreadCount={10}
      />
    </View>
  ),
}
