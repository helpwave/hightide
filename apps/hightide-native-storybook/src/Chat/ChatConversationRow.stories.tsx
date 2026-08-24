import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { ChatConversationRow, AvatarWithStatus } from '@helpwave/hightide-native/components'

const meta = {
  component: ChatConversationRow,
} satisfies Meta<typeof ChatConversationRow>

export default meta
type Story = StoryObj<typeof meta>

export const chatConversationRow: Story = {
  args: {
    avatar: (
      <AvatarWithStatus
        name="Anna Wellermann"
        status="online"
        size="lg"
      />
    ),
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
        avatar={(
          <AvatarWithStatus
            name="Jonas Parker"
            status="offline"
            size="lg"
          />
        )}
        title="Praxis am Park"
        timestamp="Gestern"
        preview="Ihr Termin wurde bestätigt."
        messageStatus="sent"
        onPress={action('press-read')}
      />
      <ChatConversationRow
        avatar={(
          <AvatarWithStatus
            name="Jonas Parker"
            status="offline"
            size="lg"
          />
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
