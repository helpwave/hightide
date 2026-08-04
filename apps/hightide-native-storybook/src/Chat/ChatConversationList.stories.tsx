import {
  Text,
  View
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react'
import { action } from 'storybook/actions'

import {
  ChatConversationList,
  ChatConversationRow,
  AvatarWithStatus,
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

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
          <Text style={{ color: theme.colorSchemes.primary.text.base.foreground, fontSize: 20, fontWeight: '700' }}>
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
