import {
  Text,
  View
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { CalendarDays } from 'lucide-react-native'

import { ChatMessageCard } from '../../src/components/chat/ChatMessageCard'
import { Button } from '../../src/components/user-interaction/Button'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'

const meta = {
  component: ChatMessageCard,
} satisfies Meta<typeof ChatMessageCard>

export default meta
type Story = StoryObj<typeof meta>

const CardStory = () => {
  const { theme } = useTheme()

  return (
    <ChatMessageCard
      direction="incoming"
      title="Terminbestätigung"
      subtitle="Hausarztpraxis"
      icon={<CalendarDays size={18} color={theme.semantic.primary} />}
      actions={(
        <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
          <Button size="sm" coloringStyle="tonal" style={{ flex: 1 }}>Ablehnen</Button>
          <Button size="sm" style={{ flex: 1 }}>Annehmen</Button>
        </View>
      )}
    >
      <Text style={{ color: theme.semantic.onSurface, fontSize: 14, fontWeight: '500' }}>
        Mittwoch, 15:30 Uhr
      </Text>
      <Text style={{ color: theme.semantic.description, fontSize: 12 }}>
        Praxis am Park, Zimmer 2
      </Text>
    </ChatMessageCard>
  )
}

export const chatMessageCard: Story = {
  args: {
    title: 'Terminbestätigung',
  },
  render: () => (
    <View style={{ padding: 16 }}>
      <CardStory />
    </View>
  ),
}
