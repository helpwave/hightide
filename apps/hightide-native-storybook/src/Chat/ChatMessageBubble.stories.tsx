import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'

import {
  ChatMessageBubble,
  type ChatMessageDirection,
  type ChatMessageStatus
} from '@helpwave/hightide-native/components'
import { ThemeContext } from '@helpwave/hightide-native/global-contexts'

const meta = {
  component: ChatMessageBubble,
  argTypes: {
    direction: {
      control: 'select',
      options: ['incoming', 'outgoing'] satisfies ChatMessageDirection[],
    },
    messageStatus: {
      control: 'select',
      options: ['sent', 'sending', 'received', 'read'] satisfies ChatMessageStatus[],
    },
  },
} satisfies Meta<typeof ChatMessageBubble>

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageBubble: Story = {
  args: {
    direction: 'outgoing',
    timestamp: new Date('2026-08-24T09:24:00'),
    messageStatus: 'read',
    children: 'Perfekt, ich habe den Befund erhalten. Bis Mittwoch!',
  },
  render: (args) => (
    <ThemeContext.Consumer>
      {(context) => (
        <View style={{ gap: 12, maxWidth: 384, padding: 16, backgroundColor: context?.theme.colors.surface.color }}>
          <ChatMessageBubble direction="incoming" timestamp={new Date('2026-08-24T09:12:00')}>
            Guten Tag Herr Wellermann, wir haben die Ergebnisse Ihrer Blutuntersuchung erhalten.
          </ChatMessageBubble>
          <ChatMessageBubble {...args} />
        </View>
      )}
    </ThemeContext.Consumer>
  ),
}
