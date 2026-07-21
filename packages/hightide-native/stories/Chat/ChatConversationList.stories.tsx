import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'
import { Text, View } from 'react-native'
import { ChatConversationList } from '@/src/components/chat/ChatConversationList'
import { ChatConversationRow } from '@/src/components/chat/ChatConversationRow'
import { useTheme } from '@/src/global-contexts/theme'

const meta = {
  component: ChatConversationList,
} satisfies Meta<typeof ChatConversationList>

export default meta
type Story = StoryObj<typeof meta>

const AvatarPlaceholder = ({ initials }: { initials: string }) => {
  const { theme } = useTheme()

  return (
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: theme.semantic.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: theme.semantic.onPrimary, fontWeight: '700' }}>{initials}</Text>
    </View>
  )
}

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
          avatar={<AvatarPlaceholder initials="AW" />}
          title="Dr. Anna Wellermann"
          timestamp="09:24"
          preview="Perfekt, ich habe den Befund erhalten."
          unreadCount={2}
          onPress={action('row-1')}
        />
        <ChatConversationRow
          avatar={<AvatarPlaceholder initials="JP" />}
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
