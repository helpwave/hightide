import {
  Text,
  View
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'

import { ChatConversationRow } from '@/src/components/chat/ChatConversationRow'
import { useTheme } from '@/src/global-contexts/theme/ThemeContext'

const meta = {
  component: ChatConversationRow,
} satisfies Meta<typeof ChatConversationRow>

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

export const chatConversationRow: Story = {
  args: {
    avatar: <AvatarPlaceholder initials="AW" />,
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
        avatar={<AvatarPlaceholder initials="JP" />}
        title="Praxis am Park"
        timestamp="Gestern"
        preview="Ihr Termin wurde bestätigt."
        onPress={action('press-read')}
      />
    </View>
  ),
}
