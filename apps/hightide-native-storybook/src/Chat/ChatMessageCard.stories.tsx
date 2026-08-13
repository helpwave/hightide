import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { CalendarDays } from 'lucide-react-native'

import {
  ChatMessageCard,
  Button,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

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
      icon={<CalendarDays size={18} color={theme.colors.primary.color} />}
      actions={(
        <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
          <Button size="sm" variant="tonal" style={{ flex: 1 }}>Ablehnen</Button>
          <Button size="sm" style={{ flex: 1 }}>Annehmen</Button>
        </View>
      )}
    >
      <ThemedText style={{ fontSize: 14, fontWeight: '500' }}>
        Mittwoch, 15:30 Uhr
      </ThemedText>
      <ThemedText appearance="description" style={{ fontSize: 12 }}>
        Praxis am Park, Zimmer 2
      </ThemedText>
    </ChatMessageCard>
  )
}

export const chatMessageCard: Story = {
  args: {
    title: 'Terminbestätigung',
  },
  render: () => (
    <CardStory />
  ),
}
