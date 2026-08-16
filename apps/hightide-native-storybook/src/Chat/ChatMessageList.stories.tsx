import { View } from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'

import {
  ChatDateDivider,
  ChatMessageBubble,
  ChatMessageList,
  ChatSystemLine
} from '@helpwave/hightide-native/components'

const meta = {
  component: ChatMessageList,
} satisfies Meta<typeof ChatMessageList>

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageList: Story = {
  args: {},
  render: () => (
    <View style={{ height: 420, maxWidth: 420 }}>
      <ChatMessageList>
        <ChatDateDivider>Heute</ChatDateDivider>
        <ChatMessageBubble direction="incoming" timestamp="09:12">
          Guten Tag, wir haben Ihre Ergebnisse erhalten.
        </ChatMessageBubble>
        <ChatMessageBubble direction="outgoing" timestamp="09:24" readReceipt="Gelesen">
          Vielen Dank, ich schaue sie mir an.
        </ChatMessageBubble>
        <ChatSystemLine>Nachricht zugestellt</ChatSystemLine>
      </ChatMessageList>
    </View>
  ),
}
