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
import { View } from 'react-native'

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
        <>
          <Button size="sm" variant="tonal">Ablehnen</Button>
          <Button size="sm">Annehmen</Button>
        </>
      )}
    >
      <View style={{ flexDirection: 'column', gap: theme.spacing.xs }}>
        <ThemedText style={{ fontSize: 14, fontWeight: '500' }}>
        Mittwoch, 15:30 Uhr
        </ThemedText>
        <ThemedText appearance="description" style={{ fontSize: 12 }}>
        Praxis am Park, Zimmer 2
        </ThemedText>
      </View>
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
