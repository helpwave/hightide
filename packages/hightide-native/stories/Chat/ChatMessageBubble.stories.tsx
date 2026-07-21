import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { ChatMessageBubble } from '@/src/components/chat/ChatMessageBubble'
import type { ChatMessageDirection } from '@/src/components/chat/ChatMessageBubble'

const meta = {
  component: ChatMessageBubble,
  argTypes: {
    direction: {
      control: 'select',
      options: ['incoming', 'outgoing'] satisfies ChatMessageDirection[],
    },
  },
} satisfies Meta<typeof ChatMessageBubble>

export default meta
type Story = StoryObj<typeof meta>

export const chatMessageBubble: Story = {
  args: {
    direction: 'outgoing',
    timestamp: '09:24',
    readReceipt: 'Gelesen',
    children: 'Perfekt, ich habe den Befund erhalten. Bis Mittwoch!',
  },
  render: (args) => (
    <View style={{ gap: 12, maxWidth: 384, padding: 16 }}>
      <ChatMessageBubble direction="incoming" timestamp="09:12">
        Guten Tag Herr Wellermann, wir haben die Ergebnisse Ihrer Blutuntersuchung erhalten.
      </ChatMessageBubble>
      <ChatMessageBubble {...args} />
    </View>
  ),
}
