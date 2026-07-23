import {
  Text,
  View
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'

import { ChatConversationList } from '../../src/components/chat/ChatConversationList'
import { ChatConversationRow } from '../../src/components/chat/ChatConversationRow'
import { AvatarWithStatus } from '../../src/components/visualization-and-display/Avatar'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'

const meta = {
  component: ChatConversationList,
} satisfies Meta<typeof ChatConversationList>

export default meta
type Story = StoryObj<typeof meta>

const ConversationListDemo = () => {
  const { theme } = useTheme()

  return (
    <View style={{ height: 420, maxWidth: 420 }}>
      <ChatConversationList
        header={(
          <Text style={{ color: theme.semantic.primary, fontSize: 20, fontWeight: '700' }}>
            Chats
          </Text>
        )}
      >
        <ChatConversationRow
          avatar={(
            <AvatarWithStatus
              name="Anna Wellermann"
              status="online"
              size="lg"
            />
          )}
          title="Dr. Anna Wellermann"
          timestamp="09:24"
          preview="Perfekt, ich habe den Befund erhalten."
          unreadCount={2}
          onPress={action('row-1')}
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
          onPress={action('row-2')}
        />
      </ChatConversationList>
    </View>
  )
}

export const chatConversationList: Story = {
  args: {},
  render: () => <ConversationListDemo />,
}
