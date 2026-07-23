import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'

import { ChatConversationRow } from '../../src/components/chat/ChatConversationRow'
import { AvatarWithStatus } from '../../src/components/visualization-and-display/Avatar'

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
    sentIndicator: 'sentAndReceived',
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
        onPress={action('press-read')}
      />
    </View>
  ),
}
