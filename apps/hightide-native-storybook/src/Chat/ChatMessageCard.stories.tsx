import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { CalendarDays } from 'lucide-react-native'
import { View } from 'react-native'

import type {
  ChatMessageBubbleProps } from '@helpwave/hightide-native/components'
import {
  Button,
  ChatMessageBubble,
  ThemedText
} from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

const meta = {
  component: ChatMessageBubble,
} satisfies Meta<typeof ChatMessageBubble>

export default meta
type Story = StoryObj<typeof meta>

const CardStory = (args: ChatMessageBubbleProps) => {
  const { theme } = useTheme()

  return (
    <ChatMessageBubble {...args}>
      <View style={{ flexDirection: 'column', gap: theme.spacing.md, width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: theme.spacing.md, paddingBottom: theme.spacing.md, borderBottomWidth: theme.border.thin, borderColor: theme.colors.border }}>
          <View
            style={{
              width: theme.elements.container.sm.size,
              height: theme.elements.container.sm.size,
              borderRadius: theme.borderRadius.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${theme.colors.primary.color}26`,
            }}
          >
            <CalendarDays size={theme.icongraphy.sizes.sm} color={theme.colors.primary.color} />
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', gap: theme.spacing.xxs, alignSelf: 'stretch' }}>
            <ThemedText style={{ ...theme.typography.body.md, fontWeight: theme.typography.fontWeights.semibold }} numberOfLines={1}>
              Terminbestätigung
            </ThemedText>
            <ThemedText appearance="description" style={{ ...theme.typography.body.sm }}>
              Hausarztpraxis
            </ThemedText>
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: theme.spacing.xs }}>
          <ThemedText>
            Mittwoch, 15:30 Uhr
          </ThemedText>
          <ThemedText appearance="description" style={{ ...theme.typography.body.sm }}>
            Praxis am Park, Zimmer 2
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: theme.spacing.md }}>
          <Button size="sm" variant="tonal">Ablehnen</Button>
          <Button size="sm">Annehmen</Button>
        </View>
      </View>
    </ChatMessageBubble>
  )
}

export const chatMessageCard: Story = {
  args: {
    direction: 'incoming',
    timestamp: '15:30',
  },
  render: (args) => (
    <CardStory {...args} />
  ),
}
